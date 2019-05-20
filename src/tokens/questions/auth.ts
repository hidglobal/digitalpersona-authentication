import { User, Credential, Utf16, JSONWebToken, SecurityQuestions, Questions, Answers, Question } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Authenticator } from '../../private';

export class SecurityQuestionsAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService)
    }

    public getQuestions(user: User): Promise<Questions>
    {
        return this.authService
            .GetEnrollmentData(user, Credential.SecurityQuestions)
            .then(data =>
                (JSON.parse(Utf16.fromBase64Url(data)) as object[])
                .map(obj => Question.fromJson(obj)));
    }

    public authenticate(identity: User|JSONWebToken, answers: Answers): Promise<JSONWebToken>
    {
        return super._authenticate(identity, new SecurityQuestions({ answers}));
    }

}
