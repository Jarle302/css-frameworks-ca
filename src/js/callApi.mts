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
export default async function callApi(
  endpoint: string,
  options: {}
): Promise<[]> {
  try {
    document.querySelector(".spinner-border")?.style.display = "block";
    const response = await fetch(endpoint, options);
    const data = await response.json();
    if (data.length > 0 && data) {
      return data;
    } else if (data.title) {
      return data;
    } else {
      console.log("response is empty, or not what expected");
    }
  } catch (err) {
    console.log(err.message);
  } finally {
    document.querySelector(".spinner-border")?.style.display = "none";
  }
}
