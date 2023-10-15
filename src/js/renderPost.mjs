import createElementFactory from "./createElementFactory.mjs";
/**
 * Renders posts on the given DOM element.
 *
 * @function
 * @export
 * @param {HTMLDivElement} domEl - The target DOM element where the post should be rendered.
 * @param {Object} post - The post data to be rendered.
 * @param {string} post.id - The post's unique identifier.
 * @param {string} post.title - The title of the post.
 * @param {string} post.body - The content/body of the post.
 * @param {string[]} post.tags - An array of tags associated with the post.
 * @param {string} post.media - The media associated with the post (usually an image URL).
 * @param {string} post.created - The creation date of the post.
 * @param {string} post.updated - The last update date of the post.
 * @param {Object} post._count - An object with count-related data.
 * @param {Object} post.author - The author's data.
 * @param {Object[]} post.comments - An array of comments on the post.
 * @param {Object[]} post.reactions - An array of reactions (e.g., emojis) to the post.
 */
export default function renderPosts(domEl, { id, title, body, tags, media, created, updated, _count, author, comments, reactions = [""], }) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const container = createElementFactory("div", "", domEl, { "data-observed": "", id: `div${id}` }, "card", "mb-3", "bg-white", "p-1", "card--shadow");
    const row = createElementFactory("div", "", container, {}, "row", "mb-4");
    const anker = createElementFactory("div", "", row, {}, "col-lg-4", "d-flex", "flex-column", "mb-2", "flex-column");
    const dateSpan = createElementFactory("p", created.split("T")[0], anker, {}, "size-7px");
    const spanName = createElementFactory("a", author.name ? author.name : "", anker, { href: `/src/profile/index.html?user=${author === null || author === void 0 ? void 0 : author.name}` }, "text-primay", "fs-6");
    const image = createElementFactory("img", "", anker, {
        src: author.avatar ? author.avatar : "/src/assets/placeholder.png",
    }, "rounded-3", "max-width-85");
    const divCol8 = createElementFactory("div", "", row, { id: `postCard${id}` }, "col-lg-8");
    const postLink = createElementFactory("a", "", divCol8, {
        href: `/src/post/index.html?id=${id}`,
    }, "text-decoration-none", "mt-3");
    const header = createElementFactory("h2", title, postLink, {
        id: `title${id}`,
    }, "fs-6", "fw-bold");
    const paragraph = createElementFactory("p", body, divCol8, { id: `body${id}` }, "card-text", "text-black");
    const tagContainer = createElementFactory("div", "", divCol8, { id: `tag-container${id}` }, "d-flex", "flex-wrap");
    const deleteButton = createElementFactory("button", "delete", divCol8, { id: `button--${id}`, "data-delete-id": id }, currentUser !== author.name && "hide", "btn", "btn-success");
    const updateButton = createElementFactory("button", "update", divCol8, { "data-update-id": id, id: `button--edit--${id}` }, currentUser !== author.name && "hide", "btn", "btn-outline-primary");
    const picturePost = media
        ? createElementFactory("img", "", divCol8, { id: `image${id}`, src: media }, "postImage")
        : "";
    const reactionContainer = createElementFactory("div", "", divCol8, {});
    if (reactions[0]) {
        reactions.forEach((emoji) => createElementFactory("span", emoji.symbol + `(${emoji.count})`, reactionContainer, {}, "badge", "rounded-pill", "text-bg-primary"));
    }
    tags === null || tags === void 0 ? void 0 : tags.forEach((tag) => createElementFactory("span", tag, tagContainer, {}, "badge", "text-bg-primary", "m-1", `tag${id}`));
    const reactButton = createElementFactory("button", "React", divCol8, {
        type: "button",
        "data-id": id,
    }, "btn", "btn-outline-primary", "mt-2");
    const commentContainer = createElementFactory("div", "", container, {}, "container");
    const commentHeader = createElementFactory("h3", `${_count ? `comments(${_count.comments})` : "comments"}`, commentContainer, {}, "fs-6");
    const inputGroupContainer = createElementFactory("div", "", commentContainer, {}, "d-flex", "flex-column", "mb-4");
    const commentInput = createElementFactory("textArea", "", inputGroupContainer, {
        placeholder: "Write your comment here",
        ariaDescribedby: "commentButton",
        id: `commentInput${id}`,
    }, "form-control");
    const commentButton = createElementFactory("button", "Post Comment", inputGroupContainer, { type: "button", id: "commentButton", "data-comment-id": id }, "btn", "btn-primary");
    const commentRow = createElementFactory("div", "", commentContainer, { id: `comment-row--${id}` }, "row", "overflow-y-auto", "h-px--150");
    if (comments) {
        comments.forEach((comment) => renderComments(commentRow, comment.body, comment.created, comment.author));
    }
}
/**
 * Renders comments for a specific post.
 *
 * @function
 * @export
 * @param {HTMLDivElement} commentRow - The target DOM element where the comment should be rendered.
 * @param {string} body - The body/content of the comment.
 * @param {string} created - The creation date of the comment.
 * @param {Object} author - The author's data of the comment.
 * @param {string} author.name - The name of the author of the comment.
 * @param {string} author.avatar - The avatar image URL of the author.
 */
export function renderComments(commentRow, body, created, { name, avatar }) {
    const commentFirstCol = createElementFactory("div", "", commentRow, {}, "col-4");
    const commentSecondCol = createElementFactory("div", "", commentRow, {}, "col-8");
    const commenterImg = createElementFactory("img", "", commentFirstCol, {
        src: avatar,
    }, "rounded-circle", "w-25");
    const commenterBody = createElementFactory("p", body, commentSecondCol, {});
    const commenterName = createElementFactory("p", name, commentFirstCol, {});
}
