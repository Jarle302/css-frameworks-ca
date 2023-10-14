import commentPost from "./commentPost.js";
import { renderComments } from "./renderPost.js";
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
        console.log(id);
        const message = document.querySelector(`#commentInput${id}`).value;
        commentPost(message, id);
        renderComments(document.querySelector(`#comment-row--${id}`), message, "", {
            name: JSON.parse(localStorage.getItem("currentUser")),
            avatar: JSON.parse(localStorage.getItem("avatar")),
        });
    }));
}
