import { User, Utf8, JSONWebToken, Credential, BioSample } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Finger, Fingers } from './data';
import { Authenticator } from '../../private';

export class FingerprintsAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService);
    }

    public getEnrolledFingers(user: User): Promise<Fingers>
    {
        return this.authService
            .GetEnrollmentData(user, Credential.Fingerprints)
            .then(data =>
                (JSON.parse(Utf8.fromBase64Url(data)) as object[])
                .map(item => Finger.fromJson(item)),
            );
    }

    // Authenticates the user and returns a JSON Web Token.
    // Call this method when the fingerprint reader captures a biometric sample
    public authenticate(identity: User|JSONWebToken, samples: BioSample[]): Promise<JSONWebToken> {
        return super._authenticate(identity, new Credential(Credential.Fingerprints, samples));
    }

    public identify(samples: BioSample[]): Promise<JSONWebToken> {
        return super._identify(new Credential(Credential.Fingerprints, samples));
    }
}