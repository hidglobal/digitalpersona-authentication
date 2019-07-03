<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@digitalpersona/authentication](./authentication.md) &gt; [PasswordAuth](./authentication.passwordauth.md)

## PasswordAuth class

Password authentication API. Passwords support only authentication. Identification is not supported.

<b>Signature:</b>

```typescript
export declare class PasswordAuth extends Authenticator 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(authService)](./authentication.passwordauth.(constructor).md) |  | Constructs a new password authentication API object. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [authenticate(identity, password)](./authentication.passwordauth.authenticate.md) |  | Authenticates the user using user's password. |
|  [randomize(user, token)](./authentication.passwordauth.randomize.md) |  | Creates a randomized user's password. |
|  [reset(user, newPassword, token)](./authentication.passwordauth.reset.md) |  | Resets user's password. |
