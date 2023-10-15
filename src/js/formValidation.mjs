import createElementFactory from "./createElementFactory.mjs";
/**
 * Validates an HTML input element based on its value.
 * If the input element doesn't have a value, its border is set to red, indicating an invalid input.
 * If it does have a value, any border styling is removed.
 *
 * @function
 * @param {HTMLInputElement} domEl - The HTML input element to be validated.
 *
 * @returns {boolean} Returns `true` if the input element has a value, otherwise returns `false`.
 *
 * @example
 *
 * const inputElement = document.querySelector('#myInput');
 * const isValid = validateSelect(inputElement);
 *
 * if (!isValid) {
 *   console.log("Input is not valid!");
 * }
 */
export default function validateSelect(domEl) {
    if (!domEl.value) {
        domEl.style.border = "solid 3px red";
        return false;
    }
    else {
        domEl.style.border = "none";
        return true;
    }
}
/**
 * Validates the value of a given DOM input element based on a predicate function.
 * If the value is invalid, an error message is displayed after the input element.
 *
 * @param {HTMLInputElement} domEl - The DOM input element to be validated.
 * @param {string} message - The error message to be displayed if the validation fails.
 * @param {Function} predicate - A function that takes the input value and returns a boolean indicating its validity.
 *
 * @returns {boolean} - Returns true if the validation is successful, otherwise returns false.
 *
 * @example
 * const inputElement = document.getElementById('passwordInput');
 * validateForm(inputElement, "Please input a password with min 8 characters", (value) => value.length > 7);
 */
export function validateForm(domEl, message, predicate) {
    var _a;
    if (!predicate(domEl.value)) {
        if (document.querySelector(`#error${domEl.id}`)) {
            return;
        }
        const errorMessage = createElementFactory("span", message, document.querySelector("body"), { id: "error" + domEl.id }, "text-danger");
        domEl.after(errorMessage);
        return false;
    }
    if (document.querySelector(`#error${domEl.id}`)) {
        (_a = document.querySelector(`#error${domEl.id}`)) === null || _a === void 0 ? void 0 : _a.remove();
    }
    return true;
}
