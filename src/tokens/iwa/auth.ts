import { Credential, JSONWebToken } from '@digitalpersona/core';
import { IAuthService, IAuthenticationClient } from '@digitalpersona/services';
import { Authenticator } from '../../private';

export class WindowsAuth extends Authenticator
{
    constructor(authService: IAuthService, client: IAuthenticationClient) {
        super(authService, client)
    }

    public authenticate(): Promise<JSONWebToken> {
        return super._authenticate(null, Credential.IWA);
    }
}

