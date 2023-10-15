import commentPost from "./commentPost.mjs";
import { renderComments } from "./renderPost.mjs";
/**
 * Attaches event listeners to all buttons with a "data-comment-id" attribute.
 * On button click, retrieves the associated comment message from the corresponding input element.
 * Sends the comment to be posted and then renders the comment on the UI with associated user details.
 *
 * @function
 *
 * @example
 *
 * commentButton();
 */
export default function commentButton() {
    document.querySelectorAll("[data-comment-id]").forEach((button) => button.addEventListener("click", () => {
        const id = button.dataset.commentId;
        const message = document.querySelector(`#commentInput${id}`).value;
        commentPost(message, id);
        renderComments(document.querySelector(`#comment-row--${id}`), message, "", {
            name: JSON.parse(localStorage.getItem("currentUser")),
            avatar: JSON.parse(localStorage.getItem("avatar")),
        });
    }));
}
