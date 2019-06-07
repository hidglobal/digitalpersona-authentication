import { User, Ticket, JSONWebToken, Credential } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { CustomAction } from './actions';
import { Authenticator } from '../../private';

function Password(data?: string|object|null): Credential {
    return new Credential(Credential.Password, data);
}
export class PasswordAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService);
    }

    public authenticate(identity: User|JSONWebToken, password: string): Promise<JSONWebToken> {
        return super._authenticate(identity, Password(password));
    }

    public randomize(user: User, token: JSONWebToken): Promise<string> {
        return this.authService.CustomAction(
            CustomAction.PasswordRandomization,
            new Ticket(token),
            user,
            Password());
    }

    public reset(user: User, newPassword: string, token: JSONWebToken): Promise<string> {
        return this.authService.CustomAction(
            CustomAction.PasswordReset,
            new Ticket(token),
            user,
            Password(newPassword));
    }
}
