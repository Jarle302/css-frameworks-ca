import endpointObject from "./endpoints.mjs";
import callApi from "./callApi.mjs";
import renderPosts, { renderComments } from "./renderPost.mjs";
import filterPosts from "./filter.mjs";
import commentButton from "./commentOnClick.mjs";
import deletePost from "./deleteOnClick.mjs";
import updatePost from "./updateOnClick.mjs";
import reactToPostTwo from "./reactToPost.mjs";
import renderTempPost from "./renderTempPost.mjs";
import validateSelect from "./formValidation.mjs";
import observerTargetClosure from "./observerClosure.mjs";
import clearForm from "./clearForm.mjs";
const endpoint = endpointObject(
  JSON.parse(localStorage.getItem("currentUser"))
);

const sortInput = document.querySelector("#sort--feed") as HTMLSelectElement;
const sortOrder = document.querySelector("#sort--order") as HTMLInputElement;
const searchInput = document.querySelector("#search--feed") as HTMLInputElement;
const filterButton = document.querySelector("#filter--button");
const searchButton = document.querySelector(
  "#search--button"
) as HTMLButtonElement;
const createMessageTitle = document.querySelector(
  "#title--feed"
) as HTMLInputElement;
const createMessageMessage = document.querySelector(
  "#text-body--feed"
) as HTMLInputElement;
const createMessageMedia = document.querySelector(
  "#media--feed"
) as HTMLInputElement;
const createMessageTags = document.querySelector(
  "#tags--feed"
) as HTMLInputElement;
const postButton = document.querySelector("#post--button") as HTMLButtonElement;
const postContainer = document.querySelector(
  "#feed--container"
) as HTMLDivElement;

createMessageMedia?.addEventListener("input", () => {
  messageObject.media = createMessageMedia.value;
});
createMessageTitle?.addEventListener("input", () => {
  messageObject.title = createMessageTitle.value;
});
createMessageMessage?.addEventListener("input", () => {
  messageObject.body = createMessageMessage.value;
});
createMessageTags?.addEventListener("input", () => {
  const tagArr = createMessageTags.value.split("#");
  messageObject.tags = tagArr;
});

searchInput.addEventListener("input", () => {
  endpoint.filterUrl.resetCount();
  endpoint.sortAndPaginate.setSearch(searchInput.value);
});

filterButton?.addEventListener("click", async () => {
  if (!validateSelect(sortInput) || !validateSelect(searchInput)) {
    return;
  }
  endpoint.filterUrl.resetCount();
  postContainer.innerHTML = "";
  const allPosts = await filterPosts(searchInput.value, sortInput.value);
  allPosts.forEach((post) => renderPosts(postContainer, post));
  updatePost(postContainer);
  reactToPostTwo();
  commentButton();
  deletePost();
});
searchButton.addEventListener("click", async () => {
  if (!validateSelect(sortInput)) {
    return;
  }

  const data: post[] = !searchInput.value
    ? await callApi(
        endpoint.sortAndPaginate.setString(
          endpoint.generatePaginate(sortInput.value, sortOrder.value)
        ),
        postOption
      )
    : await callApi(
        endpoint.sortAndPaginate.setString(
          endpoint.generatePaginate(sortInput.value, sortOrder.value),
          100,
          100
        ),
        postOption
      );
  if (endpoint.sortAndPaginate.getCount() == 0) {
    postContainer.innerHTML = "";
  }
  if (searchInput.value) {
    let foundItem: post | undefined = await searchApi(
      data,
      sortInput.value,
      0,
      searchInput.value
    );
    if (foundItem) {
      renderPosts(postContainer, foundItem);
      updatePost(postContainer);
      reactToPostTwo();
      commentButton();
      deletePost();
    } else if (data.length === 1) {
      renderPosts(postContainer, data[0]);
      updatePost(postContainer);
      reactToPostTwo();
      commentButton();
      deletePost();
    }
  } else {
    data.forEach((element: post) => renderPosts(postContainer, element));

    reactToPostTwo();
    commentButton();
    deletePost();
    updatePost(postContainer);
    const observedObj = document.querySelectorAll("[data-observed]");
    const target = observedObj[observedObj.length - 1];
    setTarget();
    isObserving(true, intersectionObserver);
  }
});

const [setTarget, isObserving] = observerTargetClosure();

type htmlMethod = "POST" | "GET" | "PATCH" | "PUT" | "DELETE";

interface post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  media: string;
  created: Date;
  updated: Date;
  _count: { comments: number; reactions: number };
  author: { name: string; email: string; avatar: string; media: string };
}

