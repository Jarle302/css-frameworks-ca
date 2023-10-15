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
import callApi from "./callApi.mjs";
import renderPosts from "./renderPost.mjs";
import filterPosts from "./filter.mjs";
import commentButton from "./commentOnClick.mjs";
import deletePost from "./deleteOnClick.mjs";
import updatePost from "./updateOnClick.mjs";
import reactToPostTwo from "./reactToPost.mjs";
import renderTempPost from "./renderTempPost.mjs";
import validateSelect from "./formValidation.mjs";
import observerTargetClosure from "./observerClosure.mjs";
import clearForm from "./clearForm.mjs";
const endpoint = endpointObject(JSON.parse(localStorage.getItem("currentUser")));
const sortInput = document.querySelector("#sort--feed");
const sortOrder = document.querySelector("#sort--order");
const searchInput = document.querySelector("#search--feed");
const filterButton = document.querySelector("#filter--button");
const searchButton = document.querySelector("#search--button");
const createMessageTitle = document.querySelector("#title--feed");
const createMessageMessage = document.querySelector("#text-body--feed");
const createMessageMedia = document.querySelector("#media--feed");
const createMessageTags = document.querySelector("#tags--feed");
const postButton = document.querySelector("#post--button");
const postContainer = document.querySelector("#feed--container");
createMessageMedia === null || createMessageMedia === void 0 ? void 0 : createMessageMedia.addEventListener("input", () => {
    messageObject.media = createMessageMedia.value;
});
createMessageTitle === null || createMessageTitle === void 0 ? void 0 : createMessageTitle.addEventListener("input", () => {
    messageObject.title = createMessageTitle.value;
});
createMessageMessage === null || createMessageMessage === void 0 ? void 0 : createMessageMessage.addEventListener("input", () => {
    messageObject.body = createMessageMessage.value;
});
createMessageTags === null || createMessageTags === void 0 ? void 0 : createMessageTags.addEventListener("input", () => {
    const tagArr = createMessageTags.value.split("#");
    messageObject.tags = tagArr;
});
searchInput.addEventListener("input", () => {
    endpoint.filterUrl.resetCount();
    endpoint.sortAndPaginate.setSearch(searchInput.value);
});
filterButton === null || filterButton === void 0 ? void 0 : filterButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    if (!validateSelect(sortInput) || !validateSelect(searchInput)) {
        return;
    }
    endpoint.filterUrl.resetCount();
    postContainer.innerHTML = "";
    const allPosts = yield filterPosts(searchInput.value, sortInput.value);
    allPosts.forEach((post) => renderPosts(postContainer, post));
    updatePost(postContainer);
    reactToPostTwo();
    commentButton();
    deletePost();
}));
searchButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    if (!validateSelect(sortInput)) {
        return;
    }
    const data = !searchInput.value
        ? yield callApi(endpoint.sortAndPaginate.setString(endpoint.generatePaginate(sortInput.value, sortOrder.value)), postOption)
        : yield callApi(endpoint.sortAndPaginate.setString(endpoint.generatePaginate(sortInput.value, sortOrder.value), 100, 100), postOption);
    if (endpoint.sortAndPaginate.getCount() == 0) {
        postContainer.innerHTML = "";
    }
    if (searchInput.value) {
        let foundItem = yield searchApi(data, sortInput.value, 0, searchInput.value);
        if (foundItem) {
            renderPosts(postContainer, foundItem);
            updatePost(postContainer);
            reactToPostTwo();
            commentButton();
            deletePost();
        }
        else if (data.length === 1) {
            renderPosts(postContainer, data[0]);
            updatePost(postContainer);
            reactToPostTwo();
            commentButton();
            deletePost();
        }
    }
    else {
        data.forEach((element) => renderPosts(postContainer, element));
        reactToPostTwo();
        commentButton();
        deletePost();
        updatePost(postContainer);
        const observedObj = document.querySelectorAll("[data-observed]");
        const target = observedObj[observedObj.length - 1];
        setTarget();
        isObserving(true, intersectionObserver);
    }
}));
const [setTarget, isObserving] = observerTargetClosure();
function optionFactory(method, body) {
    const newObject = {
        method: method,
        headers: {
            Authorization: `Bearer ${endpoint.getToken()}`,
            "Content-type": "application/json",
        },
    };
    if (Object.keys(body).length !== 0) {
        newObject.body = JSON.stringify(body);
    }
    return newObject;
}
const postOption = optionFactory("GET", {});
const messageObject = {
    title: "",
    body: "",
    media: "",
    tags: [],
};
postButton === null || postButton === void 0 ? void 0 : postButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const message = optionFactory("POST", messageObject);
    const data = yield callApi(endpoint.createPost, message);
    renderTempPost(postContainer, data);
    reactToPostTwo();
    commentButton();
    deletePost();
    updatePost(postContainer);
    clearForm();
}));
const intersectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => __awaiter(void 0, void 0, void 0, function* () {
    if (entry.isIntersecting) {
        const data = yield callApi(endpoint.sortAndPaginate.setString(endpoint.generatePaginate(sortInput.value, sortOrder.value)), postOption);
        if (endpoint.sortAndPaginate.getCount() == 0) {
            postContainer.innerHTML = "";
        }
        if (data.length === 1) {
            renderPosts(postContainer, data[0]);
        }
        else
            data.forEach((element) => renderPosts(postContainer, element));
        updatePost(postContainer);
        reactToPostTwo();
        commentButton();
        deletePost();
        isObserving(false, intersectionObserver);
        setTarget();
        isObserving(true, intersectionObserver);
    }
})), {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
});
/**
 * Recursively searches a given array of posts to find a post matching a specific search word in a given category.
 * If the post isn't found in the initial array, makes an API call to fetch more data and continues the search.
 *
 * @async
 * @function
 * @param {post[]} array - Array of posts to search in.
 * @param {category} [category="body"] - Category of the post to match against (e.g. 'body', 'title', etc).
 * @param {number} [count=0] - Counter to limit the recursive depth (stops after 20 recursions).
 * @param {string|null} [searchWord=null] - The word to search for in the given category.
 *
 * @returns {Promise<post|undefined>} A promise that resolves to a post object if a match is found, otherwise undefined.
 *
 * @example
 *
 * const postsArray = [ ... ];  // Some array of posts.
 *
 * // Search for a specific word in the 'body' category of the posts.
 * const foundPost = await searchApi(postsArray, "body", 0, "exampleWord");
 *
 * if (foundPost) {
 *   console.log("Found post:", foundPost);
 * } else {
 *   console.log("Post not found.");
 * }
 */
