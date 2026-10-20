interface Props {
	endpoint: string;
	query?: Record<string, string>;
	wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi<T>({
	endpoint,
	query,
	// wrappedByList,
}: Props): Promise<T> {
	if (endpoint.startsWith("/")) {
		endpoint = endpoint.slice(1);
	}

	const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

	if (query) {
		Object.entries(query).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
	}
	const token = import.meta.env.STRAPI_TOKEN;
	if (!token) {
		throw new Error("STRAPI_TOKEN is not configured");
	}

	const res = await fetch(url.toString(), {
		/* headers: {
			Authorization: `Bearer ${token}`,
		}, */
	});
	if (!res.ok) {
		throw new Error(
			`Strapi request for "${endpoint}" failed with status ${res.status} ${res.statusText}`,
		);
	}

	let data = await res.json();
	data = data.data;

	/* 	if (wrappedByList) {
		data = data[0];
	} */

	return data as T;
}
