<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@digitalpersona/authentication](./authentication.md) &gt; [PinAuth](./authentication.pinauth.md) &gt; [authenticate](./authentication.pinauth.authenticate.md)

## PinAuth.authenticate() method

Authenticates the user using user's PIN code.

<b>Signature:</b>

```typescript
authenticate(identity: User | JSONWebToken, pin: string): Promise<JSONWebToken>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  identity | <code>User &#124; JSONWebToken</code> | a  or a JSON Web Token. |
|  pin | <code>string</code> | a user's PIN. |

<b>Returns:</b>

`Promise<JSONWebToken>`

a promise to return a JSON Web Token containing a claim (`crd`<!-- -->) showing the fact a PIN was used. Will reject if authentication fails.

## Remarks

If the `identity` parameter is a user name, a new token will be created. If the `identity` parameter is a JSON Web Token, an updated token will be returned.
