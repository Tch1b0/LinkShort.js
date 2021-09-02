import axios, { AxiosInstance } from "axios";
import { Unauthorized } from "./errors";
import { handleResponse } from "./utility";

/**
 * A class representing the shortcut ressource
 */
export class Linker {
	requester: AxiosInstance;

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
	 * Change the destination of a shortcut
	 * @param destination The new destination of the shortcut
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
	 * Delete this shortcut from the `API`
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
}
