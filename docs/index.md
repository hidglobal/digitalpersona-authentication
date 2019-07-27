---
layout: default
title: Overview
has_toc: false
nav_order: 1  
---
{% include header.html %}

# Overview

{% include dpam-intro.md %}

As a part of {{ site.data.product.shortName }}, the {{ site.data.lib.name }}
allows you to strengthen your web application security with multifactor authentication (MFA), working seamlessly with various authentication such as  fingerprint readers, card readers,
cameras for face recognition, FIDO tokens, OTP tokens, as well as with traditional credentials like passwords, PINs and Security Questions.

## Dependencies

The library depends on the:
* DigitalPersona Web Services API
* DigitalPersona Core API

It also requires the  DigitalPersona Web Components and DigitalPersona Authentication Server running in your security domain.

Some authentication tokens (fingerprints, cards, U2F, Integrated Windows Authentication)
require the DigitalPersona Device Access API to read authentication data from a device and pass it to 
the {{ site.data.lib.shortName }}.

## Requirements

{% include reqs/platforms.md %}

{% include reqs/languages.md %}

### Browser support

{% include shims/promise.md %}

{% include shims/fetch.md %}

### Node JS support

{% include shims/node-base64.md %}

{% include shims/node-fetch.md %}

## Additional documentation:

* [Tutorial](./tutorial.md)
* [How-to](./how-to.md)
* [Reference](./reference.md)
* [Library Maintenance](./maintain/index.md)
