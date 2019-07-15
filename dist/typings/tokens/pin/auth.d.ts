import { User, JSONWebToken } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Authenticator } from '../../private';
/**
 * Personal Identification Number (PIN) authentication API.
 * PIN support only authentication. Identification is not supported.
 */
export declare class PinAuth extends Authenticator {
    /** Constructs a new PIN authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService);
    /** Authenticates the user using user's PIN code.
     * @param identity - a {@link User |username} or a JSON Web Token.
     * @param pin - a user's PIN.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a PIN was used.
     * Will reject if authentication fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    authenticate(identity: User | JSONWebToken, pin: string): Promise<JSONWebToken>;
}
