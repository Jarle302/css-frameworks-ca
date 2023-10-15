/**
 * Creates a closure to manage an element target for observation.
 * It provides methods to set the target from elements with a specific data attribute
 * and to start or stop observing the set target using a provided observer.
 *
 * @function
 * @returns {Array<Function>} An array containing two functions:
 * - `setTarget`: Sets the last element with `data-observed` attribute as the target.
 * - `isObserving`: Starts or stops observing the target based on a boolean value.
 *
 * @example
 *
 * const [setTarget, isObserving] = observerTargetClosure();
 *
 * // Setting the target element.
 * setTarget();
 *
 * // Creating a new IntersectionObserver.
 * const observer = new IntersectionObserver(callbackFunction);
 *
 * // Start observing the target element.
 * isObserving(true, observer);
 *
 * // Stop observing the target element.
 * isObserving(false, observer);
 */
export default function observerTargetClosure() {
    let target;
    function setTarget() {
        if (document.querySelectorAll("[data-observed]")) {
            const observedObj = document.querySelectorAll("[data-observed]");
            target = observedObj[observedObj.length - 1];
            console.log(target);
        }
    }
    function isObserving(bool, obs) {
        bool ? obs.observe(target) : obs.unobserve(target);
    }
    return [setTarget, isObserving];
}
