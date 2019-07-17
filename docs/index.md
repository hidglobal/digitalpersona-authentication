---
layout: default
title: Overview
has_toc: false
nav_order: 1  
---
{% include header.html %}

# Overview

{% include dpam-intro.md %}

As a part of {{ site.data.product.shortName }}, the {{ site.data.lib.name }} library
provides web browsers with API allowing to identify and authenticate users with 
various credentials using {{ site.data.product.shortName }} Web Services.

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
