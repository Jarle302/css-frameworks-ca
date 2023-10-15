import createElementFactory from "./createElementFactory.mjs";
/**
 * Creates and appends an emoji picker modal to a specified parent element, or to the 'main' element by default.
 *
 * @function
 * @param {HTMLElement} [parentElement=document.querySelector("main")] - The parent HTML element where the emoji picker will be appended to.
 * @returns {Function[]} - An array of functions to set, get, and manage the currently selected emoji and associated ID.
 *
 * @remarks
 * If an element with the ID "modal" already exists, the function will return without creating a new picker.
 * The emoji picker provides a UI for the user to select an emoji, and also provides functionality to get and set the current emoji and associated ID.
 *
 * @requires module:createElementFactory.js
 *
 * @example
 *
 * const [setEmoji, setId, getEmoji, getId] = createSmileyPicker();
 * setId("someID");
 * setEmoji("😀");
 * console.log(getEmoji()); // Outputs: "😀"
 * console.log(getId());    // Outputs: "someID"
 */
export default function createSmileyPicker(parentElement = document.querySelector("main")) {
    if (document.querySelector("#modal")) {
        return;
    }
    const emojiList = [
        { emoji: "😀", altText: "Grinning Face" },
        { emoji: "😃", altText: "Grinning Face with Big Eyes" },
        { emoji: "😄", altText: "Grinning Face with Smiling Eyes" },
        { emoji: "😁", altText: "Beaming Face with Smiling Eyes" },
        { emoji: "😆", altText: "Grinning Squinting Face" },
        { emoji: "😅", altText: "Grinning Face with Sweat" },
        { emoji: "😂", altText: "Face with Tears of Joy" },
        { emoji: "🤣", altText: "Rolling on the Floor Laughing" },
        { emoji: "😊", altText: "Smiling Face with Smiling Eyes" },
        { emoji: "😇", altText: "Smiling Face with Halo" },
        { emoji: "😍", altText: "Heart Eyes" },
        { emoji: "😘", altText: "Face Blowing a Kiss" },
        { emoji: "😋", altText: "Face Savoring Food" },
        { emoji: "😜", altText: "Winking Face with Tongue" },
        { emoji: "🤪", altText: "Zany Face" },
        { emoji: "😝", altText: "Squinting Face with Tongue" },
        { emoji: "🤑", altText: "Money-Mouth Face" },
        { emoji: "😎", altText: "Smiling Face with Sunglasses" },
        { emoji: "🤓", altText: "Nerd Face" },
        { emoji: "🧐", altText: "Face with Monocle" },
    ];
    const container = createElementFactory("div", "", parentElement, { id: "modal" }, "hide", "emoji-grid");
    const closeButton = createElementFactory("button", "X", container, {
        "data-closeButton": "",
    }, "bg-primary", "text-success", "badge");
    emojiList.forEach((emoji) => createElementFactory("button", emoji.emoji, container, {
        type: "button",
        "aria-label": emoji.altText,
        "data-buttonSelector": "",
    }, "bg-primary", "badge"));
    const emojiFunctions = emojiClosure();
    function emojiClosure() {
        let currentEmoji = "";
        let id = "test";
        function setEmoji(emoji) {
            currentEmoji = emoji;
        }
        function getEmoji() {
            return currentEmoji;
        }
        function setId(newId) {
            id = newId;
        }
        function getId() {
            return id;
        }
        return [setEmoji, setId, getEmoji, getId];
    }
    return emojiFunctions;
}
