var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Makes an asynchronous API call and processes the response.
 * Displays a spinner while the request is in progress.
 *
 * @function
 * @async
 * @param {string} endpoint - The URL endpoint to call.
 * @param {Object} options - Configuration options for the fetch request.
 * @returns {Promise<Array|Object>} A promise that resolves to the API response data.
 *    If the data is an array and it has elements, it returns the array.
 *    If the data is an object with a title property, it returns the object.
 *    Otherwise, it logs a message and does not explicitly return anything.
 *
 * @example
 *
 * const data = await callApi('https://api.example.com/data', { method: 'GET' });
 */
export default function callApi(endpoint, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (_a = document.querySelector(".spinner-border")) === null || _a === void 0 ? void 0 : _a.style.display = "block";
            const response = yield fetch(endpoint, options);
            const data = yield response.json();
            if (data.length > 0 && data) {
                return data;
            }
            else if (data.title) {
                return data;
            }
            else {
                console.log("response is empty, or not what expected");
            }
        }
        catch (err) {
            console.log(err.message);
        }
        finally {
            (_b = document.querySelector(".spinner-border")) === null || _b === void 0 ? void 0 : _b.style.display = "none";
        }
    });
}
