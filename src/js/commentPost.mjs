var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export default function commentPost(message, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const postOption = optionFactory("POST", { body: message }, endpoint);
        const data = yield callApi(endpoint.comment(id), postOption);
    });
}
