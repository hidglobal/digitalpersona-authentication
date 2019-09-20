import { __extends, __read } from "tslib";
import { User, Ticket, Credential } from '@digitalpersona/core';
import { CustomAction } from './actions';
import { Authenticator } from '../../private';
function OTP(data) {
    return new Credential(Credential.OneTimePassword, data);
}
/**
 * Time-based one-time password (TOTP) authentication API.
 * TOTP supports only authentication. Identification is not supported.
 */
var TimeOtpAuth = /** @class */ (function (_super) {
    __extends(TimeOtpAuth, _super);
    /** Constructs a new TOTP authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function TimeOtpAuth(authService) {
        return _super.call(this, authService) || this;
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
    TimeOtpAuth.prototype.authenticate = function (identity, code) {
        return _super.prototype._authenticate.call(this, identity, OTP(code));
    };
    /** Creates a code allowing to unlock a hardware TOTP device when it locks after a number of
     * unsuccessful PIN entries.
     * @param userOrSerialNumber - a username or a locked device serial number.
     * @param challenge - a challenge code provided by the locked device user.
     * @param token - an optional JSON Web Token of the locked device user.
     * @returns a promise to return an unlock code that the locked device user must type in.
     */
    TimeOtpAuth.prototype.getUnlockCode = function (userOrSerialNumber, challenge, token) {
        var _a = __read((userOrSerialNumber instanceof User)
            ? [userOrSerialNumber, null]
            : [User.Anonymous(), userOrSerialNumber], 2), user = _a[0], serialNumber = _a[1];
        return this.authService
            .CustomAction(CustomAction.UnlockActiveIdHardwareToken, new Ticket(token || ""), user, OTP({ challenge: challenge, serialNumber: serialNumber }));
    };
    return TimeOtpAuth;
}(Authenticator));
export { TimeOtpAuth };
/**
 * A one-time password authentication API based on Push Notifications (Push OTP).
 * Push OTP supports only authentication. Identification is not supported.
 */
var PushOtpAuth = /** @class */ (function (_super) {
    __extends(PushOtpAuth, _super);
    /** Constructs a new Push OTP authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function PushOtpAuth(authService) {
        return _super.call(this, authService) || this;
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
    PushOtpAuth.prototype.authenticate = function (identity) {
        return _super.prototype._authenticate.call(this, identity, OTP("push"));
    };
    return PushOtpAuth;
}(Authenticator));
export { PushOtpAuth };
/**
 * A one-time password authentication API based on a Short Message Service (SMS OTP).
 * SMS OTP supports only authentication. Identification is not supported.
 */
var SmsOtpAuth = /** @class */ (function (_super) {
    __extends(SmsOtpAuth, _super);
    /** Constructs a new SMS OTP authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function SmsOtpAuth(authService) {
        return _super.call(this, authService) || this;
    }
    /** Sends an SMS challenge with a OTP code to the user's registered mobile device.
     * @param user - a name of the user
     * @returns a promise to send the challenge code.
     */
    SmsOtpAuth.prototype.sendChallenge = function (user) {
        return this.authService
            .CustomAction(CustomAction.SendSMSRequest, Ticket.None(), user, OTP())
            .then();
    };
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
    SmsOtpAuth.prototype.authenticate = function (identity, code) {
        return _super.prototype._authenticate.call(this, identity, OTP(code));
    };
    return SmsOtpAuth;
}(Authenticator));
export { SmsOtpAuth };
/**
 * A one-time password authentication API based on a electronic mail (Email OTP).
 * Email OTP supports only authentication. Identification is not supported.
 */
var EmailOtpAuth = /** @class */ (function (_super) {
    __extends(EmailOtpAuth, _super);
    /** Constructs a new Email OTP authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function EmailOtpAuth(authService) {
        return _super.call(this, authService) || this;
    }
    /** Sends an e-mail challenge with a OTP code to the user's registered mobile device.
     * @param user - a name of the user
     * @returns a promise to send the challenge code to the registered e-mail address.
     * Will reject if user has no email or in case of any other error.
     * @remarks
     * The user has to have an email registered in their LADP user record in ActiveDirectory or LDS.
     * The server will look for a first entry in a `mail` LDAP atribute of the user record.
     */
    EmailOtpAuth.prototype.sendChallenge = function (user) {
        return this.authService
            .CustomAction(CustomAction.SendEmailRequest, Ticket.None(), user, OTP())
            .then();
    };
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
    EmailOtpAuth.prototype.authenticate = function (identity, code) {
        return _super.prototype._authenticate.call(this, identity, OTP(code));
    };
    return EmailOtpAuth;
}(Authenticator));
export { EmailOtpAuth };
//# sourceMappingURL=auth.js.map