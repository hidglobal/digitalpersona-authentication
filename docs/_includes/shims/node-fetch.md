The library uses ES6 `fetch` API for HTTP connection. If it is used in Node JS,
you have to provide a "shim" adding the `fetch` API to NodeJS, for example a
[node-fetch](https://github.com/bitinn/node-fetch) by David Frank:

```
global.fetch = require('node-fetch');

```
