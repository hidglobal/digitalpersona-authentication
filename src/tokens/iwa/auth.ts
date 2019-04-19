import { Credential, JSONWebToken, IAuthService } from '@digitalpersona/access-management';
import { WindowsAuthClient } from '@digitalpersona/device-access';
import { Authenticator } from '../../private';

export class WindowsAuth extends Authenticator
{
    constructor(authService: IAuthService, client: WindowsAuthClient) {
        super(authService, client)
    }

    public authenticate(): Promise<JSONWebToken> {
        return super._authenticate(null, Credential.IWA);
    }
}

