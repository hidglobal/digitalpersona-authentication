import { User, JSONWebToken } from '@digitalpersona/core';
import { IAuthService } from '@digitalpersona/services';
import { Authenticator } from '../../private';
/**
 * Smart card authentication API.
 * Smartcards supports only authentication with PIN. Identification is not supported.
 */
export declare class SmartCardAuth extends Authenticator {
    /** Constructs a new smartcard authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService);
    /** Authenticates the user using a smartcard.
     * @param identity - a {@link User |username} or a JSON Web Token.
     * @param cardData - card authentication data received from the card using a PIN.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a smartcard was used.
     * Will reject if authentication fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    authenticate(identity: User | JSONWebToken, cardData: string): Promise<JSONWebToken>;
}
/**
 * Contactless card authentication API.
 * Contactless cards support both authentication and identification.
 */
export declare class ContactlessCardAuth extends Authenticator {
    /** Constructs a new contactless authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService);
    /** Authenticates the user using a contactless card.
     * @param identity - a {@link User |username} or a JSON Web Token.
     * @param cardData - card authentication data received from the card using a `CardsReader.getCardAuthData`.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a contactless card was used.
     * Will reject if authentication fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    authenticate(identity: User | JSONWebToken, cardData: string): Promise<JSONWebToken>;
    /** Identifies the user with a contactless card.
     * @param cardData - card authentication data received from the card using a `CardsReader.getCardAuthData`.
     * @returns a promise to return a JSON Web Token containing a subject identity claims (`sub`, `group`, etc)
     * and a claim (`crd`) showing the fact a contactless card was used.
     * Will reject if identification fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    identify(cardData: string): Promise<JSONWebToken>;
}
/**
 * Proximity card authentication API.
 * Proximity cards support both authentication and identification.
 */
export declare class ProximityCardAuth extends Authenticator {
    /** Constructs a new proximity authentication API object.
     * @param authService - an {@link AuthService|authentication service client} connected to the server.
     */
    constructor(authService: IAuthService);
    /** Authenticates the user using a proximimty card.
     * @param identity - a {@link User |username} or a JSON Web Token.
     * @param cardData - card authentication data received from the card using a `CardsReader.getCardAuthData`.
     * @returns a promise to return a JSON Web Token containing a claim (`crd`) showing the fact
     * a proximity card was used.
     * Will reject if authentication fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    authenticate(identity: User | JSONWebToken, cardData: string): Promise<JSONWebToken>;
    /** Identifies the user with a proximity card.
     * @param cardData - card authentication data received from the card using a `CardsReader.getCardAuthData`.
     * @returns a promise to return a JSON Web Token containing a subject identity claims (`sub`, `group`, etc)
     * and a claim (`crd`) showing the fact a proximity card was used.
     * Will reject if identification fails.
     * @remarks
     * If the `identity` parameter is a user name, a new token will be created.
     * If the `identity` parameter is a JSON Web Token, an updated token will be returned.
     */
    identify(cardData: string): Promise<JSONWebToken>;
}
