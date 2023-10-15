/**
 * Clears the value of form input elements that have the attribute `data-formClear`.
 *
 * This function queries all elements with the attribute `data-formClear` and sets their value to an empty string.
 * It's useful for resetting form fields after a form submission or when initializing a form.
 *
 * @example
 * ```javascript
 * clearForm();  // Clears all form inputs with the `data-formClear` attribute
 * ```
 *
 * @function
 * @export
 */
export default function clearForm() {
  document
    .querySelectorAll("[data-formClear]")
    .forEach((input) => (input.value = ""));
}
