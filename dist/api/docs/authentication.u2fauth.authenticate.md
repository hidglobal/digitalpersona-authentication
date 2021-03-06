<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@digitalpersona/authentication](./authentication.md) &gt; [U2FAuth](./authentication.u2fauth.md) &gt; [authenticate](./authentication.u2fauth.authenticate.md)

## U2FAuth.authenticate() method

Authenticates the user using a user's registered U2F token (FIDO token).

<b>Signature:</b>

```typescript
authenticate(identity: User | JSONWebToken): Promise<JSONWebToken>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  identity | <code>User &#124; JSONWebToken</code> | a  or a JSON Web Token. |

<b>Returns:</b>

`Promise<JSONWebToken>`

a promise to return a JSON Web Token containing a claim (`crd`<!-- -->) showing the fact a U2F was used. To resolve the promise, the user must touch the U2F token when prompted. Will reject if authentication fails or times out.

## Remarks

If the `identity` parameter is a user name, a new token will be created. If the `identity` parameter is a JSON Web Token, an updated token will be returned.

The user must have a U2F (FIDO) token enrolled in the DigitalPersona server. The user should insert the token and activate it using a touch or pressing a device button. The promise returned by the method will be resolved after the user activates the token, otherwise it will reject with a timeout error.

