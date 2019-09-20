import { __extends } from "tslib";
import * as u2fApi from 'u2f-api';
import { User, Credential, Ticket } from '@digitalpersona/core';
import { Authenticator } from '../../private';
import { CustomAction } from './actions';
import { U2FClient } from './client';
/**
 * Universal Second Factor (U2F) authentication API.
 * U2F support only authentication. Identification is not supported.
 */
var U2FAuth = /** @class */ (function (_super) {
    __extends(U2FAuth, _super);
    /** Constructs a new U2F authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function U2FAuth(authService) {
        return _super.call(this, authService, new U2FClient()) || this;
    }
    /** Checks is the U2F supported on this platform.
     * @returns a promise to return `true` is the platform supports U2F or `false` otherwise.
     * @remarks
     * To support U2F the user agent must have required API, the web site must use HTTPS,
     * and the DigitalPersona Web Components server must have properly configured U2F AppId
     * for the site.
     */
    U2FAuth.isSupported = function () {
        return u2fApi.isSupported();
    };
    /** Reads U2F AppID endpoint URL.
     * @returns a promise to return a U2F AppID endpoint URL.
     */
    U2FAuth.prototype.getAppId = function () {
        return this.authService.CustomAction(CustomAction.RequestAppId, Ticket.None(), User.Anonymous(), new Credential(Credential.U2F, "")).then(function (data) {
            return JSON.parse(data).AppId;
        });
    };
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
    U2FAuth.prototype.authenticate = function (identity) {
        return _super.prototype._authenticate.call(this, identity, Credential.U2F);
    };
    return U2FAuth;
}(Authenticator));
export { U2FAuth };
//# sourceMappingURL=auth.js.map