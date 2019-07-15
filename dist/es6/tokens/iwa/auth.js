import { Credential } from '@digitalpersona/core';
import { Authenticator } from '../../private';
/**
 * Integrated Windows authentication API.
 * IWA support only authentication. Identification is not supported.
 */
export class WindowsAuth extends Authenticator {
    /** Constructs a new integrated Windows authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService, client) {
        super(authService, client);
    }
    /** Authenticates using a currently logged Windows user.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a currently logged Window account was used.
     * Will reject if authentication fails.
     */
    authenticate() {
        return super._authenticate(null, Credential.IWA);
    }
}
//# sourceMappingURL=auth.js.map