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
const getOption = optionFactory("GET", {}, endpoint);
/**
 * Fetches and filters all posts from the API after a given search word and category.
 *
 * @async
 * @function
 * @param {string} searchword - The word to search for in the given category.
 * @param {string} category - Category of the post to match against (e.g. 'body', 'title', etc).
 *
 * @returns {Promise<Array>} A promise that resolves to an array of posts matching the criteria.
 *
 * @example
 *
 * // Fetch and filter posts that have the search word "javascript" in their "tags".
 * const matchingPosts = await filterPosts("javascript", "tags");
 *
 * if (matchingPosts.length) {
 *   console.log("Found posts:", matchingPosts);
 * } else {
 *   console.log("No matching posts found.");
 * }
 */
export default function filterPosts(searchword, category) {
    return __awaiter(this, void 0, void 0, function* () {
        endpoint.filterUrl.resetCount();
        const data = yield callApi(endpoint.filterUrl.incrementUrl(), getOption);
        const allPosts = yield recursiveFilter(data);
        let filteredPost;
        if (Array.isArray(allPosts[0][category])) {
            filteredPost = allPosts.filter((post) => {
                var _a;
                return (_a = post[category]) === null || _a === void 0 ? void 0 : _a.some((element) => (element === null || element === void 0 ? void 0 : element.toLowerCase()) === (searchword === null || searchword === void 0 ? void 0 : searchword.toLowerCase()));
            });
        }
        else if (category === "author") {
            filteredPost = allPosts.filter((post) => { var _a; return ((_a = post[category]) === null || _a === void 0 ? void 0 : _a.name.toLowerCase()) === (searchword === null || searchword === void 0 ? void 0 : searchword.toLowerCase()); });
        }
        else {
            filteredPost = allPosts.filter((post) => { var _a; return ((_a = post[category]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (searchword === null || searchword === void 0 ? void 0 : searchword.toLowerCase()); });
        }
        return filteredPost;
    });
}
/**
 * Recursively fetches posts from the API until all posts are fetched.
 * Fetching stops when either the returned data has less than 100 posts or there's no data returned.
 *
 * @async
 * @function
 * @param {Array} prevArray - The previously fetched array of posts.
 *
 * @returns {Promise<Array>} A promise that resolves to a consolidated array of all fetched posts.
 */
function recursiveFilter(prevArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const postsPerPage = 100;
        const data = yield callApi(endpoint.filterUrl.incrementUrl(), getOption);
        if (data.length < postsPerPage) {
            return [...prevArray, ...data];
        }
        else if (data === undefined || data === null) {
            return [...prevArray];
        }
        else {
            return recursiveFilter([...prevArray, ...data]);
        }
    });
}
