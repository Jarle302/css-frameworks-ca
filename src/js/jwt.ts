import { endpoints } from "./endpoints.js";

type registerProp = "email" | "userName" | "password" | "repeatedPassword";

interface registerInputValues {
  email: string;
  userName: string;
  password: string;
  repeatedPassword: string;
}

const registerObject: registerInputValues = {
  email: "email",
  userName: "username",
  password: "password",
  repeatedPassword: "password",
};

const inputPassword = document.querySelector(
  "#password--register"
) as HTMLInputElement;
const inputEmail = document.querySelector(
  "#email--register"
) as HTMLInputElement;
const inputRpassword = document.querySelector(
  "#password--register--repeat"
) as HTMLInputElement;
const inputUserName = document.querySelector(
  "#username--register"
) as HTMLInputElement;
const loginUserName = document.querySelector(
  "#username--login"
) as HTMLInputElement;
const loginPassword = document.querySelector(
  "#password--login"
) as HTMLInputElement;
const buttonRegister = document.querySelector("#button--register");
const buttonLogin = document.querySelector("#button--login");
const loginObject: { email: string; password: string } = {
  email: loginUserName.value ? loginUserName.value : "",
  password: loginPassword.value ? loginPassword.value : "",
};

loginPassword.addEventListener("input", () => {
  loginObject.password = loginPassword.value;
  console.log(loginObject);
});
loginUserName.addEventListener("input", () => {
  loginObject.email = loginUserName.value;
  console.log(loginObject);
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
function collectInput(input: HTMLInputElement, inputName: registerProp) {
  input.addEventListener("input", () => {
    if (input.value) {
      registerObject[inputName] = input.value;
      console.log({ registerObject });
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
async function registerAccount({
  email,
  userName,
  password,
}: registerInputValues) {
  const response = await fetch(`${endpoints.baseUrl + endpoints.register}`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ email, name: userName, password }),
  });
  const data = await response.json();
}

buttonRegister?.addEventListener("click", () => {
  registerAccount(registerObject);
});
buttonLogin?.addEventListener("click", () => {
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
async function login({ email, password }: typeof loginObject) {
  const response = await fetch(`${endpoints.baseUrl + endpoints.login}`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  console.log(data);
  localStorage.setItem("token", JSON.stringify(data.accessToken));
  localStorage.setItem("currentUser", JSON.stringify(data.name));
  localStorage.setItem("avatar", JSON.stringify(data.avatar));
  changePage(data.name);
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
function changePage(name: string) {
  window.location.href = `/src/profile/index.html?user=${name}&current=${name}`;
}
