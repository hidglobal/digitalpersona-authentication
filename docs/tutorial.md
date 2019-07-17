---
layout: default
title: Tutorial
has_toc: false
nav_order: 2
---
{% include header.html %}

# Tutorial

## Getting started

### Add the package to your project

Using NPM:

```
npm install {{site.data.lib.package}}
```

Using Yarn:

```
yarn add {{site.data.lib.package}}
```

### Write some code

We recommend using Typescrypt or ES6 modules.
Import needed types from the {{ site.data.lib.package }} module,
for example:

```
import { JSONWebToken, BioSample } from '@digitalpersona/core';
import { FingerprintsAuth } from '@digitalpersona/authentication';

...
async submitFingerprints(samples: BioSample[], identity?: JSONWebToken)
: JSONWebToken | null
{
    try {
        const api = new FingerprintsAuth(...);

        const token = await (
            identity
                ? api.authenticate(identity, samples)
                : api.identify(samples)
        );
        return token;
    }
    catch (error) {
        handleError(error);
        return null;
    }
}
```

## Using Components

{% capture apiDocsBaseUrl %}{{site.data.lib.git}}/{{site.data.lib.repo}}/blob/master/dist/api/docs/authentication{% endcapture%}

> For working examples see a ["Bank of DigitalPersona"](https://github.com/hidglobal/digitalpersona-sample-angularjs) sample application.

### "What you know" authentication factors

* [PasswordAuth]({{apiDocsBaseUrl}}.PasswordAuth.md)
* [PinAuth]({{apiDocsBaseUrl}}.PinAuth.md)
* [SecurityQuestionsAuth]({{apiDocsBaseUrl}}.SecurityQuestionsAuth.md)

### "What you are" authentication factors

* [FingerprintsAuth](({{apiDocsBaseUrl}}.FingerprintsAuth.md))
* [FaceAuth](({{apiDocsBaseUrl}}.FaceAuth.md))

### "What you have" authentication factors

* [SmartCardAuth](({{apiDocsBaseUrl}}.SmartCardAuth.md))
* [ContactlessCardAuth](({{apiDocsBaseUrl}}.ContactlessCardAuth.md))
* [ProximityCardAuth](({{apiDocsBaseUrl}}.ProximityCardAuth.md))
* [U2FAuth](({{apiDocsBaseUrl}}.U2FAuth.md))
* [TimeOtpAuth](({{apiDocsBaseUrl}}.TimeOtpAuth.md))
* [SmsOtpAuth](({{apiDocsBaseUrl}}.SmsOtpAuth.md))
* [EmailOtpAuth](({{apiDocsBaseUrl}}.EmailOtpAuth.md))


### Federated authentication

* [WindowsAuth](({{apiDocsBaseUrl}}.WindowsAuth.md))
