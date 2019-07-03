import { User, JSONWebToken, Ticket, Credential } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { CustomAction } from './actions';
import { Authenticator } from '../../private';

function OTP(data?: string|object|null): Credential {
    return new Credential(Credential.OneTimePassword, data);
}

/**
 * Time-based one-time password (TOTP) authentication API.
 * TOTP supports only authentication. Identification is not supported.
 */
export class TimeOtpAuth extends Authenticator
{
    /** Constructs a new TOTP authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService) {
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
    public authenticate(
        identity: User|JSONWebToken,
        code: string,
    ): Promise<JSONWebToken>
    {
        return super._authenticate(identity, OTP(code));
    }

    /** Creates a code allowing to unlock a hardware TOTP device when it locks after a number of
     * unsuccessful PIN entries.
     * @param userOrSerialNumber - a username or a locked device serial number.
     * @param challenge - a challenge code provided by the locked device user.
     * @param token - an optional JSON Web Token of the locked device user.
     * @returns a promise to return an unlock code that the locked device user must type in.
     */
    public getUnlockCode(
        userOrSerialNumber: User|string,
        challenge: string,
        token?: JSONWebToken,
    ): Promise<string>
    {
        const [ user, serialNumber ] =
            (userOrSerialNumber instanceof User)
                ? [ userOrSerialNumber, null ]
                : [ User.Anonymous(), userOrSerialNumber];
        return this.authService
            .CustomAction(CustomAction.UnlockActiveIdHardwareToken,
                new Ticket(token || ""),
                user,
                OTP({ challenge, serialNumber }));
    }
}

/**
 * A one-time password authentication API based on Push Notifications (Push OTP).
 * Push OTP supports only authentication. Identification is not supported.
 */
export class PushOtpAuth extends Authenticator
{
    /** Constructs a new Push OTP authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService) {
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
    public authenticate(
        identity: User|JSONWebToken,
    ): Promise<JSONWebToken>
    {
        return super._authenticate(identity, OTP("push"));
    }
}

/**
 * A one-time password authentication API based on a Short Message Service (SMS OTP).
 * SMS OTP supports only authentication. Identification is not supported.
 */
export class SmsOtpAuth extends Authenticator
{
    /** Constructs a new SMS OTP authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService) {
        super(authService);
    }

    /** Sends an SMS challenge with a OTP code to the user's registered mobile device.
     * @param user - a name of the user
     * @returns a promise to send the challenge code.
     */
    public sendChallenge(
        user: User,
    ): Promise<void>
    {
        return this.authService
            .CustomAction(CustomAction.SendSMSRequest, Ticket.None(), user, OTP())
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
    public authenticate(
        identity: User|JSONWebToken,
        code: string,
    ): Promise<JSONWebToken>
    {
        return super._authenticate(identity, OTP(code));
    }
}

/**
 * A one-time password authentication API based on a electronic mail (Email OTP).
 * Email OTP supports only authentication. Identification is not supported.
 */
export class EmailOtpAuth extends Authenticator
{
    /** Constructs a new Email OTP authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService) {
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
    public sendChallenge(
        user: User,
    ): Promise<void>
    {
        return this.authService
            .CustomAction(CustomAction.SendEmailRequest, Ticket.None(), user, OTP())
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
    public authenticate(
        identity: User|JSONWebToken,
        code: string,
    ): Promise<JSONWebToken>
    {
        return super._authenticate(identity, OTP(code));
    }
}
