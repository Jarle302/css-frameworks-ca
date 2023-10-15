import callApi from "./callApi.mjs";
import endpointObject from "./endpoints.mjs";
import optionFactory from "./optionFactory.mjs";
import renderPosts from "./renderPost.mjs";
import commentButton from "./commentOnClick.mjs";
import deletePost from "./deleteOnClick.mjs";
import updatePost from "./updateOnClick.mjs";
import reactToPostTwo from "./reactToPost.mjs";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const endpoint = endpointObject(
  JSON.parse(localStorage.getItem("currentUser"))
);
const getId = optionFactory("GET", {}, endpoint);
(async () => {
  const data = await callApi(endpoint.getId(id), getId);
  renderPosts(document.querySelector("#postContainer"), data);
  commentButton();
  deletePost();
  updatePost();
  reactToPostTwo();
})();
