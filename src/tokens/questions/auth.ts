import { User, Credential, IAuthService, Utf16, JSONWebToken, SecurityQuestions, Questions, Answers, Question } from '@digitalpersona/access-management';
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
