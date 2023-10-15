var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { endpoints } from "./endpoints.mjs";
import fadeText from "./fadeText.mjs";
import { validateForm } from "./formValidation.mjs";
const registerObject = {
    email: "email",
    userName: "username",
    password: "password",
    repeatedPassword: "password",
};
const inputPassword = document.querySelector("#password--register");
const inputEmail = document.querySelector("#email--register");
const inputRpassword = document.querySelector("#password--register--repeat");
const inputUserName = document.querySelector("#username--register");
const loginUserName = document.querySelector("#username--login");
const loginPassword = document.querySelector("#password--login");
const buttonRegister = document.querySelector("#button--register");
const buttonLogin = document.querySelector("#button--login");
const loginObject = {
    email: loginUserName.value ? loginUserName.value : "",
    password: loginPassword.value ? loginPassword.value : "",
};
loginPassword.addEventListener("input", () => {
    loginObject.password = loginPassword.value;
});
loginUserName.addEventListener("input", () => {
    loginObject.email = loginUserName.value;
});
/**
 * Listens for an 'input' event on a given HTML input element and updates a global `registerObject`
 * with the input's value indexed by a specified property name.
 *
 * @function
 * @param {HTMLInputElement} input - The HTML input element from which to collect the value.
 * @param {registerProp} inputName - The property name in the `registerObject` where the input value will be stored.
 *
 * @example
 *
 * const usernameInput = document.querySelector('#username');
 * collectInput(usernameInput, 'username');
 *
 * // After input, registerObject will be updated with the user's input:
 * // e.g., registerObject = { username: 'johnDoe' }
 */
function collectInput(input, inputName) {
    input.addEventListener("input", () => {
        if (input.value) {
            registerObject[inputName] = input.value;
        }
        return;
    });
}
collectInput(inputEmail, "email");
collectInput(inputPassword, "password");
collectInput(inputUserName, "userName");
collectInput(inputRpassword, "repeatedPassword");
/**
 * Registers a new user account by sending a POST request with provided email, username, and password.
 *
 * @async
 * @function
 * @param {Object} param0 - An object containing the necessary values for account registration.
 * @param {string} param0.email - The email address of the user.
 * @param {string} param0.userName - The desired username of the user.
 * @param {string} param0.password - The password for the account.
 * @returns {Promise<void>} A promise that resolves when the registration process completes.
 *                          The function currently does not return any data.
 *
 * @throws Will throw an error if the fetch operation fails or if the server response cannot be parsed as JSON.
 *
 * @example
 *
 * const userDetails = {
 *   email: 'john.doe@example.com',
 *   userName: 'johnDoe',
 *   password: 'password123'
 * };
 *
 * try {
 *   await registerAccount(userDetails);
 *   console.log('Registration successful!');
 * } catch (error) {
 *   console.error('Failed to register:', error);
 * }
 */
function registerAccount({ email, userName, password, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${endpoints.baseUrl + endpoints.register}`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email, name: userName, password }),
            });
            const data = yield response.json();
            if (data.statusCode < 500 && data.statusCode >= 400) {
                throw new Error(data.errors.map((error) => error.message).join(","));
            }
            if (data.id) {
                fadeText();
            }
            console.log(data);
        }
        catch (error) {
            alert(error);
        }
    });
}
buttonRegister === null || buttonRegister === void 0 ? void 0 : buttonRegister.addEventListener("click", () => {
    if (!validateForm(inputEmail, "Please enter a valid email  example@noroff.no or example@stud.noroff.no", (value) => {
        if ((value.split("@")[0].length > 0 &&
            value.split("@")[1] === "noroff.no") ||
            value.split("@")[1] === "stud.noroff.no") {
            return true;
        }
        else
            return false;
    }) ||
        !validateForm(inputPassword, "please input password min 8 characters", (value) => value.length > 7) ||
        !validateForm(inputRpassword, "passwords dont match", (value) => value === inputPassword.value ||
            !validateForm(inputUserName, "minimum one character", (value) => value.lengt > 0))) {
        return;
    }
    registerAccount(registerObject);
});
buttonLogin === null || buttonLogin === void 0 ? void 0 : buttonLogin.addEventListener("click", () => {
    if (!validateForm(loginUserName, "Please enter a valid email  example@noroff.no or example@stud.noroff.no", (value) => {
        if ((value.split("@")[0].length > 0 &&
            value.split("@")[1] === "noroff.no") ||
            value.split("@")[1] === "stud.noroff.no") {
            return true;
        }
        else
            return false;
    }) ||
        !validateForm(loginPassword, "please input password min 8 characters", (value) => value.length > 7)) {
        return;
    }
    login(loginObject);
});
/**
 * Logs in a user by sending a POST request with provided email and password.
 *
 * @async
 * @function
 * @param {Object} param0 - An object containing the login credentials.
 * @param {string} param0.email - The email address of the user.
 * @param {string} param0.password - The password for the account.
 * @returns {Promise<void>} A promise that resolves once the login process completes.
 *                          The function logs the server response, saves the token, username, and avatar to local storage,
 *                          and then changes the page (based on a `changePage` function).
 *
 * @throws Will throw an error if the fetch operation fails or if the server response cannot be parsed as JSON.
 *
 * @example
 *
 * const userCredentials = {
 *   email: 'john.doe@example.com',
 *   password: 'password123'
 * };
 *
 * try {
 *   await login(userCredentials);
 *   console.log('Login successful!');
 * } catch (error) {
 *   console.error('Failed to log in:', error);
 * }
 */
function login({ email, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${endpoints.baseUrl + endpoints.login}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = yield response.json();
        localStorage.setItem("token", JSON.stringify(data.accessToken));
        localStorage.setItem("currentUser", JSON.stringify(data.name));
        localStorage.setItem("avatar", JSON.stringify(data.avatar));
        changePage(data.name);
    });
}
/**
 * Redirects the browser to the profile page of the specified user.
 *
 * @function
 * @param {string} name - The name of the user whose profile page should be accessed.
 *
 * @example
 *
 * changePage('JohnDoe');
 * // The browser will be redirected to: `/src/profile/index.html?user=JohnDoe&current=JohnDoe`
 */
function changePage(name) {
    window.location.href = `/src/profile/index.html?user=${name}&current=${name}`;
}
/**
 * Function to redirect logged-in users to the profile page.
 * It checks the local storage for the current user, and if found,
 * it changes the location to the user's profile page.
 *
 * @param {void}
 * @example
 * ```js
 * redirectLoggedInUsers();
 * ```
 */
(function redirectLoggedInUsers() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        window.location.href = `/src/profile/index.html?user=${user}&current=${user}`;
    }
})();
