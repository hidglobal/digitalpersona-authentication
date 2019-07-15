import { Ticket, User, Credential, Base64Url } from '@digitalpersona/core';
import { AuthenticationStatus } from '@digitalpersona/services';
import { HandshakeStep, HandshakeContext } from './handshake';
export class AuthenticationData {
}
/** @internal */
export class Authenticator {
    constructor(authService, authClient) {
        this.authService = authService;
        this.authClient = authClient;
        if (!this.authService)
            throw new Error("authService");
    }
    _authenticate(identity, credential) {
        return authenticate(identity, credential, this.authService, this.authClient);
    }
    _identify(cred) {
        return this.authService
            .Identify(cred)
            .then(ticket => ticket.jwt);
    }
}
/** @internal */
function authenticate(identity, credential, server, client) {
    // When credential data are present, use a direct authentication flow
    if (credential instanceof Credential) {
        if (!identity)
            identity = User.Everyone();
        return (identity instanceof User
            ? server.Authenticate(identity, credential)
            : server.Authenticate(new Ticket(identity), credential)).then(ticket => ticket.jwt);
    }
    // When no credential data are present, use a challenge-response authentication flow
    if (!client)
        return Promise.reject(new Error("Client"));
    // Performs one step in an authentication workflow and recursively calls itself for a next step.
    // The workflow finishes when a token obtained, or an error produced.
    const nextStep = (ctx) => {
        switch (ctx.nextStep()) {
            case HandshakeStep.InitClient: {
                return client
                    .init()
                    .then(data => nextStep(ctx.withClientHandle(data.handle).withClientData(data.data)));
            }
            case HandshakeStep.InitServer: {
                return ((identity === null) || (identity instanceof User)
                    ? server.CreateAuthentication(identity, credential)
                    : server.CreateAuthentication(new Ticket(identity), credential))
                    .then(handle => nextStep(ctx.withServerHandle(handle)));
            }
            case HandshakeStep.ContinueClient: {
                return client
                    .continue(ctx.clientHandle, ctx.serverData)
                    .then(clientData => nextStep(ctx.withClientData(clientData)));
            }
            case HandshakeStep.ContinueServer: {
                return server
                    .ContinueAuthentication(ctx.serverHandle, Base64Url.fromUtf8(ctx.clientData))
                    .then(result => {
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
    const context = new HandshakeContext();
    return nextStep(context)
        .catch(err => {
        // somehow exception thrown inside u2fApi does not automatically reject the promise, so forcing this here
        return Promise.reject(err);
    })
        .finally(() => {
        if (context.clientHandle)
            client.term(context.clientHandle); // ignore the outcome
        if (context.serverHandle)
            server.DestroyAuthentication(context.serverHandle); // ignore the outcome
    });
}
//# sourceMappingURL=authentication.js.map