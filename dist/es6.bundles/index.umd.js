(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@digitalpersona/core'), require('@digitalpersona/services'), require('u2f-api')) :
    typeof define === 'function' && define.amd ? define(['exports', '@digitalpersona/core', '@digitalpersona/services', 'u2f-api'], factory) :
    (global = global || self, factory((global.dp = global.dp || {}, global.dp.authentication = global.dp.authentication || {}), global.dp.core, global.dp.services, global.u2fApi));
}(this, function (exports, core, services, u2fApi) { 'use strict';

    /** @internal */
    var HandshakeStep;
    (function (HandshakeStep) {
        HandshakeStep[HandshakeStep["InitClient"] = 0] = "InitClient";
        HandshakeStep[HandshakeStep["InitServer"] = 1] = "InitServer";
        HandshakeStep[HandshakeStep["ContinueClient"] = 2] = "ContinueClient";
        HandshakeStep[HandshakeStep["ContinueServer"] = 3] = "ContinueServer";
    })(HandshakeStep || (HandshakeStep = {}));
    /** @internal
    Holds intermediate authentication workflow data and ensures workflow invariants.
    The authentication workflow essentially is a sequence of steps,
    where each step passes authentication data either from the client to the server,
    or from server to the client.
    The direction of data transfer on each step is determined by availability of
    data from an opposite side:
    * if serverData !== null, then next step is on a client side
    * if clientData !== null, then next step is on a server side
    Invariant: serverData and clientData must be never not-null at the same time
    (except on error).
    */
    class HandshakeContext {
        constructor(maxRounds = 3) {
            this.serverHandle = 0;
            this.clientHandle = 0;
            this.maxRounds = maxRounds;
        }
        nextStep() {
            return (!this.serverHandle) ? HandshakeStep.InitServer :
                (!this.clientHandle) ? HandshakeStep.InitClient :
                    (!this.clientData && this.serverData) ? HandshakeStep.ContinueClient :
                        (!this.serverData && this.clientData) ? HandshakeStep.ContinueServer :
                            (() => { throw new Error("Invalid state"); })();
        }
        withClientHandle(handle) {
            this.clientHandle = handle;
            this.serverData = null;
            return this;
        }
        withServerHandle(handle) {
            this.serverHandle = handle;
            this.clientData = null;
            return this;
        }
        withServerData(data) {
            this.serverData = data;
            this.clientData = null;
            if (!this.serverData)
                throw new Error("No server data");
            --this.maxRounds; // countdown on every server response
            if (this.maxRounds <= 0)
                throw new Error("Handshake stalled");
            return this;
        }
        withClientData(data) {
            this.clientData = data;
            this.serverData = null;
            if (!this.clientData)
                throw new Error("No client data");
            return this;
        }
    }

    /** @internal */
    class Authenticator {
        constructor(authService, authClient) {
            this.authService = authService;
            this.authClient = authClient;
            if (!this.authService)
                throw new Error("authService");
        }
        _authenticate(identity, credential) {
            return authenticate(identity, credential, this.authService, this.authClient);
        }
        _identify(cred) {
            return this.authService
                .Identify(cred)
                .then(ticket => ticket.jwt);
        }
    }
    /** @internal */
    function authenticate(identity, credential, server, client) {
        // When credential data are present, use a direct authentication flow
        if (credential instanceof core.Credential) {
            if (!identity)
                identity = core.User.Everyone();
            return (identity instanceof core.User
                ? server.Authenticate(identity, credential)
                : server.Authenticate(new core.Ticket(identity), credential)).then(ticket => ticket.jwt);
        }
        // When no credential data are present, use a challenge-response authentication flow
        if (!client)
            return Promise.reject(new Error("Client"));
        // Performs one step in an authentication workflow and recursively calls itself for a next step.
        // The workflow finishes when a token obtained, or an error produced.
        const nextStep = (ctx) => {
            switch (ctx.nextStep()) {
                case HandshakeStep.InitClient: {
                    return client
                        .init()
                        .then(data => nextStep(ctx.withClientHandle(data.handle).withClientData(data.data)));
                }
                case HandshakeStep.InitServer: {
                    return ((identity === null) || (identity instanceof core.User)
                        ? server.CreateAuthentication(identity, credential)
                        : server.CreateAuthentication(new core.Ticket(identity), credential))
                        .then(handle => nextStep(ctx.withServerHandle(handle)));
                }
                case HandshakeStep.ContinueClient: {
                    return client
                        .continue(ctx.clientHandle, ctx.serverData)
                        .then(clientData => nextStep(ctx.withClientData(clientData)));
                }
                case HandshakeStep.ContinueServer: {
                    return server
                        .ContinueAuthentication(ctx.serverHandle, core.Base64Url.fromUtf8(ctx.clientData))
                        .then(result => {
                        switch (result.status) {
                            case services.AuthenticationStatus.Error:
                                return Promise.reject(new Error("Authentication failed"));
                            case services.AuthenticationStatus.Continue:
                                return nextStep(ctx.withServerData(result.authData));
                            case services.AuthenticationStatus.Completed:
                                return Promise.resolve(result.jwt);
                            default:
                                throw new Error("Unexpected status");
                        }
                    });
                }
            }
        };
        // Start the workflow and extract a token (or throw an error) when ready.
        const context = new HandshakeContext();
        return nextStep(context)
            .catch(err => {
            // somehow exception thrown inside u2fApi does not automatically reject the promise, so forcing this here
            return Promise.reject(err);
        })
            .finally(() => {
            if (context.clientHandle)
                client.term(context.clientHandle); // ignore the outcome
            if (context.serverHandle)
                server.DestroyAuthentication(context.serverHandle); // ignore the outcome
        });
    }

    /**
     * Smart card authentication API.
     * Smartcards supports only authentication with PIN. Identification is not supported.
     */
    class SmartCardAuth extends Authenticator {
        /** Constructs a new smartcard authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Authenticates the user using a smartcard.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param cardData - card authentication data received from the card using a PIN.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a smartcard was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, cardData) {
            return super._authenticate(identity, new core.Credential(core.Credential.SmartCard, cardData));
        }
    }
    /**
     * Contactless card authentication API.
     * Contactless cards support both authentication and identification.
     */
    class ContactlessCardAuth extends Authenticator {
        /** Constructs a new contactless authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Authenticates the user using a contactless card.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param cardData - card authentication data received from the card using a `CardsReader.getCardAuthData`.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a contactless card was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, cardData) {
            return super._authenticate(identity, new core.Credential(core.Credential.ContactlessCard, cardData));
        }
        /** Identifies the user with a contactless card.
         * @param cardData - card authentication data received from the card using a `CardsReader.getCardAuthData`.
         * @returns a promise to return a JSON Web Token containing a subject identity claims (`sub`, `group`, etc)
         * and a claim (`crd`) showing the fact a contactless card was used.
         * Will reject if identification fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        identify(cardData) {
            return this.authService
                .Identify(new core.Credential(core.Credential.ContactlessCard, cardData))
                .then(ticket => ticket.jwt);
        }
    }
    /**
     * Proximity card authentication API.
     * Proximity cards support both authentication and identification.
     */
    class ProximityCardAuth extends Authenticator {
        /** Constructs a new proximity authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Authenticates the user using a proximimty card.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param cardData - card authentication data received from the card using a `CardsReader.getCardAuthData`.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a proximity card was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, cardData) {
            return super._authenticate(identity, new core.Credential(core.Credential.ProximityCard, cardData));
        }
        /** Identifies the user with a proximity card.
         * @param cardData - card authentication data received from the card using a `CardsReader.getCardAuthData`.
         * @returns a promise to return a JSON Web Token containing a subject identity claims (`sub`, `group`, etc)
         * and a claim (`crd`) showing the fact a proximity card was used.
         * Will reject if identification fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        identify(cardData) {
            return this.authService
                .Identify(new core.Credential(core.Credential.ProximityCard, cardData))
                .then(ticket => ticket.jwt);
        }
    }

    /** Finger positions. */
    (function (FingerPosition) {
        FingerPosition[FingerPosition["Unknown"] = 0] = "Unknown";
        FingerPosition[FingerPosition["RightThumb"] = 1] = "RightThumb";
        FingerPosition[FingerPosition["RightIndex"] = 2] = "RightIndex";
        FingerPosition[FingerPosition["RightMiddle"] = 3] = "RightMiddle";
        FingerPosition[FingerPosition["RightRing"] = 4] = "RightRing";
        FingerPosition[FingerPosition["RightLittle"] = 5] = "RightLittle";
        FingerPosition[FingerPosition["LeftThumb"] = 6] = "LeftThumb";
        FingerPosition[FingerPosition["LeftIndex"] = 7] = "LeftIndex";
        FingerPosition[FingerPosition["LeftMiddle"] = 8] = "LeftMiddle";
        FingerPosition[FingerPosition["LeftRing"] = 9] = "LeftRing";
        FingerPosition[FingerPosition["LeftLittle"] = 10] = "LeftLittle";
    })(exports.FingerPosition || (exports.FingerPosition = {}));
    /** A finger enrollment data. */
    class Finger {
        constructor(
        /** A finger position. */
        position) {
            this.position = position;
        }
        /** Creates a finger enrollment data object from a plain JSON object. */
        static fromJson(json) {
            const obj = json;
            return new Finger(obj.position);
        }
    }

    /**
     * Fingerprint authentication API.
     * Fingerprints support both authentication and identification.
     */
    class FingerprintsAuth extends Authenticator {
        /** Constructs a new fingerprint authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Reads a list of fingers currently enrolled by the user.
         * @param user - a user name
         * @returns a promise to return a list of enrolled fingers.
         * If no fingers are enrolled, an emty list will be returned.
         * May reject if the user is unknown or in case of an error.
         */
        getEnrolledFingers(user) {
            return this.authService
                .GetEnrollmentData(user, core.Credential.Fingerprints)
                .then(data => JSON.parse(core.Utf8.fromBase64Url(data))
                .map(item => Finger.fromJson(item)));
        }
        /** Authenticates the user using their fingerprint samples.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param samples - a collection of biometric samples with fingerprint scans.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a fingerprint was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, samples) {
            return super._authenticate(identity, new core.Credential(core.Credential.Fingerprints, samples));
        }
        /** Identifies the user with their fingerprints.
         * @param samples - a collection of biometric samples with fingerprint scans.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a fingerprint was used.
         * Will reject if identification fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        identify(samples) {
            return super._identify(new core.Credential(core.Credential.Fingerprints, samples));
        }
    }

    /**
     * Integrated Windows authentication API.
     * IWA support only authentication. Identification is not supported.
     */
    class WindowsAuth extends Authenticator {
        /** Constructs a new integrated Windows authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService, client) {
            super(authService, client);
        }
        /** Authenticates using a currently logged Windows user.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a currently logged Window account was used.
         * Will reject if authentication fails.
         */
        authenticate() {
            return super._authenticate(null, core.Credential.IWA);
        }
    }

    /**
     * Security Questions authentication API.
     * Security Questions support only authentication. Identification is not supported.
     */
    class SecurityQuestionsAuth extends Authenticator {
        /** Constructs a new Security Questions authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Reads a list of security questions enrolled by the user.
         * @param user - a user's name.
         * @returns a promise to return a list of enrolled questions.
         */
        getEnrolledQuestions(user) {
            return this.authService
                .GetEnrollmentData(user, core.Credential.SecurityQuestions)
                .then(data => JSON.parse(core.Utf16.fromBase64Url(data))
                .map(obj => core.Question.fromJson(obj)));
        }
        /** Authenticates the user using user's answers to security questions.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param answers - user's answers to security questions.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a Security Questions were used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, answers) {
            return super._authenticate(identity, new core.Credential(core.Credential.SecurityQuestions, { answers }));
        }
    }

    /**@internal */
    var CustomAction;
    (function (CustomAction) {
        CustomAction[CustomAction["SendEmailVerificationRequest"] = 16] = "SendEmailVerificationRequest";
        CustomAction[CustomAction["SendSMSRequest"] = 513] = "SendSMSRequest";
        CustomAction[CustomAction["SendEmailRequest"] = 514] = "SendEmailRequest";
        CustomAction[CustomAction["UnlockActiveIdHardwareToken"] = 515] = "UnlockActiveIdHardwareToken";
    })(CustomAction || (CustomAction = {}));

    function OTP(data) {
        return new core.Credential(core.Credential.OneTimePassword, data);
    }
    /**
     * Time-based one-time password (TOTP) authentication API.
     * TOTP supports only authentication. Identification is not supported.
     */
    class TimeOtpAuth extends Authenticator {
        /** Constructs a new TOTP authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Authenticates the user using user's TOTP code.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param code - a TOTP code.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a OTP was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, code) {
            return super._authenticate(identity, OTP(code));
        }
        /** Creates a code allowing to unlock a hardware TOTP device when it locks after a number of
         * unsuccessful PIN entries.
         * @param userOrSerialNumber - a username or a locked device serial number.
         * @param challenge - a challenge code provided by the locked device user.
         * @param token - an optional JSON Web Token of the locked device user.
         * @returns a promise to return an unlock code that the locked device user must type in.
         */
        getUnlockCode(userOrSerialNumber, challenge, token) {
            const [user, serialNumber] = (userOrSerialNumber instanceof core.User)
                ? [userOrSerialNumber, null]
                : [core.User.Anonymous(), userOrSerialNumber];
            return this.authService
                .CustomAction(CustomAction.UnlockActiveIdHardwareToken, new core.Ticket(token || ""), user, OTP({ challenge, serialNumber }));
        }
    }
    /**
     * A one-time password authentication API based on Push Notifications (Push OTP).
     * Push OTP supports only authentication. Identification is not supported.
     */
    class PushOtpAuth extends Authenticator {
        /** Constructs a new Push OTP authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Authenticates the user using a Push Notification on the user's registered mobile device.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a OTP was used. To resolve the promise, the user must accept a Push Notification sent to their
         * mobile device.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         *
         * The user must have a mobile device with a DigitalPersona authenticator app installed and
         * registered in the DigitalPersona server. The user will receive a Push Notification on their
         * mobile device via the app and must accept the notification to proceed. The promise returned
         * by the method will be resolved when the user accepts the notification, otherwise it will reject
         * with a timeout error.
         */
        authenticate(identity) {
            return super._authenticate(identity, OTP("push"));
        }
    }
    /**
     * A one-time password authentication API based on a Short Message Service (SMS OTP).
     * SMS OTP supports only authentication. Identification is not supported.
     */
    class SmsOtpAuth extends Authenticator {
        /** Constructs a new SMS OTP authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Sends an SMS challenge with a OTP code to the user's registered mobile device.
         * @param user - a name of the user
         * @returns a promise to send the challenge code.
         */
        sendChallenge(user) {
            return this.authService
                .CustomAction(CustomAction.SendSMSRequest, core.Ticket.None(), user, OTP())
                .then();
        }
        /** Authenticates the user using a challenge sent to the user's registered mobile device via SMS.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param code - a code the device user received via SMS challenge.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a OTP was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         *
         * The user must have a mobile device with a phone number registered in the DigitalPersona server.
         * The user will receive an SMS on their mobile device and must type the code sent with the message.
         */
        authenticate(identity, code) {
            return super._authenticate(identity, OTP(code));
        }
    }
    /**
     * A one-time password authentication API based on a electronic mail (Email OTP).
     * Email OTP supports only authentication. Identification is not supported.
     */
    class EmailOtpAuth extends Authenticator {
        /** Constructs a new Email OTP authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Sends an e-mail challenge with a OTP code to the user's registered mobile device.
         * @param user - a name of the user
         * @returns a promise to send the challenge code to the registered e-mail address.
         * Will reject if user has no email or in case of any other error.
         * @remarks
         * The user has to have an email registered in their LADP user record in ActiveDirectory or LDS.
         * The server will look for a first entry in a `mail` LDAP atribute of the user record.
         */
        sendChallenge(user) {
            return this.authService
                .CustomAction(CustomAction.SendEmailRequest, core.Ticket.None(), user, OTP())
                .then();
        }
        /** Authenticates the user using a challenge sent to the user's registered e-mail address.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param code - a code the user received via e-mail challenge.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a OTP was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, code) {
            return super._authenticate(identity, OTP(code));
        }
    }

    /**@internal */
    var CustomAction$1;
    (function (CustomAction) {
        CustomAction[CustomAction["PasswordRandomization"] = 4] = "PasswordRandomization";
        CustomAction[CustomAction["PasswordReset"] = 13] = "PasswordReset";
    })(CustomAction$1 || (CustomAction$1 = {}));

    function Password(data) {
        return new core.Credential(core.Credential.Password, data);
    }
    /**
     * Password authentication API.
     * Passwords support only authentication. Identification is not supported.
     */
    class PasswordAuth extends Authenticator {
        /** Constructs a new password authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Authenticates the user using user's password.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param password - a user's password.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a password was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, password) {
            return super._authenticate(identity, Password(password));
        }
        /** Creates a randomized user's password.
         * @param user - a user's name.
         * @param token - a JSON Web Token of a person initiating a password randomization.
         * This person must have a privilege to randomize user passwords.
         * @returns a promise to return a new randomized password.
         * @remarks
         * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
         * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
         */
        randomize(user, token) {
            return this.authService.CustomAction(CustomAction$1.PasswordRandomization, new core.Ticket(token), user, Password());
        }
        /** Resets user's password.
         * @param user - a user's name.
         * @param newPassword - a new password to replace the old password.
         * @param token - a JSON Web Token of a person initiating a password reset.
         * This person must have a privilege to set users' passwords.
         * @returns a promise to reset user's password.
         * @remarks
         * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
         * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
         */
        reset(user, newPassword, token) {
            return this.authService.CustomAction(CustomAction$1.PasswordReset, new core.Ticket(token), user, Password(newPassword))
                .then();
        }
    }

    /**
     * Personal Identification Number (PIN) authentication API.
     * PIN support only authentication. Identification is not supported.
     */
    class PinAuth extends Authenticator {
        /** Constructs a new PIN authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Authenticates the user using user's PIN code.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param pin - a user's PIN.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a PIN was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, pin) {
            return super._authenticate(identity, new core.Credential(core.Credential.PIN, pin));
        }
    }

    /**
     * Face authentication API.
     * Face credential supports authentication. Identification is currently not supported by the server.
     */
    class FaceAuth extends Authenticator {
        /** Constructs a new face authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService);
        }
        /** Authenticates the user using their face images.
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @param samples - a collection of biometric samples with face images.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a face was used.
         * Will reject if authentication fails.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         */
        authenticate(identity, samples) {
            return super._authenticate(identity, new core.Credential(core.Credential.Face, samples));
        }
        /** Currently face identification is not supported by the server. */
        identify(samples) {
            return super._identify(new core.Credential(core.Credential.Face, samples));
        }
    }

    /**@internal */
    var CustomAction$2;
    (function (CustomAction) {
        CustomAction[CustomAction["RequestAppId"] = 17] = "RequestAppId";
    })(CustomAction$2 || (CustomAction$2 = {}));

    /**@internal
     *
     */
    /**@internal
     *
     */
    var HandshakeType;
    (function (HandshakeType) {
        HandshakeType[HandshakeType["ChallengeRequest"] = 0] = "ChallengeRequest";
        HandshakeType[HandshakeType["ChallengeResponse"] = 1] = "ChallengeResponse";
        HandshakeType[HandshakeType["AuthenticationRequest"] = 2] = "AuthenticationRequest";
        HandshakeType[HandshakeType["AuthenticationResponse"] = 3] = "AuthenticationResponse";
    })(HandshakeType || (HandshakeType = {}));
    class HandshakeData {
        constructor() {
            this.handshakeType = 0 /* ChallengeRequest */;
        }
    }

    /**@internal
     *
     * Implements the client's part of the U2F handshake protocol.
     */
    class U2FClient {
        init() {
            const challenge = new HandshakeData();
            return Promise.resolve({
                handle: 1,
                data: JSON.stringify(challenge)
            });
        }
        continue(handle, data) {
            const handshake = JSON.parse(data);
            if (handshake.handshakeType != 1 /* ChallengeResponse */)
                return Promise.reject(new Error("Unexpected handshake type"));
            if (!handshake.handshakeData)
                return Promise.reject(new Error("No handshake data"));
            const signRequest = JSON.parse(core.Utf16.fromBase64Url(handshake.handshakeData));
            return u2fApi.sign(signRequest)
                .then(signResponse => {
                const handshakeData = JSON.stringify({
                    serialNum: "",
                    version: signRequest.version,
                    appId: signRequest.appId,
                    signatureData: signResponse.signatureData,
                    clientData: signResponse.clientData
                });
                var response = {
                    handshakeType: 2 /* AuthenticationRequest */,
                    handshakeData: core.Base64Url.fromUtf16(handshakeData)
                };
                return JSON.stringify(response);
            });
        }
        term(handle) {
            // nothing to do, the handle is surrogate
            return Promise.resolve();
        }
    }

    /**
     * Universal Second Factor (U2F) authentication API.
     * U2F support only authentication. Identification is not supported.
     */
    class U2FAuth extends Authenticator {
        /** Constructs a new U2F authentication API object.
         * @param authService - an {@link AuthService|authentication service client} connected to the server.
         */
        constructor(authService) {
            super(authService, new U2FClient());
        }
        /** Checks is the U2F supported on this platform.
         * @returns a promise to return `true` is the platform supports U2F or `false` otherwise.
         * @remarks
         * To support U2F the user agent must have required API, the web site must use HTTPS,
         * and the DigitalPersona Web Components server must have properly configured U2F AppId
         * for the site.
         */
        static isSupported() {
            return u2fApi.isSupported();
        }
        /** Reads U2F AppID endpoint URL.
         * @returns a promise to return a U2F AppID endpoint URL.
         */
        getAppId() {
            return this.authService.CustomAction(CustomAction$2.RequestAppId, core.Ticket.None(), core.User.Anonymous(), new core.Credential(core.Credential.U2F, "")).then(data => JSON.parse(data).AppId);
        }
        /** Authenticates the user using a user's registered U2F token (FIDO token).
         * @param identity - a {@link User |username} or a JSON Web Token.
         * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
         * a U2F was used. To resolve the promise, the user must touch the U2F token when prompted.
         * Will reject if authentication fails or times out.
         * @remarks
         * If the `identity` parameter is a user name, a new token will be created.
         * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
         *
         * The user must have a U2F (FIDO) token enrolled in the DigitalPersona server.
         * The user should insert the token and activate it using a touch or pressing a device button.
         * The promise returned by the method will be resolved after the user activates the token,
         * otherwise it will reject with a timeout error.
         */
        authenticate(identity) {
            return super._authenticate(identity, core.Credential.U2F);
        }
    }

    exports.ContactlessCardAuth = ContactlessCardAuth;
    exports.EmailOtpAuth = EmailOtpAuth;
    exports.FaceAuth = FaceAuth;
    exports.Finger = Finger;
    exports.FingerprintsAuth = FingerprintsAuth;
    exports.PasswordAuth = PasswordAuth;
    exports.PinAuth = PinAuth;
    exports.ProximityCardAuth = ProximityCardAuth;
    exports.PushOtpAuth = PushOtpAuth;
    exports.SecurityQuestionsAuth = SecurityQuestionsAuth;
    exports.SmartCardAuth = SmartCardAuth;
    exports.SmsOtpAuth = SmsOtpAuth;
    exports.TimeOtpAuth = TimeOtpAuth;
    exports.U2FAuth = U2FAuth;
    exports.WindowsAuth = WindowsAuth;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
