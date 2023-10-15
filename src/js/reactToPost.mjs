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
function reactToPost(symbol, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield callApi(endpoint.react(symbol, id), put);
    });
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
                modal === null || modal === void 0 ? void 0 : modal.style.display = "none";
            }
        });
    });
    const closeModal = document.querySelector("[data-closeButton]");
    closeModal === null || closeModal === void 0 ? void 0 : closeModal.addEventListener("click", () => {
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
