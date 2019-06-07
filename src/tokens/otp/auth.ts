import { User, JSONWebToken, Ticket, Credential } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { CustomAction } from './actions';
import { Authenticator } from '../../private';

function OTP(data?: string|object|null): Credential {
    return new Credential(Credential.OneTimePassword, data);
}

export class TimeOtpAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService);
    }

    // Authenticate the user using user's response on the challenge
    public authenticate(identity: User|JSONWebToken, code: string) {
        return super._authenticate(identity, OTP(code));
    }

    public getUnlockCode(userOrSerialNumber: User|string, challenge: string, token?: JSONWebToken) {
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

export class PushOtpAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService);
    }

    // Authenticate the user using user's response on the challenge
    public authenticate(identity: User|JSONWebToken) {
        return super._authenticate(identity, OTP("push"));
    }
}

export class SmsOtpAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService);
    }

    // send a verification code using SMS to the user's verified device
    public sendChallenge(user: User): Promise<void> {
        return this.authService
            .CustomAction(CustomAction.SendSMSRequest, Ticket.None(), user, OTP())
            .then(_ => {});
    }

    public authenticate(identity: User|JSONWebToken, code: string): Promise<JSONWebToken>
    {
        return super._authenticate(identity, OTP(code));
    }
}

export class EmailOtpAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService);
    }

    // send a verification code using SMS to the user's verified device
    public sendChallenge(user: User): Promise<void> {
        return this.authService
            .CustomAction(CustomAction.SendEmailRequest, Ticket.None(), user, OTP())
            .then(_ => {});
    }

    public authenticate(identity: User|JSONWebToken, code: string): Promise<JSONWebToken>
    {
        return super._authenticate(identity, OTP(code));
    }
}
