import { __extends } from "tslib";
import { Utf8, Credential } from '@digitalpersona/core';
import { Finger } from './data';
import { Authenticator } from '../../private';
/**
 * Fingerprint authentication API.
 * Fingerprints support both authentication and identification.
 */
var FingerprintsAuth = /** @class */ (function (_super) {
    __extends(FingerprintsAuth, _super);
    /** Constructs a new fingerprint authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function FingerprintsAuth(authService) {
        return _super.call(this, authService) || this;
    }
    /** Reads a list of fingers currently enrolled by the user.
     * @param user - a user name
     * @returns a promise to return a list of enrolled fingers.
     * If no fingers are enrolled, an emty list will be returned.
     * May reject if the user is unknown or in case of an error.
     */
    FingerprintsAuth.prototype.getEnrolledFingers = function (user) {
        return this.authService
            .GetEnrollmentData(user, Credential.Fingerprints)
            .then(function (data) {
            return JSON.parse(Utf8.fromBase64Url(data))
                .map(function (item) { return Finger.fromJson(item); });
        });
    };
    /** Authenticates the user using their fingerprint samples.
     * @param identity - a {@link User |username} or a JSON Web Token.
     * @param samples - a collection of biometric samples with fingerprint scans.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a fingerprint was used.
     * Will reject if authentication fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    FingerprintsAuth.prototype.authenticate = function (identity, samples) {
        return _super.prototype._authenticate.call(this, identity, new Credential(Credential.Fingerprints, samples));
    };
    /** Identifies the user with their fingerprints.
     * @param samples - a collection of biometric samples with fingerprint scans.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a fingerprint was used.
     * Will reject if identification fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    FingerprintsAuth.prototype.identify = function (samples) {
        return _super.prototype._identify.call(this, new Credential(Credential.Fingerprints, samples));
    };
    return FingerprintsAuth;
}(Authenticator));
export { FingerprintsAuth };
//# sourceMappingURL=auth.js.map