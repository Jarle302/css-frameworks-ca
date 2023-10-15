import callApi from "./callApi.mjs";
import endpointObject from "./endpoints.mjs";
import optionFactory from "./optionFactory.mjs";
const endpoint = endpointObject("Jarle");

/**
 * Sends a comment message to a specific post endpoint using a POST request.
 *
 * @function
 * @async
 *
 * @param {string} message - The comment message to be posted.
 * @param {number} id - The ID of the post to which the comment belongs.
 *
 * @returns {Promise<void>} Resolves when the API call is complete.
 *
 * @example
 *
 * await commentPost("Great post!", 123);
 */
export default async function commentPost(message: string, id: number) {
  const postOption = optionFactory("POST", { body: message }, endpoint);
  const data = await callApi(endpoint.comment(id), postOption);
}
