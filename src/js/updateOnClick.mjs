var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import endpointObject from "./endpoints.mjs";
import optionFactory from "./optionFactory.mjs";
import callApi from "./callApi.mjs";
import renderModal from "./renderModal.mjs";
import fadeText from "./fadeText.mjs";
import createElementFactory from "./createElementFactory.mjs";
const endpoint = endpointObject(JSON.parse(localStorage.getItem("currentUser")));
function showModal() {
    document.querySelector("#modalEdit").style.display = "block";
}
const editObject = {
    body: "",
    title: "",
    tags: [],
    media: "",
    id: 0,
    setAll: function (title, body, tags, media) {
        if (body)
            this.body = body;
        if (title)
            this.title = title;
        if (tags.length > 0)
            this.tags = tags;
        if (media)
            this.media = media;
    },
};
/**
 * Populates a modal form's fields with the current post values, and sets up event listeners
 * to update the `editObject` with any changes the user makes in the form.
 *
 * How it works:
 * 1. Gets the current values of a post by its ID from the page.
 * 2. Sets the values to corresponding input fields in the modal form.
 * 3. Listens to input events on the modal form fields to update the `editObject`.
 * 4. The `editObject` will then be used to submit the updated post to the server.
 * 5. Using renderEdit() updates the exisiting post with the new values
 * @function
 * @param {string} id - The ID of the post to get values from.
 */
function getPostText(id) {
    var _a, _b, _c, _d, _e;
    const modalTitle = document.querySelector("#title__modal--edit");
    const modalBody = document.querySelector("#body__modal--edit");
    const modalTags = document.querySelector("#tags__modal--edit");
    const modalMedia = document.querySelector("#media__modal--edit");
    modalBody.addEventListener("input", () => {
        editObject.body = modalBody.value;
    });
    modalTitle.addEventListener("input", () => {
        editObject.title = modalTitle.value;
    });
    modalTags.addEventListener("input", () => {
        editObject.tags = modalTags.value.split("#");
    });
    modalMedia.addEventListener("input", () => {
        editObject.media = modalMedia.value;
    });
    modalTitle.value = (_a = document.querySelector(`#title${id}`)) === null || _a === void 0 ? void 0 : _a.innerText;
    modalBody.value = (_b = document.querySelector(`#body${id}`)) === null || _b === void 0 ? void 0 : _b.innerText;
    if (document.querySelector(`#image${id}`) !== null) {
        modalMedia.value = document.querySelector(`#image${id}`).src;
    }
    const tagArr = Array.from(document.querySelectorAll(`.tag${id}`));
    modalTags.value = tagArr.map((tag) => tag.innerText).join("#");
    editObject.setAll((_c = document.querySelector(`#title${id}`)) === null || _c === void 0 ? void 0 : _c.innerText, (_d = document.querySelector(`#body${id}`)) === null || _d === void 0 ? void 0 : _d.innerText, tagArr.map((element) => element.innerText), (_e = document.querySelector(`#image${id}`)) === null || _e === void 0 ? void 0 : _e.src);
}
/**
 * Prepares and manages the update of a post using a modal UI.
 *
 * 1. Presents a modal that provides fields for editing a post.
 * 2. Captures user input and updates an internal `editObject` with the user's changes.
 * 3. Allows the user to send their updated post to the backend.
 * 4. Renders the updated post using `renderTempPost`.
 * 5. Provides feedback to the user indicating the success of their update.
 *
 * @function
 * @export
 * @async
 * @param {HTMLElement} parentHtml - The root element in which updated posts will be rendered.
 */
export default function updatePost(parentHtml) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const test = yield renderModal(1);
        document.querySelectorAll("[data-update-id]").forEach((button) => button.addEventListener("click", () => {
            const id = button.dataset.updateId;
            editObject.id = id;
            getPostText(id);
            showModal();
        }));
        (_a = document
            .querySelector("#close-modal--edit")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            document.querySelector("#modalEdit").style.display = "none";
        });
        const postButton = document.querySelector("#modal-post-button");
        postButton === null || postButton === void 0 ? void 0 : postButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const editOption = optionFactory("PUT", editObject, endpoint);
            const id = editObject.id;
            const data = yield callApi(endpoint.getId(id), editOption);
            document.querySelector("#modalEdit").style.display = "none";
            renderEdit(id);
            fadeText("update successfull!:D");
        }));
    });
}
/**
 * Renders the edited content of a post onto the page.
 *
 * This function does the following:
 * 1. Fetches the values from the modal form fields.
 * 2. Updates the post on the page with these values.
 * 3. If there's a new image URL in the modal form but no corresponding image in the post, it creates an image element.
 * 4. If the image URL in the modal form is cleared, it removes the corresponding image from the post.
 * 5. Updates the tags of the post based on the modal form.
 *
 * @function
 * @param {string} id - The ID of the post to update.
 * @example
 *
 * renderEdit("123");  // updates the post with id '123' using the values from the modal form.
 */
function renderEdit(id) {
    var _a, _b, _c, _d, _e;
    const modalTitle = document.querySelector("#title__modal--edit");
    const modalBody = document.querySelector("#body__modal--edit");
    const modalTags = document.querySelector("#tags__modal--edit");
    const modalMedia = document.querySelector("#media__modal--edit");
    (_a = document.querySelector(`#title${id}`)) === null || _a === void 0 ? void 0 : _a.innerText = modalTitle.value;
    (_b = document.querySelector(`#body${id}`)) === null || _b === void 0 ? void 0 : _b.innerText = modalBody.value;
    if (document.querySelector(`#image${id}`)) {
        document.querySelector(`#image${id}`).src = modalMedia.value;
    }
    if (!document.querySelector(`#image${id}`) && modalMedia.value) {
        const picturePost = createElementFactory("img", "", document.querySelector(`#postCard${id}`), { id: `image${id}`, src: modalMedia.value }, "postImage");
        (_c = document.querySelector(`#tag-container${id}`)) === null || _c === void 0 ? void 0 : _c.after(picturePost);
    }
    if (!modalMedia.value && document.querySelector(`#image${id}`)) {
        (_d = document.querySelector(`#image${id}`)) === null || _d === void 0 ? void 0 : _d.remove();
    }
    (_e = document.querySelector(`#tag-container${id}`)) === null || _e === void 0 ? void 0 : _e.innerHTML = "";
    modalTags.value
        .split("#")
        .forEach((tag) => createElementFactory("span", tag, document.querySelector(`#tag-container${id}`), {}, "badge", "text-bg-primary", "m-1", `tag${id}`));
}
