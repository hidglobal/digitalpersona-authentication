import { __extends } from "tslib";
import { Credential } from '@digitalpersona/core';
import { Authenticator } from '../../private';
/**
 * Integrated Windows authentication API.
 * IWA support only authentication. Identification is not supported.
 */
var WindowsAuth = /** @class */ (function (_super) {
    __extends(WindowsAuth, _super);
    /** Constructs a new integrated Windows authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function WindowsAuth(authService, client) {
        return _super.call(this, authService, client) || this;
    }
    /** Authenticates using a currently logged Windows user.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a currently logged Window account was used.
     * Will reject if authentication fails.
     */
    WindowsAuth.prototype.authenticate = function () {
        return _super.prototype._authenticate.call(this, null, Credential.IWA);
    };
    return WindowsAuth;
}(Authenticator));
export { WindowsAuth };
//# sourceMappingURL=auth.js.map