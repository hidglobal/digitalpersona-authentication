import { User, IAuthService, JSONWebToken, PIN } from '@digitalpersona/access-management';
import { Authenticator } from '../../private';

export class PinAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService)
    }

    public authenticate(identity: User|JSONWebToken, pin: string): Promise<JSONWebToken> {
        return super._authenticate(identity, new PIN(pin));
    }
}
