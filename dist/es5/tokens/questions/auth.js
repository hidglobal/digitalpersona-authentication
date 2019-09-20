import { __extends } from "tslib";
import { Credential, Utf16, Question } from '@digitalpersona/core';
import { Authenticator } from '../../private';
/**
 * Security Questions authentication API.
 * Security Questions support only authentication. Identification is not supported.
 */
var SecurityQuestionsAuth = /** @class */ (function (_super) {
    __extends(SecurityQuestionsAuth, _super);
    /** Constructs a new Security Questions authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    function SecurityQuestionsAuth(authService) {
        return _super.call(this, authService) || this;
    }
    /** Reads a list of security questions enrolled by the user.
     * @param user - a user's name.
     * @returns a promise to return a list of enrolled questions.
     */
    SecurityQuestionsAuth.prototype.getEnrolledQuestions = function (user) {
        return this.authService
            .GetEnrollmentData(user, Credential.SecurityQuestions)
            .then(function (data) {
            return JSON.parse(Utf16.fromBase64Url(data))
                .map(function (obj) { return Question.fromJson(obj); });
        });
    };
    /** Authenticates the user using user's answers to security questions.
     * @param identity - a {@link User |username} or a JSON Web Token.
     * @param answers - user's answers to security questions.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a Security Questions were used.
     * Will reject if authentication fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    SecurityQuestionsAuth.prototype.authenticate = function (identity, answers) {
        return _super.prototype._authenticate.call(this, identity, new Credential(Credential.SecurityQuestions, { answers: answers }));
    };
    return SecurityQuestionsAuth;
}(Authenticator));
export { SecurityQuestionsAuth };
//# sourceMappingURL=auth.js.map