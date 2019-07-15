import { JSONWebToken, User, Credential, CredentialId, Base64UrlString } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
export declare class AuthenticationData {
    readonly handle: number;
    readonly data: string;
}
export interface IAuthenticationClient {
    init(): Promise<AuthenticationData>;
    continue(handle: number, data: string): Promise<Base64UrlString>;
    term(handle: number): Promise<void>;
}
/** @internal */
export declare abstract class Authenticator {
    protected readonly authService: IAuthService;
    protected readonly authClient?: IAuthenticationClient | undefined;
    constructor(authService: IAuthService, authClient?: IAuthenticationClient | undefined);
    protected _authenticate(identity: User | JSONWebToken | null, credential: Credential | CredentialId): Promise<JSONWebToken>;
    _identify(cred: Credential): Promise<JSONWebToken>;
}
