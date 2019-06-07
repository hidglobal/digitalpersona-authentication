import { User, JSONWebToken, Credential } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Authenticator } from '../../private';

export class PinAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService);
    }

    public authenticate(identity: User|JSONWebToken, pin: string): Promise<JSONWebToken> {
        return super._authenticate(identity, new Credential(Credential.PIN, pin));
    }
}
