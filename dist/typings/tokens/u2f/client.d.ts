import { Base64UrlString } from '@digitalpersona/core';
import { AuthenticationData, IAuthenticationClient } from '@digitalpersona/services';
/**@internal
 *
 * Implements the client's part of the U2F handshake protocol.
 */
export declare class U2FClient implements IAuthenticationClient {
    init(): Promise<AuthenticationData>;
    continue(handle: number, data: string): Promise<Base64UrlString>;
    term(handle: number): Promise<void>;
}
