import { Ticket, User, Credential, Base64Url } from '@digitalpersona/core';
import { AuthenticationStatus } from '@digitalpersona/services';
import { HandshakeStep, HandshakeContext } from './handshake';
var AuthenticationData = /** @class */ (function () {
    function AuthenticationData() {
    }
    return AuthenticationData;
}());
export { AuthenticationData };
/** @internal */
var Authenticator = /** @class */ (function () {
    function Authenticator(authService, authClient) {
        this.authService = authService;
        this.authClient = authClient;
        if (!this.authService)
            throw new Error("authService");
    }
    Authenticator.prototype._authenticate = function (identity, credential) {
        return authenticate(identity, credential, this.authService, this.authClient);
    };
    Authenticator.prototype._identify = function (cred) {
        return this.authService
            .Identify(cred)
            .then(function (ticket) { return ticket.jwt; });
    };
    return Authenticator;
}());
export { Authenticator };
/** @internal */
function authenticate(identity, credential, server, client) {
    // When credential data are present, use a direct authentication flow
    if (credential instanceof Credential) {
        if (!identity)
            identity = User.Everyone();
        return (identity instanceof User
            ? server.Authenticate(identity, credential)
            : server.Authenticate(new Ticket(identity), credential)).then(function (ticket) { return ticket.jwt; });
    }
    // When no credential data are present, use a challenge-response authentication flow
    if (!client)
        return Promise.reject(new Error("Client"));
    // Performs one step in an authentication workflow and recursively calls itself for a next step.
    // The workflow finishes when a token obtained, or an error produced.
    var nextStep = function (ctx) {
        switch (ctx.nextStep()) {
            case HandshakeStep.InitClient: {
                return client
                    .init()
                    .then(function (data) { return nextStep(ctx.withClientHandle(data.handle).withClientData(data.data)); });
            }
            case HandshakeStep.InitServer: {
                return ((identity === null) || (identity instanceof User)
                    ? server.CreateAuthentication(identity, credential)
                    : server.CreateAuthentication(new Ticket(identity), credential))
                    .then(function (handle) { return nextStep(ctx.withServerHandle(handle)); });
            }
            case HandshakeStep.ContinueClient: {
                return client
                    .continue(ctx.clientHandle, ctx.serverData)
                    .then(function (clientData) { return nextStep(ctx.withClientData(clientData)); });
            }
            case HandshakeStep.ContinueServer: {
                return server
                    .ContinueAuthentication(ctx.serverHandle, Base64Url.fromUtf8(ctx.clientData))
                    .then(function (result) {
                    switch (result.status) {
                        case AuthenticationStatus.Error:
                            return Promise.reject(new Error("Authentication failed"));
                        case AuthenticationStatus.Continue:
                            return nextStep(ctx.withServerData(result.authData));
                        case AuthenticationStatus.Completed:
                            return Promise.resolve(result.jwt);
                        default:
                            throw new Error("Unexpected status");
                    }
                });
            }
        }
    };
    // Start the workflow and extract a token (or throw an error) when ready.
    var context = new HandshakeContext();
    return nextStep(context)
        .catch(function (err) {
        // somehow exception thrown inside u2fApi does not automatically reject the promise, so forcing this here
        return Promise.reject(err);
    })
        .finally(function () {
        if (context.clientHandle)
            client.term(context.clientHandle); // ignore the outcome
        if (context.serverHandle)
            server.DestroyAuthentication(context.serverHandle); // ignore the outcome
    });
}
//# sourceMappingURL=authentication.js.map