function optionFactory(method: htmlMethod, body: {}) {
  const newObject: {
    method: htmlMethod;
    headers: { Authorization: string; "Content-type": string };
    body?: {};
  } = {
    method: method,
    headers: {
      Authorization: `Bearer ${endpoint.getToken()}`,
      "Content-type": "application/json",
    },
  };
  if (Object.keys(body).length !== 0) {
    newObject.body = JSON.stringify(body);
  }
  return newObject;
}

const postOption = optionFactory("GET", {});

const messageObject: {
  title: string;
  body: string;
  media: string;
  tags: string[];
} = {
  title: "",
  body: "",
  media: "",
  tags: [],
};

postButton?.addEventListener("click", async () => {
  const message = optionFactory("POST", messageObject);
  const data = await callApi(
    endpoint.createPost,

    message
  );
  renderTempPost(postContainer, data);
  reactToPostTwo();
  commentButton();
  deletePost();
  updatePost(postContainer);
  clearForm();
});

const intersectionObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const data = await callApi(
          endpoint.sortAndPaginate.setString(
            endpoint.generatePaginate(sortInput.value, sortOrder.value)
          ),
          postOption
        );
        if (endpoint.sortAndPaginate.getCount() == 0) {
          postContainer.innerHTML = "";
        }
        if (data.length === 1) {
          renderPosts(postContainer, data[0]);
        } else
          data.forEach((element: post) => renderPosts(postContainer, element));
        updatePost(postContainer);
        reactToPostTwo();
        commentButton();
        deletePost();
        isObserving(false, intersectionObserver);
        setTarget();
        isObserving(true, intersectionObserver);
      }
    }),
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  }
);

type category = "title" | "updated" | "tags" | "body" | "author";

/**
 * Recursively searches a given array of posts to find a post matching a specific search word in a given category.
 * If the post isn't found in the initial array, makes an API call to fetch more data and continues the search.
 *
 * @async
 * @function
 * @param {post[]} array - Array of posts to search in.
 * @param {category} [category="body"] - Category of the post to match against (e.g. 'body', 'title', etc).
 * @param {number} [count=0] - Counter to limit the recursive depth (stops after 20 recursions).
 * @param {string|null} [searchWord=null] - The word to search for in the given category.
 *
 * @returns {Promise<post|undefined>} A promise that resolves to a post object if a match is found, otherwise undefined.
 *
 * @example
 *
 * const postsArray = [ ... ];  // Some array of posts.
 *
 * // Search for a specific word in the 'body' category of the posts.
 * const foundPost = await searchApi(postsArray, "body", 0, "exampleWord");
 *
 * if (foundPost) {
 *   console.log("Found post:", foundPost);
 * } else {
 *   console.log("Post not found.");
 * }
 */
async function searchApi(
  array: post[],
  category: category = "body",
  count: number = 0,
  searchWord: string | null = null
): Promise<post | undefined> {
  if (!searchWord || count > 20) {
    return;
  }
  let foundWord;

  if (array[0]?.[category]?.name) {
    foundWord = array.find(
      (post) => post[category].name.toLowerCase() === searchWord.toLowerCase()
    );
  } else if (Array.isArray(array[0]?.[category])) {
    foundWord = array.find((post) =>
      post.tags.some(
        (element) => element.toLowerCase() === searchWord.toLowerCase()
      )
    );
  } else {
    foundWord = array.find(
      (post) => post[category]?.toLowerCase() === searchWord?.toLowerCase()
    );
  }

  if (foundWord) {
    return foundWord;
  } else {
    try {
      const data: post[] = await callApi(
        endpoint.sortAndPaginate.setString(
          endpoint.generatePaginate(sortInput.value, sortOrder.value),
          100,
          100
        ),
        postOption
      );

      if (data && data.length > 1) {
        return searchApi(data, category, count + 1, searchWord);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

(async () => {
  const data: post[] = await callApi(
    endpoint.sortAndPaginate.setString(
      endpoint.generatePaginate(sortInput.value, sortOrder.value)
    ),
    postOption
  );

  if (data.length === 1) {
    renderPosts(postContainer, data[0]);
  } else {
    data.forEach((element: post) => renderPosts(postContainer, element));
  }
  reactToPostTwo();
  commentButton();
  deletePost();
  updatePost(postContainer);
  const observedObj = document.querySelectorAll("[data-observed]");
  const target = observedObj[observedObj.length - 1];
  setTarget();
  isObserving(true, intersectionObserver);
})();

(function renderUserSpecific() {
  document.querySelector("[data-userName]")?.textContent = JSON.parse(
    localStorage.getItem("currentUser")
  );
  document.querySelector("[data-userImg]").src = JSON.parse(
    localStorage.getItem("avatar")
  )
    ? JSON.parse(localStorage.getItem("avatar"))
    : "../assets/placeholder.png";
})();
