import { AxiosResponse } from "axios";
import { BadRequest, NotFound, Unauthorized } from "./errors";

export function handleResponse(response: AxiosResponse) {
	switch (response.status) {
		case 200:
			break;
		case 400:
			throw new BadRequest();
		case 401:
			throw new Unauthorized();
		case 404:
			throw new NotFound();
	}
	return response.data;
}
