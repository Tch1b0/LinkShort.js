export class BadRequest extends Error {
	constructor() {
		super("400 Bad Request - Some parameters were either missing or wrong");
	}
}

export class Unauthorized extends Error {
	constructor() {
		super("401 Unauthorized - Maybe your token is wrong");
	}
}

export class NotFound extends Error {
	constructor() {
		super("404 Not Found - Maybe you entered the wrong short");
	}
}
