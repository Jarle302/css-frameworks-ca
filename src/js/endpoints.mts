export const endpoints = {
  register: "/social/auth/register",
  login: "/social/auth/login",
  baseUrl: "https://api.noroff.dev/api/v1",
  oneUser: "/social/profiles/<name>",
  allUsers: "/social/profiles",
  postsByOneUser: "/social/profiles/<name>/posts",
};

/**
 * Generates dynamic API endpoints based on a provided user ID and offers several utility functions for API URL management.
 *
 * @function
 * @param {string|null} userId - The user ID which will be used in constructing specific API endpoints.
 * @returns {Object} - A collection of dynamically generated endpoints and utility methods for managing URLs.
 *
 * @example
 *
 * const apiUtils = endpointObject("12345");
 * console.log(apiUtils.profileOneUser); // Outputs: "https://api.noroff.dev/api/v1/social/profiles/12345"
 */
export default function endpointObject(userId: string | null) {
  function closureCount() {
    let _count: number = -10;
    const increment: Function = () => {
      return (_count += 10);
    };

    return increment;
  }

  function allPostPaginatedby100() {
    let count: number = -100;

    function incrementUrl() {
      count += 100;
      return `https://api.noroff.dev/api/v1/social/posts?limit=100&offset=${count}&_author=true&_comments=true&_reactions=true`;
    }
    function resetCount() {
      count = -100;
    }
    function getCount() {
      return count;
    }

    return { resetCount, incrementUrl, getCount };
  }

  function sortUrl() {
    let url: string | URL;
    let count = 0;
    let previousSearch: string;
    function setString(
      newUrl: string,
      offset: number = 10,
      limit: number = 10
    ) {
      let urlObject = new URL(newUrl);
      let incrementedUrl = new URLSearchParams(urlObject.search);
      if (limit) {
        incrementedUrl.set("limit", limit.toString());
        urlObject.search = incrementedUrl.toString();
        newUrl = urlObject.toString();
      }
      if (newUrl + count === url) {
        count += offset;
        incrementedUrl.set("offset", count.toString());
        urlObject.search = incrementedUrl.toString();
        url = urlObject.toString();
      } else {
        count = 0;
        url = newUrl + count;
      }
      return url;
    }
    function getString() {
      return url;
    }
    function getCount() {
      return count;
    }
    function setCount(number: number) {
      count = number;
    }
    function setSearch(searchWord: string) {
      if (searchWord !== previousSearch) setCount(0);
    }
    function getSearch() {
      return previousSearch;
    }

    return { setString, getString, getCount, setCount, setSearch, getSearch };
  }

  const countTen = closureCount();
  const countTenFollowed = closureCount();

  return {
    register: "https://api.noroff.dev/api/v1/social/auth/register",
    login: "https://api.noroff.dev/api/v1/social/auth/login",
    baseUrl: "https://api.noroff.dev/api/v1",
    profileOneUser: `https://api.noroff.dev/api/v1/social/profiles/${userId}`,
    profileOneUserAllEnabled: `https://api.noroff.dev/api/v1/social/profiles/${userId}?_posts=true&_followers=true&_following=true`,
    profileAllUsers: "https://api.noroff.dev/api/v1/social/profiles",
    follow: `https://api.noroff.dev/api/v1/social/profiles/${userId}/follow`,
    unfollow: `https://api.noroff.dev/api/v1/social/profiles/${userId}/unfollow`,
    postsByOneUser: `https://api.noroff.dev/api/v1/social/profiles/${userId}/posts`,
    changeMedia: `https://api.noroff.dev/api/v1/social/profiles/${userId}/media`,
    allPostsFollowed: `https://api.noroff.dev/api/v1/social/posts/following??limit=10&offset=${countTenFollowed()}&_author=true&_comments=true&_reactions=true&sort=updated`,
    createPost: `https://api.noroff.dev/api/v1/social/posts`,
    paginatedPosts: `https://api.noroff.dev/api/v1/social/posts?limit=10&offset=${countTen()}&_author=true&_comments=true&_reactions=true&sort=updated`,
    getId: function (id: number) {
      return `https://api.noroff.dev/api/v1/social/posts/${id}?_author=true&_comments=true&_reactions=true`;
    },
    comment: function (id: number) {
      return `https://api.noroff.dev/api/v1/social/posts/${id}/comment`;
    },
    react: function (symbol: string, id: string) {
      return `https://api.noroff.dev/api/v1/social/posts/${id}/react/${symbol}`;
    },
    getToken: function () {
      return JSON.parse(localStorage.getItem("token") || "");
    },
    sortAfter: function (
      sortWord: string = "updated",
      sortOrder: string = "desc"
    ) {
      return `https://api.noroff.dev/api/v1/social/posts?limit=10&offset=${countTen()}&_author=true&_comments=true&_reactions=true&sort=${sortWord}&sortOrder=${sortOrder}`;
    },
    paginatedSort: function (sort: string, order: string) {
      const counter = closureCount();

      return `https://api.noroff.dev/api/v1/social/posts?limit=10&offset=${counter()}&_author=true&_comments=true&_reactions=true&sort=${sort}&sortOrder=${order}`;
    },
    sortAndPaginate: sortUrl(),
    generatePaginate: function (sort: string, order: string) {
      const validCategories = ["title", "tags", "created", "body"];
      sort = validCategories.some((element) => element === sort)
        ? sort
        : "updated";
      return `https://api.noroff.dev/api/v1/social/posts?limit=10&_author=true&_comments=true&_reactions=true&sort=${sort}&sortOrder=${order}&offset=`;
    },
    filterUrl: allPostPaginatedby100(),
  };
}
