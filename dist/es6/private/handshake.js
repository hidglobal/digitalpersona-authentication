/** @internal */
export var HandshakeStep;
(function (HandshakeStep) {
    HandshakeStep[HandshakeStep["InitClient"] = 0] = "InitClient";
    HandshakeStep[HandshakeStep["InitServer"] = 1] = "InitServer";
    HandshakeStep[HandshakeStep["ContinueClient"] = 2] = "ContinueClient";
    HandshakeStep[HandshakeStep["ContinueServer"] = 3] = "ContinueServer";
})(HandshakeStep || (HandshakeStep = {}));
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
export class HandshakeContext {
    constructor(maxRounds = 3) {
        this.serverHandle = 0;
        this.clientHandle = 0;
        this.maxRounds = maxRounds;
    }
    nextStep() {
        return (!this.serverHandle) ? HandshakeStep.InitServer :
            (!this.clientHandle) ? HandshakeStep.InitClient :
                (!this.clientData && this.serverData) ? HandshakeStep.ContinueClient :
                    (!this.serverData && this.clientData) ? HandshakeStep.ContinueServer :
                        (() => { throw new Error("Invalid state"); })();
    }
    withClientHandle(handle) {
        this.clientHandle = handle;
        this.serverData = null;
        return this;
    }
    withServerHandle(handle) {
        this.serverHandle = handle;
        this.clientData = null;
        return this;
    }
    withServerData(data) {
        this.serverData = data;
        this.clientData = null;
        if (!this.serverData)
            throw new Error("No server data");
        --this.maxRounds; // countdown on every server response
        if (this.maxRounds <= 0)
            throw new Error("Handshake stalled");
        return this;
    }
    withClientData(data) {
        this.clientData = data;
        this.serverData = null;
        if (!this.clientData)
            throw new Error("No client data");
        return this;
    }
}
//# sourceMappingURL=handshake.js.map