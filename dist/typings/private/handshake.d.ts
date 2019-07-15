import { AuthenticationHandle } from '@digitalpersona/services';
/** @internal */
export declare enum HandshakeStep {
    InitClient = 0,
    InitServer = 1,
    ContinueClient = 2,
    ContinueServer = 3
}
/** @internal
Holds intermediate authentication workflow data and ensures workflow invariants.
The authentication workflow essentially is a sequence of steps,
where each step passes authentication data either from the client to the server,
or from server to the client.
The direction of data transfer on each step is determined by availability of
data from an opposite side:
* if serverData !== null, then next step is on a client side
* if clientData !== null, then next step is on a server side
Invariant: serverData and clientData must be never not-null at the same time
(except on error).
*/
export declare class HandshakeContext {
    maxRounds: number;
    serverHandle: AuthenticationHandle;
    clientHandle: AuthenticationHandle;
    serverData?: string | null;
    clientData?: string | null;
    constructor(maxRounds?: number);
    nextStep(): HandshakeStep;
    withClientHandle(handle: AuthenticationHandle): this;
    withServerHandle(handle: AuthenticationHandle): this;
    withServerData(data?: string): this;
    withClientData(data?: string): this;
}
