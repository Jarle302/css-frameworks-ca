import callApi from "./callApi.mjs";
import createSmileyPicker from "./emoji.mjs";
import endpointObject from "./endpoints.mjs";
import fadeText from "./fadeText.mjs";
import optionFactory from "./optionFactory.mjs";

const endpoint = endpointObject("Jarle");
const put = optionFactory("PUT", { body: "test" }, endpoint);

/**
 * Reacts to a post with a specified emoji.
 *
 * Sends an API request to register a reaction to a post. The emoji used as a reaction and the
 * ID of the post are both specified as parameters.
 *
 * @async
 * @function
 * @param {string} symbol - The emoji symbol used as the reaction.
 * @param {string} id - The ID of the post being reacted to.
 * @returns {Promise<void>}
 */
async function reactToPost(symbol: string, id: string) {
  const data = await callApi(endpoint.react(symbol, id), put);
}
const [setSmiley, setId, getSmiley, getId] = createSmileyPicker();

/**
 * Sets up event listeners for post reactions and manages the emoji reaction modal.
 *
 * This function initializes the event listeners required for users to react to posts
 * using emojis. It also controls the display of a modal allowing users to pick an emoji.
 */
export default function reactToPostTwo() {
  document.querySelectorAll("[data-buttonSelector]").forEach((button) => {
    button.addEventListener("click", () => {
      let modal = document.querySelector("#modal");

      setSmiley(button.textContent);
      const smiley = getSmiley();
      const smileyId = getId();
      if (smiley && smileyId) {
        reactToPost(smiley, smileyId);
        fadeText();
        modal?.style.display = "none";
      }
    });
  });

  const closeModal = document.querySelector("[data-closeButton]");
  closeModal?.addEventListener("click", () => {
    let modal = document.querySelector("#modal");

    modal.style.display = "none";
  });

  /**
   * Sets up event listeners for emoji reaction buttons.
   *
   * Initializes the event listeners on all elements with the "data-id" attribute, enabling
   * users to click and bring up the emoji picker modal. The modal's position is set based on
   * the position of the clicked button.
   */
  (function emojiReactButton() {
    document.querySelectorAll("[data-id]").forEach((button) => {
      button.addEventListener("click", () => {
        let buttonRect = button.getBoundingClientRect();

        modal.style.top = buttonRect.top + "px";
        modal.style.left = buttonRect.left + "px";
        modal.style.display = "grid";
        setId(button.dataset.id);
      });
    });
  })();
}
