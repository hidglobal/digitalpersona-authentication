import { User, JSONWebToken, Credential } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Authenticator } from '../../private';

export class SmartCardAuth extends Authenticator
{
    constructor(authService: IAuthService) {
        super(authService);
    }

    // Authenticates the user using the card.
    // For contactless/proximity cards this method is usually called on tap (from the onCardInserted event handler).
    // For smart cards this method is usually called when the user types and submits a PIN.
    public authenticate(identity: User|JSONWebToken, cardData: string): Promise<JSONWebToken>
    {
        return super._authenticate(identity, new Credential(Credential.SmartCard, cardData));
    }
}

export class ContactlessCardAuth extends Authenticator
{
    constructor(authService: IAuthService){
        super(authService);
    }
    // Authenticates the user using the card.
    // For contactless/proximity cards this method is usually called on tap (from the onCardInserted event handler).
    // For smart cards this method is usually called when the user types and submits a PIN.
    public authenticate(identity: User|JSONWebToken, cardData: string): Promise<JSONWebToken>
    {
        return super._authenticate(identity, new Credential(Credential.ContactlessCard, cardData));
    }

    public identify(cardData: string): Promise<JSONWebToken>
    {
        return this.authService
            .Identify(new Credential(Credential.ContactlessCard, cardData))
            .then(ticket => ticket.jwt);
    }
}

export class ProximityCardAuth extends Authenticator
{
    constructor(authService: IAuthService){
        super(authService);
    }

    // Authenticates the user using the card.
    // For contactless/proximity cards this method is usually called on tap (from the onCardInserted event handler).
    // For smart cards this method is usually called when the user types and submits a PIN.
    public authenticate(identity: User|JSONWebToken, cardData: string): Promise<JSONWebToken>
    {
        return super._authenticate(identity, new Credential(Credential.ProximityCard, cardData));
    }
    public identify(cardData: string): Promise<JSONWebToken>
    {
        return this.authService
            .Identify(new Credential(Credential.ProximityCard, cardData))
            .then(ticket => ticket.jwt);
    }
}
