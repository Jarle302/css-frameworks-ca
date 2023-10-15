var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import endpoints from "./endpoints.mjs";
import renderPosts from "./renderPost.mjs";
import commentButton from "./commentOnClick.mjs";
import deletePost from "./deleteOnClick.mjs";
import updatePost from "./updateOnClick.mjs";
import reactToPostTwo from "./reactToPost.mjs";
const queries = new URLSearchParams(window.location.search);
const userId = queries.get("user");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const endpoint = endpoints(userId);
const profileElements = {
    user: document.querySelector("#userName"),
    email: document.querySelector("#email"),
    img: document.querySelector("#profile--picture"),
    background: document.querySelector("#profile--header"),
};
const postContainer = document.querySelector("#container--posts");
const changeAvatarinput = document.querySelector("#change-picture--profile");
const changeAvatarButton = document.querySelector("#change-picture--profile--button");
const changeBannerinput = document.querySelector("#change-picture--banner");
const changeBannerButton = document.querySelector("#change-picture--banner--button");
const changeMediaObject = {
    avatar: changeAvatarinput.value,
    banner: changeAvatarinput.value,
};
/**
 * Attaches an input event listener to the given input element. This function populates
 * a global `changeMediaObject` based on whether the input corresponds to avatar or banner changes.
 *
 * @function
 * @param {HTMLInputElement} input - The input element to which the event listener is attached.
 *
 * @example
 *
 * const avatarInput = document.getElementById('avatarInput');
 * attachListenerMedia(avatarInput);
 * // This will update the changeMediaObject.avatar property with the value of the input when changed.
 */
function attachListenerMedia(input) {
    input.addEventListener("input", () => {
        if (input.value) {
            input === changeAvatarinput
                ? (changeMediaObject.avatar = input.value)
                : (changeMediaObject.banner = input.value);
        }
    });
}
document.querySelectorAll("button[data-mediaSelector]").forEach((button) => {
    button.addEventListener("click", () => {
        changeMedia(changeMediaObject);
    });
});
attachListenerMedia(changeAvatarinput);
attachListenerMedia(changeBannerinput);
/**
 * Updates the profile with the provided information.
 *
 * This function modifies the DOM elements associated with a profile, specifically the
 * user's name, email, avatar, and banner. If avatar or banner is not provided, default
 * images are used.
 *
 * @function
 * @param {profileInfo} param0 - An object containing the user's profile information.
 * @param {string} [param0.name="Thistlebeard the Tipsy"] - The user's name. Defaults to "Thistlebeard the Tipsy".
 * @param {string} [param0.email="@TipsyThistle"] - The user's email. Defaults to "@TipsyThistle".
 * @param {string} [param0.banner] - The URL to the user's banner image.
 * @param {string} [param0.avatar] - The URL to the user's avatar image.
 *
 * @example
 *
 * updateProfile({
 *   name: "John Doe",
 *   email: "john.doe@example.com",
 *   avatar: "/path/to/avatar.jpg",
 *   banner: "/path/to/banner.jpg"
 * });
 */
function updateProfile({ name = "Thistlebeard the Tipsy", email = "@TipsyThistle", banner, avatar, }) {
    profileElements.user.textContent = name;
    profileElements.email.textContent = email;
    avatar
        ? (profileElements.img.src = avatar)
        : (profileElements.img.src = "/src/assets/profile.jpeg");
    banner
        ? (profileElements.background.style.backgroundImage = `url(${banner})`)
        : (profileElements.background.style.backgroundImage =
            "/src/assets/background.jpeg");
}
/**
 * Fetches posts from the provided URL and updates the profile.
 *
 * This asynchronous function sends a GET request to retrieve user posts and profile
 * data from the given URL. After fetching the data, it updates the profile, processes
 * each post, and initializes various event handlers.
 *
 * @async
 * @function
 * @param {string} url - The URL endpoint to fetch posts and profile data from.
 *
 * @example
 *
 * fetchPosts('https://api.example.com/user/posts');
 */
function fetchPosts(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url, {
            headers: {
                Authorization: `Bearer ${endpoint.getToken()}`,
                "Content-type": "application/json",
            },
        });
        const data = yield response.json();
        updateProfile(data);
        data.posts
            .map((post) => {
            return Object.assign(Object.assign({}, post), { author: { name: post.owner } });
        })
            .forEach((post) => renderPosts(postContainer, post));
        commentButton();
        deletePost();
        updatePost(document.querySelector("#container--posts"));
        reactToPostTwo();
        followUnfollow(data.followers);
    });
}
fetchPosts(endpoint.profileOneUserAllEnabled);
/**
 * Updates the avatar and banner media for a user profile.
 *
 * This asynchronous function sends a PUT request to the specified media
 * endpoint to change the user's avatar and/or banner. The updated media
 * details are passed in as an object with properties `avatar` and `banner`.
 *
 * @async
 * @function
 * @param {Object} params - Object containing the avatar and banner details.
 * @param {string} params.avatar - The URL of the new avatar image.
 * @param {string} params.banner - The URL of the new banner image.
 *
 * @returns {Promise<void>} - Does not explicitly return anything, but will log the response data.
 *
 * @example
 *
 * changeMedia({
 *   avatar: 'https://example.com/newAvatar.jpg',
 *   banner: 'https://example.com/newBanner.jpg',
 * });
 */
function changeMedia({ avatar, banner, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(endpoint.changeMedia, {
            method: "PUT",
            body: JSON.stringify({ avatar, banner }),
            headers: {
                Authorization: `Bearer ${endpoint.getToken()}`,
                "Content-type": "application/json",
            },
        });
        const data = yield response.json();
    });
}
if (currentUser === userId) {
    document.querySelector("#follow--button").style.display = "none";
    document.querySelector("[data-custom-input-Container]").style.display =
        "block";
}
/**
 * Updates the follow/unfollow button based on the current user's following status.
 *
 * This function checks if the current user is already in the list of followers.
 * If the user is following, the button's text is set to 'unfollow'; otherwise, it's set to 'follow'.
 * It also attaches a click event listener to the button to trigger the `follow` function.
 *
 * @function
 * @param {Object[]} followers - Array of follower objects.
 * @param {string} followers[].name - The name of the follower.
 *
 * @example
 *
 * followUnfollow([{name: 'JohnDoe'}, {name: 'JaneDoe'}]);
 */
function followUnfollow(followers) {
    const button = document.querySelector("#follow--button");
    button.textContent = followers.some((element) => element.name === currentUser)
        ? "unfollow"
        : "follow";
    button.addEventListener("click", () => {
        follow(button);
    });
}
/**
 * Toggles the following status of a user.
 *
 * This function sends a PUT request to either follow or unfollow a user based on the
 * current text content of the provided button. If the button's text matches a key in the
 * `endpoint` object, it uses the corresponding value as the API endpoint.
 *
 * After a successful operation, the button's text is toggled between 'follow' and 'unfollow'.
 *
 * @async
 * @function
 * @param {HTMLButtonElement} button - The button element used to trigger the follow/unfollow action.
 *
 * @returns {Promise<void>}
 *
 * @example
 *
 * const buttonElement = document.querySelector("#followButton");
 * follow(buttonElement);
 */
function follow(button) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (button.textContent && button.textContent in endpoint) {
            const response = yield fetch(endpoint[(_a = button.textContent) === null || _a === void 0 ? void 0 : _a.trim()], {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${endpoint.getToken()}`,
                },
            });
            const data = yield response.json();
            button.textContent === "follow"
                ? (button.textContent = "unfollow")
                : (button.textContent = "follow");
        }
    });
}
