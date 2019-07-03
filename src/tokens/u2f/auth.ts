import * as u2fApi from 'u2f-api';
import { User, Credential, JSONWebToken, Ticket } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Authenticator } from '../../private';
import { CustomAction, U2FAppId } from './actions';
import { U2FClient } from './client';

/**
 * Universal Second Factor (U2F) authentication API.
 * U2F support only authentication. Identification is not supported.
 */
export class U2FAuth extends Authenticator
{
    /** Constructs a new U2F authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService) {
        super(authService, new U2FClient());
    }

    /** Checks is the U2F supported on this platform.
     * @returns a promise to return `true` is the platform supports U2F or `false` otherwise.
     * @remarks
     * To support U2F the user agent must have required API, the web site must use HTTPS,
     * and the DigitalPersona Web Components server must have properly configured U2F AppId
     * for the site.
     */
    public static isSupported(): Promise<boolean> {
        return u2fApi.isSupported();
    }

    /** Reads U2F AppID endpoint URL.
     * @returns a promise to return a U2F AppID endpoint URL.
     */
    public getAppId(): Promise<string> {
        return this.authService.CustomAction(
            CustomAction.RequestAppId,
            Ticket.None(),
            User.Anonymous(),
            new Credential(Credential.U2F, ""),
        ).then(data =>
             (JSON.parse(data) as U2FAppId).AppId);
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
    public authenticate(identity: User|JSONWebToken): Promise<JSONWebToken> {
        return super._authenticate(identity, Credential.U2F);
    }
}