function searchApi(array, category = "body", count = 0, searchWord = null) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (!searchWord || count > 20) {
            return;
        }
        let foundWord;
        if ((_b = (_a = array[0]) === null || _a === void 0 ? void 0 : _a[category]) === null || _b === void 0 ? void 0 : _b.name) {
            foundWord = array.find((post) => post[category].name.toLowerCase() === searchWord.toLowerCase());
        }
        else if (Array.isArray((_c = array[0]) === null || _c === void 0 ? void 0 : _c[category])) {
            foundWord = array.find((post) => post.tags.some((element) => element.toLowerCase() === searchWord.toLowerCase()));
        }
        else {
            foundWord = array.find((post) => { var _a; return ((_a = post[category]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (searchWord === null || searchWord === void 0 ? void 0 : searchWord.toLowerCase()); });
        }
        if (foundWord) {
            return foundWord;
        }
        else {
            try {
                const data = yield callApi(endpoint.sortAndPaginate.setString(endpoint.generatePaginate(sortInput.value, sortOrder.value), 100, 100), postOption);
                if (data && data.length > 1) {
                    return searchApi(data, category, count + 1, searchWord);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield callApi(endpoint.sortAndPaginate.setString(endpoint.generatePaginate(sortInput.value, sortOrder.value)), postOption);
    if (data.length === 1) {
        renderPosts(postContainer, data[0]);
    }
    else {
        data.forEach((element) => renderPosts(postContainer, element));
    }
    reactToPostTwo();
    commentButton();
    deletePost();
    updatePost(postContainer);
    const observedObj = document.querySelectorAll("[data-observed]");
    const target = observedObj[observedObj.length - 1];
    setTarget();
    isObserving(true, intersectionObserver);
}))();
(function renderUserSpecific() {
    var _a;
    (_a = document.querySelector("[data-userName]")) === null || _a === void 0 ? void 0 : _a.textContent = JSON.parse(localStorage.getItem("currentUser"));
    document.querySelector("[data-userImg]").src = JSON.parse(localStorage.getItem("avatar"))
        ? JSON.parse(localStorage.getItem("avatar"))
        : "../assets/placeholder.png";
})();
