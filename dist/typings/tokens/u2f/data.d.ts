import { Base64UrlString } from "@digitalpersona/core";
/**@internal
 *
 */
declare type ClientDataType = "navigator.id.getAssertion" | "navigator.id.finishEnrollment";
/**@internal
 *
 */
export declare class ClientData {
    readonly typ: ClientDataType;
    readonly challenge: Base64UrlString;
    readonly origin: string;
    private constructor();
    forAuthentication(challenge: string, origin: string): ClientData;
    forEnrollment(challenge: Base64UrlString, origin: string): ClientData;
}
/**@internal
 *
 */
export declare const enum HandshakeType {
    ChallengeRequest = 0,
    ChallengeResponse = 1,
    AuthenticationRequest = 2,
    AuthenticationResponse = 3
}
export declare class HandshakeData {
    handshakeType: HandshakeType;
    handshakeData: string | null;
}
export {};
