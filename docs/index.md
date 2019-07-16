---
layout: default
title: Overview
has_toc: false
nav_order: 1  
---
{% include header.html %}

# Authentication API for {{ site.data.product.name }}

{% include dpam-intro.md %}

As a part of DPAM, the {{ site.data.lib.name }} provides web browsers with API
allowing to identify and authenticate users with various credentials using 
DPAM Web Services.

## Requirements

{% include reqs/platforms.md %}

{% include reqs/languages.md %}

### Browser support

{% include shims/promise.md %}

{% include shims/fetch.md %}

### Node JS support

{% include shims/node-base64.md %}

## Additional documentation:

* [Tutorial](./tutorial.md)
* [How-to](./how-to.md)
* [Reference](./reference.md)
