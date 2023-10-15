import renderPosts from "./renderPost.mjs";

/**
 * Renders a temporary post on the given DOM element.
 * This is used when a post is just created and yet to be finalized, or in scenarios where
 * the author details may not be immediately available. In such cases, author details
 * are fetched from local storage.
 *
 * @function
 * @export
 * @param {HTMLDivElement} parentElement - The target DOM element where the temporary post should be rendered.
 * @param {Object} post - The post data to be rendered.
 * @param {string} post.id - The post's unique identifier (if available).
 * @param {string} post.title - The title of the post.
 * @param {string} post.body - The content/body of the post.
 * @param {string[]} post.tags - An array of tags associated with the post (if available).
 * @param {string} post.media - The media associated with the post (usually an image URL) if available.
 * @param {string} post.created - The creation date of the post (if available).
 * @param {string} post.updated - The last update date of the post (if available).
 * @param {Object} post.author - The author's data (if available).
 */
export default function renderTempPost(parentElement: HTMLDivElement, post) {
  if (!post.author) {
    post = {
      ...post,
      author: {
        name: JSON.parse(localStorage.getItem("currentUser")),
        avatar: JSON.parse(localStorage.getItem("avatar")),
      },
    };
  }
  const tempDiv = document.createElement("div");
  parentElement.prepend(tempDiv);
  renderPosts(tempDiv, post);
}
