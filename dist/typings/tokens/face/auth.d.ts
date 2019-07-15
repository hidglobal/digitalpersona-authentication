import { User, JSONWebToken, BioSample } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Authenticator } from '../../private';
/**
 * Face authentication API.
 * Face credential supports authentication. Identification is currently not supported by the server.
 */
export declare class FaceAuth extends Authenticator {
    /** Constructs a new face authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService);
    /** Authenticates the user using their face images.
     * @param identity - a {@link User |username} or a JSON Web Token.
     * @param samples - a collection of biometric samples with face images.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a face was used.
     * Will reject if authentication fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    authenticate(identity: User | JSONWebToken, samples: BioSample[]): Promise<JSONWebToken>;
    /** Currently face identification is not supported by the server. */
    identify(samples: BioSample[]): Promise<JSONWebToken>;
}
