import { __extends } from "tslib";
import { Ticket, Credential } from '@digitalpersona/core';
import { CustomAction } from './actions';
import { Authenticator } from '../../private';
function Password(data) {
    return new Credential(Credential.Password, data);
}
/**
 * Password authentication API.
 * Passwords support only authentication. Identification is not supported.
 */
var PasswordAuth = /** @class */ (function (_super) {
    __extends(PasswordAuth, _super);
    /** Constructs a new password authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function PasswordAuth(authService) {
        return _super.call(this, authService) || this;
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
    PasswordAuth.prototype.authenticate = function (identity, password) {
        return _super.prototype._authenticate.call(this, identity, Password(password));
    };
    /** Creates a randomized user's password.
     * @param user - a user's name.
     * @param token - a JSON Web Token of a person initiating a password randomization.
     * This person must have a privilege to randomize user passwords.
     * @returns a promise to return a new randomized password.
     * @remarks
     * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
     * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
     */
    PasswordAuth.prototype.randomize = function (user, token) {
        return this.authService.CustomAction(CustomAction.PasswordRandomization, new Ticket(token), user, Password());
    };
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
    PasswordAuth.prototype.reset = function (user, newPassword, token) {
        return this.authService.CustomAction(CustomAction.PasswordReset, new Ticket(token), user, Password(newPassword))
            .then();
    };
    return PasswordAuth;
}(Authenticator));
export { PasswordAuth };
//# sourceMappingURL=auth.js.map