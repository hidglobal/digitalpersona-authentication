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

> For working examples see a ["Bank of DigitalPersona"](https://github.com/hidglobal/digitalpersona-sample-angularjs){:target="_blank" }
sample application.

### "What you know" authentication factors

* [PasswordAuth]({{apiDocsBaseUrl}}.passwordauth.md){:target="_blank" }
* [PinAuth]({{apiDocsBaseUrl}}.pinauth.md){:target="_blank" }
* [SecurityQuestionsAuth]({{apiDocsBaseUrl}}.securityquestionsauth.md){:target="_blank" }

### "What you are" authentication factors

* [FingerprintsAuth](({{apiDocsBaseUrl}}.fingerprintsauth.md)){:target="_blank" }
* [FaceAuth](({{apiDocsBaseUrl}}.faceauth.md)){:target="_blank" }

### "What you have" authentication factors

* [SmartCardAuth](({{apiDocsBaseUrl}}.smartcardauth.md)){:target="_blank" }
* [ContactlessCardAuth](({{apiDocsBaseUrl}}.contactlesscardauth.md)){:target="_blank" }
* [ProximityCardAuth](({{apiDocsBaseUrl}}.proximitycardauth.md)){:target="_blank" }
* [U2FAuth](({{apiDocsBaseUrl}}.u2fauth.md)){:target="_blank" }
* [TimeOtpAuth](({{apiDocsBaseUrl}}.timeotpauth.md)){:target="_blank" }
* [SmsOtpAuth](({{apiDocsBaseUrl}}.smsotpauth.md)){:target="_blank" }
* [EmailOtpAuth](({{apiDocsBaseUrl}}.emailotpauth.md)){:target="_blank" }


### Federated authentication

* [WindowsAuth](({{apiDocsBaseUrl}}.windowsauth.md))
