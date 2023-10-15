/**
 * Creates an HTML element, sets its properties, appends it to a parent element, and returns the created element.
 *
 * @function
 *
 * @param {string} tag - The type of HTML element to create (e.g., "div", "a", "span").
 * @param {string} textContent - The text content to be added to the created element.
 * @param {HTMLElement} parentElement - The parent element to which the created element will be appended.
 * @param {Object} object - An object containing key-value pairs to set as attributes on the created element.
 * @param {...string} classNames - Zero or more class names to be added to the created element.
 *
 * @returns {HTMLElement} The created and appended HTML element.
 *
 * @example
 *
 * const container = document.querySelector('.container');
 * createElementFactory("div", "Hello World", container, { id: 'greeting' }, "greetingClass", "anotherClass");
 */
export default function createElementFactory(tag, textContent, parentElement, object, ...classNames) {
    classNames.forEach;
    const element = document.createElement(tag);
    element.textContent = textContent;
    parentElement.appendChild(element);
    Object.keys(object).forEach((key) => {
        element.setAttribute(key, object[key]);
    });
    classNames.forEach((classname) => element.classList.add(classname));
    return element;
}
