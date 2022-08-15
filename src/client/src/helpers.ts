/**
 * shorthand for fetch().then(res=>res.json())
 * @param input url to fetch
 * @param init fetch options
 */
export async function fetchJSON(
	input: RequestInfo | URL,
	init?: RequestInit | undefined
) {
	return (await fetch(input, init)).json();
}
