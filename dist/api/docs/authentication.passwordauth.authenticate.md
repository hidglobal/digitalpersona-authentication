<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@digitalpersona/authentication](./authentication.md) &gt; [PasswordAuth](./authentication.passwordauth.md) &gt; [authenticate](./authentication.passwordauth.authenticate.md)

## PasswordAuth.authenticate() method

Authenticates the user using user's password.

<b>Signature:</b>

```typescript
authenticate(identity: User | JSONWebToken, password: string): Promise<JSONWebToken>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  identity | <code>User &#124; JSONWebToken</code> | a  or a JSON Web Token. |
|  password | <code>string</code> | a user's password. |

<b>Returns:</b>

`Promise<JSONWebToken>`

a promise to return a JSON Web Token containing a claim (`crd`<!-- -->) showing the fact a password was used. Will reject if authentication fails.

## Remarks

If the `identity` parameter is a user name, a new token will be created. If the `identity` parameter is a JSON Web Token, an updated token will be returned.

