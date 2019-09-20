import { __extends } from "tslib";
import { Credential } from '@digitalpersona/core';
import { Authenticator } from '../../private';
/**
 * Personal Identification Number (PIN) authentication API.
 * PIN support only authentication. Identification is not supported.
 */
var PinAuth = /** @class */ (function (_super) {
    __extends(PinAuth, _super);
    /** Constructs a new PIN authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function PinAuth(authService) {
        return _super.call(this, authService) || this;
    }
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
    PinAuth.prototype.authenticate = function (identity, pin) {
        return _super.prototype._authenticate.call(this, identity, new Credential(Credential.PIN, pin));
    };
    return PinAuth;
}(Authenticator));
export { PinAuth };
//# sourceMappingURL=auth.js.map