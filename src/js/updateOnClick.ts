import endpointObject from "./endpoints.js";
import optionFactory from "./optionFactory.js";
import callApi from "./callApi.js";
import renderModal from "./renderModal.js";
import fadeText from "./fadeText.js";
import renderTempPost from "./renderTempPost.js";
const endpoint = endpointObject(
  JSON.parse(localStorage.getItem("currentUser"))
);
function showModal() {
  document.querySelector("#modalEdit").style.display = "block";
}

const editObject: {
  title: string;
  body: string;
  tags: string[];
  media?: string;
  id: number;
  setAll: Function;
} = {
  body: "",
  title: "",
  tags: [],
  media: "",
  id: 0,
  setAll: function (
    title: string,
    body: string,
    tags: string[],
    media: string
  ) {
    if (body) this.body = body;
    if (title) this.title = title;
    if (tags.length > 0) this.tags = tags;
    if (media) this.media = media;
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
 *
 * @function
 * @param {string} id - The ID of the post to get values from.
 */
function getPostText(id) {
  const modalTitle = document.querySelector(
    "#title__modal--edit"
  ) as HTMLInputElement;
  const modalBody = document.querySelector(
    "#body__modal--edit"
  ) as HTMLInputElement;
  const modalTags = document.querySelector(
    "#tags__modal--edit"
  ) as HTMLInputElement;

  modalBody.addEventListener("input", () => {
    editObject.body = modalBody.value;
    console.log(editObject);
  });
  modalTitle.addEventListener("input", () => {
    editObject.title = modalTitle.value;
  });
  modalTags.addEventListener("input", () => {
    editObject.tags = modalBody.value.split("#");
  });

  modalTitle.value = document.querySelector(`#title${id}`)?.innerText;
  modalBody.value = document.querySelector(`#body${id}`)?.innerText;
  const tagArr = Array.from(document.querySelectorAll(`.tag${id}`));

  modalTags.value = tagArr.map((tag) => tag.innerText).join("#");
  editObject.setAll(
    document.querySelector(`#body${id}`)?.innerText,
    document.querySelector(`#title${id}`)?.innerText,
    tagArr.map((element) => element.innerText)
  );
  console.log(tagArr);
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
export default async function updatePost(parentHtml) {
  const test = await renderModal(1);
  document.querySelectorAll("[data-update-id]").forEach((button) =>
    button.addEventListener("click", () => {
      const id = button.dataset.updateId;
      editObject.id = id;
      getPostText(id);
      showModal();
    })
  );

  document
    .querySelector("#close-modal--edit")
    ?.addEventListener("click", () => {
      document.querySelector("#modalEdit").style.display = "none";
    });

  const postButton = document.querySelector("#modal-post-button");
  postButton?.addEventListener("click", async () => {
    const editOption = optionFactory("PUT", editObject, endpoint);
    const id = editObject.id;
    console.log(id);
    const data = await callApi(endpoint.getId(id), editOption);
    renderTempPost(parentHtml, data);
    document.querySelector("#modalEdit").style.display = "none";
    fadeText("update successfull!:D");
  });
}
