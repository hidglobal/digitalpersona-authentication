import { User, Ticket, JSONWebToken, Credential } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { CustomAction } from './actions';
import { Authenticator } from '../../private';

function Password(data?: string|object|null): Credential {
    return new Credential(Credential.Password, data);
}

/**
 * Password authentication API.
 * Passwords support only authentication. Identification is not supported.
 */
export class PasswordAuth extends Authenticator
{
    /** Constructs a new password authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService) {
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
    public authenticate(
        identity: User|JSONWebToken,
        password: string,
    ): Promise<JSONWebToken>
    {
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
    public randomize(
        user: User,
        token: JSONWebToken,
    ): Promise<string>
    {
        return this.authService.CustomAction(
            CustomAction.PasswordRandomization,
            new Ticket(token),
            user,
            Password());
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
    public reset(
        user: User,
        newPassword: string,
        token: JSONWebToken,
    ): Promise<void>
    {
        return this.authService.CustomAction(
            CustomAction.PasswordReset,
            new Ticket(token),
            user,
            Password(newPassword))
        .then();
    }
}
