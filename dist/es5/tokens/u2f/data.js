/**@internal
 *
 */
var ClientData = /** @class */ (function () {
    function ClientData(type, challenge, origin) {
        this.typ = type;
        this.challenge = challenge;
        this.origin = origin;
    }
    ClientData.prototype.forAuthentication = function (challenge, origin) {
        return new ClientData("navigator.id.getAssertion", challenge, origin);
    };
    ClientData.prototype.forEnrollment = function (challenge, origin) {
        return new ClientData("navigator.id.finishEnrollment", challenge, origin);
    };
    return ClientData;
}());
export { ClientData };
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
var HandshakeData = /** @class */ (function () {
    function HandshakeData() {
        this.handshakeType = 0 /* ChallengeRequest */;
    }
    return HandshakeData;
}());
export { HandshakeData };
//# sourceMappingURL=data.js.map