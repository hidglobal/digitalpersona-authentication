import { User, Credential, Utf16, JSONWebToken, Questions, Answers, Question } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Authenticator } from '../../private';

/**
 * Security Questions authentication API.
 * Security Questions support only authentication. Identification is not supported.
 */
export class SecurityQuestionsAuth extends Authenticator
{
    /** Constructs a new Security Questions authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService) {
        super(authService);
    }

    /** Reads a list of security questions enrolled by the user.
     * @param user - a user's name.
     * @returns a promise to return a list of enrolled questions.
     */
    public getEnrolledQuestions(user: User): Promise<Questions>
    {
        return this.authService
            .GetEnrollmentData(user, Credential.SecurityQuestions)
            .then(data =>
                (JSON.parse(Utf16.fromBase64Url(data)) as object[])
                .map(obj => Question.fromJson(obj)));
    }

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
    public authenticate(
        identity: User|JSONWebToken,
        answers: Answers,
    ): Promise<JSONWebToken>
    {
        return super._authenticate(identity, new Credential(Credential.SecurityQuestions, { answers }));
    }

}
