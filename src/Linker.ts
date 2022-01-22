import axios, { AxiosInstance } from "axios";
import { baseURL } from ".";
import { Unauthorized } from "./errors";
import { handleResponse } from "./utility";

/**
 * A class representing the shortcut ressource
 */
export class Linker {
	requester: AxiosInstance;

	/**
	 * @param short The shortcut
	 * @param _destination The destination of the shortcut
	 * @param token The token of the shortcut
	 * @param requester The axios instance or baseURL used for making requests
	 */
	constructor(
		public readonly short: string,
		private _destination: string | unknown,
		public readonly token: string | undefined = undefined,
		requester: AxiosInstance | string
	) {
		if (typeof requester === "string") {
			this.requester = axios.create({ baseURL: requester });
		} else {
			this.requester = requester;
		}
	}

	public get destination() {
		return this._destination;
	}

	/**
	 * Change the destination of a `Linker`
	 * @param destination The new destination of the `Linker`
	 */
	public async edit(destination: string): Promise<void> {
		if (!this.isOwner) {
			throw new Unauthorized();
		}

		handleResponse(
			await this.requester.put(`/${this.short}`, {
				link: destination,
			})
		);

		await this.update();
	}

	/**
	 * Delete this `Linker` from the `API`
	 */
	public async delete(): Promise<void> {
		if (!this.isOwner) {
			throw new Unauthorized();
		}

		handleResponse(await this.requester.delete(`/${this.short}`));
	}

	/**
	 * Update the destination if it was changed
	 */
	public async update(): Promise<void> {
		let res = handleResponse(
			await this.requester.get(`/${this.short}/json`)
		);

		if (res["destination"] !== this._destination) {
			this._destination = res["destination"];
		}
	}

	/**
	 * Check wether this object is the original one
	 */
	public isOwner(): boolean {
		return this.token !== undefined;
	}

	public static fromJSON(data: object, requester?: AxiosInstance): Linker {
		return new Linker(
			data["short"],
			data["destination"],
			"token" in data ? data["token"] : undefined,
			requester || baseURL
		);
	}

	public toJSON(): object {
		const json = {
			short: this.short,
			destination: this.destination,
		};
		if (this.isOwner()) json["token"] = this.token;

		return json;
	}
}
