import createElementFactory from "./createElementFactory.mjs";

/**
 * Displays a fade-in text message to provide feedback to the user. If a message element is already present,
 * it updates the content and restarts the fade-in animation.
 *
 * @function
 * @param {string} [message="Success✅!"] - The feedback message to display.
 * @param {HTMLElement} [parentElement=document.querySelector("main")] - The HTML element where the message should be appended.
 *
 * @example
 *
 * // Display a default "Success✅!" message in the main element.
 * fadeText();
 *
 * // Display a custom message "Loading..." in a custom parent element.
 * const parentDiv = document.querySelector(".customDiv");
 * fadeText("Loading...", parentDiv);
 */
export default function fadeText(
  message: string = "Success✅!",
  parentElement = document.querySelector("main")
) {
  const successMessage = document.querySelector("#statusText");
  if (!successMessage) {
    createElementFactory(
      "p",
      message,
      parentElement,
      { id: "statusText" },
      "start-animation"
    );
  } else {
    successMessage.textContent = message;
    successMessage.classList.remove("start-animation");
    void successMessage.offsetHeight; // This line forces a reflow and i got it from chat-gpt
    successMessage.classList.add("start-animation");
  }
}
