﻿import { Credential, JSONWebToken } from '@digitalpersona/core';
import { IAuthService, IAuthenticationClient } from '@digitalpersona/services';
import { Authenticator } from '../../private';

/**
 * Integrated Windows authentication API.
 * IWA support only authentication. Identification is not supported.
 */
export class WindowsAuth extends Authenticator
{
    /** Constructs a new integrated Windows authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService, client: IAuthenticationClient) {
        super(authService, client);
    }

    /** Authenticates using a currently logged Windows user.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a currently logged Window account was used.
     * Will reject if authentication fails.
     */
    public authenticate(): Promise<JSONWebToken> {
        return super._authenticate(null, Credential.IWA);
    }
}
