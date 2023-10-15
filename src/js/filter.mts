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
export default async function filterPosts(
  searchword: string,
  category: string
) {
  endpoint.filterUrl.resetCount();
  const data = await callApi(endpoint.filterUrl.incrementUrl(), getOption);
  const allPosts = await recursiveFilter(data);
  let filteredPost;
  if (Array.isArray(allPosts[0][category])) {
    filteredPost = allPosts.filter((post) =>
      post[category]?.some(
        (element) => element?.toLowerCase() === searchword?.toLowerCase()
      )
    );
  } else if (category === "author") {
    filteredPost = allPosts.filter(
      (post) => post[category]?.name.toLowerCase() === searchword?.toLowerCase()
    );
  } else {
    filteredPost = allPosts.filter(
      (post) => post[category]?.toLowerCase() === searchword?.toLowerCase()
    );
  }
  return filteredPost;
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
async function recursiveFilter(prevArray: []) {
  const postsPerPage: number = 100;
  const data = await callApi(endpoint.filterUrl.incrementUrl(), getOption);
  if (data.length < postsPerPage) {
    return [...prevArray, ...data];
  } else if (data === undefined || data === null) {
    return [...prevArray];
  } else {
    return recursiveFilter([...prevArray, ...data]);
  }
}
