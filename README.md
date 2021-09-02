# LinkShort-wrapper

![License](https://img.shields.io/github/license/Tch1b0/LinkShort.js)

## Installation

```sh
$ npm install linkshort
```

## Example

```js
const { LinkShort, Linker } = require("linkshort");

let lc = new LinkShort();

lc.create("https://github.com").then((linker) => {
	console.log(linker.short);
});
```

```
7a82e5b25
```
