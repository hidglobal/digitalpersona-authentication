/**@internal
 *
 */
export class ClientData {
    constructor(type, challenge, origin) {
        this.typ = type;
        this.challenge = challenge;
        this.origin = origin;
    }
    forAuthentication(challenge, origin) {
        return new ClientData("navigator.id.getAssertion", challenge, origin);
    }
    forEnrollment(challenge, origin) {
        return new ClientData("navigator.id.finishEnrollment", challenge, origin);
    }
}
/**@internal
 *
 */
export var HandshakeType;
(function (HandshakeType) {
    HandshakeType[HandshakeType["ChallengeRequest"] = 0] = "ChallengeRequest";
    HandshakeType[HandshakeType["ChallengeResponse"] = 1] = "ChallengeResponse";
    HandshakeType[HandshakeType["AuthenticationRequest"] = 2] = "AuthenticationRequest";
    HandshakeType[HandshakeType["AuthenticationResponse"] = 3] = "AuthenticationResponse";
})(HandshakeType || (HandshakeType = {}));
export class HandshakeData {
    constructor() {
        this.handshakeType = 0 /* ChallengeRequest */;
    }
}
//# sourceMappingURL=data.js.map