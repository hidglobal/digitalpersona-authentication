import { User, JSONWebToken, BioSample } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Fingers } from './data';
import { Authenticator } from '../../private';
/**
 * Fingerprint authentication API.
 * Fingerprints support both authentication and identification.
 */
export declare class FingerprintsAuth extends Authenticator {
    /** Constructs a new fingerprint authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService);
    /** Reads a list of fingers currently enrolled by the user.
     * @param user - a user name
     * @returns a promise to return a list of enrolled fingers.
     * If no fingers are enrolled, an emty list will be returned.
     * May reject if the user is unknown or in case of an error.
     */
    getEnrolledFingers(user: User): Promise<Fingers>;
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
    authenticate(identity: User | JSONWebToken, samples: BioSample[]): Promise<JSONWebToken>;
    /** Identifies the user with their fingerprints.
     * @param samples - a collection of biometric samples with fingerprint scans.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a fingerprint was used.
     * Will reject if identification fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    identify(samples: BioSample[]): Promise<JSONWebToken>;
}
