import * as u2fApi from 'u2f-api';
import { Utf16, Base64Url } from '@digitalpersona/core';
import { HandshakeData } from './data';
/**@internal
 *
 * Implements the client's part of the U2F handshake protocol.
 */
export class U2FClient {
    init() {
        const challenge = new HandshakeData();
        return Promise.resolve({
            handle: 1,
            data: JSON.stringify(challenge)
        });
    }
    continue(handle, data) {
        const handshake = JSON.parse(data);
        if (handshake.handshakeType != 1 /* ChallengeResponse */)
            return Promise.reject(new Error("Unexpected handshake type"));
        if (!handshake.handshakeData)
            return Promise.reject(new Error("No handshake data"));
        const signRequest = JSON.parse(Utf16.fromBase64Url(handshake.handshakeData));
        return u2fApi
            .sign(signRequest)
            .then(signResponse => {
            const handshakeData = JSON.stringify({
                serialNum: "",
                version: signRequest.version,
                appId: signRequest.appId,
                signatureData: signResponse.signatureData,
                clientData: signResponse.clientData
            });
            var response = {
                handshakeType: 2 /* AuthenticationRequest */,
                handshakeData: Base64Url.fromUtf16(handshakeData)
            };
            return JSON.stringify(response);
        });
    }
    term(handle) {
        // nothing to do, the handle is surrogate
        return Promise.resolve();
    }
}
//# sourceMappingURL=client.js.map