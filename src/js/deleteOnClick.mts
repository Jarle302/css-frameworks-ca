import endpointObject from "./endpoints.mjs";
import optionFactory from "./optionFactory.mjs";
import callApi from "./callApi.mjs";

/**
 * Adds event listeners to buttons for deleting posts. When a button is clicked, the post is deleted
 * from the backend and hidden from the UI.
 *
 * @function
 *
 * @remarks
 * The function uses the 'currentUser' from the localStorage to create an endpoint object.
 * It then sets up a DELETE request using the optionFactory and removes the post from the frontend by setting its display to 'none'.
 *
 * @requires module:endpoints.js
 * @requires module:optionFactory.js
 * @requires module:callApi.js
 *
 * @example
 *
 * // Assuming you have elements with the [data-delete-id] attribute in your HTML
 * // Once this function is invoked, clicking on these elements will trigger the delete post functionality
 * deletePost();
 */
export default function deletePost() {
  const endpoint = endpointObject(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const deleteOption = optionFactory("DELETE", {}, endpoint);
  document.querySelectorAll("[data-delete-id]").forEach((button) =>
    button.addEventListener("click", () => {
      const id = button.dataset.deleteId;
      callApi(endpoint.getId(id), deleteOption);
      document.querySelector(`#div${id}`).style.display = "none";
    })
  );
}
