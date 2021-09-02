import axios, { AxiosInstance } from "axios";
import { Linker } from "./Linker";
import { baseURL } from "./url";
import { handleResponse } from "./utility";

export class LinkShort {
	requester: AxiosInstance;

	constructor(public url: string = baseURL) {
		this.requester = axios.create({
			baseURL: baseURL,
		});
	}

	/**
	 * Create a new `Linker` object
	 * @param destination Where your shorcut should point to
	 * @param short The name you want your shortcut to have
	 * @param url The API you want to use (leave empty for official API)
	 * @returns A new `Linker` object
	 */
	async create(
		destination: string,
		short: string | undefined = undefined
	): Promise<Linker> {
		let data = {
			link: destination,
		};

		if (short !== undefined) {
			data["short"] = short;
		}

		let res = handleResponse(await this.requester.post(`/create`, data));

		if (!("token" in res)) res["token"] = undefined;

		return new Linker(
			res["short"],
			destination,
			res["token"],
			this.requester
		);
	}

	/**
	 * Get a certain `Linker` object by its `short`
	 * @param short The short you want to search for
	 * @returns A new `Linker` object
	 */
	async getByShort(short: string): Promise<Linker | undefined> {
		let res = handleResponse(await this.requester.get(`/${short}/json`));

		let linker: Linker | undefined;

		if (res !== undefined) {
			linker = new Linker(
				res["short"],
				res["destination"],
				undefined,
				this.requester
			);
		} else {
			linker = undefined;
		}

		return linker;
	}

	/**
	 * Get all `Linker` objects
	 * @returns An `Array` of `Linker` objects
	 */
	async getAll(): Promise<Linker[] | []> {
		let res = handleResponse(await this.requester.get("/links"));

		let linkerArray: Linker[] = [];

		Object.entries(res).forEach(([key, value]) => {
			linkerArray.push(new Linker(key, value, undefined, this.requester));
		});

		return linkerArray;
	}
}
