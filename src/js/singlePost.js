var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import callApi from "./callApi.mjs";
import endpointObject from "./endpoints.mjs";
import optionFactory from "./optionFactory.mjs";
import renderPosts from "./renderPost.mjs";
import commentButton from "./commentOnClick.mjs";
import deletePost from "./deleteOnClick.mjs";
import updatePost from "./updateOnClick.mjs";
import reactToPostTwo from "./reactToPost.mjs";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const endpoint = endpointObject(JSON.parse(localStorage.getItem("currentUser")));
const getId = optionFactory("GET", {}, endpoint);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield callApi(endpoint.getId(id), getId);
    renderPosts(document.querySelector("#postContainer"), data);
    commentButton();
    deletePost();
    updatePost();
    reactToPostTwo();
}))();
