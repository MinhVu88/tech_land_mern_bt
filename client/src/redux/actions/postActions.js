import axios from "axios";
import { alertActions } from "./alertActions";
import * as types from "../constants/postConstants";

const getPosts = () => async dispatch => {
  try {
    const res = await axios.get("/api/posts");

    console.log("\nres.data (getPosts | postActions) ->", res.data);

    dispatch({ type: types.GET_POSTS, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const getPostById = postId => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${postId}`);

    console.log("\nres.data (getPostById | postActions) ->", res.data);

    dispatch({ type: types.GET_POST, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const likePostById = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);

    console.log("\nres.data (likePostById | postActions) ->", res.data);

    dispatch({
      type: types.UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (error) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const unlikePostById = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);

    console.log("\nres.data (unlikePostById | postActions) ->", res.data);

    dispatch({
      type: types.UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (error) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const deletePostById = postId => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/${postId}`);

    console.log("\nres.data (deletePostById | postActions) ->", res.data);

    dispatch({ type: types.DELETE_POST, payload: postId });

    dispatch(alertActions.setAlert("post removed", "success"));
  } catch (error) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const createPost = formData => async dispatch => {
  const config = {
    headers: { "Content-Type": "application/json" }
  };

  try {
    const res = await axios.post("/api/posts", formData, config);

    console.log("\nformData (createPost | postActions) ->", formData);
    console.log("\nres.data (createPost | postActions) ->", res.data);

    dispatch({ type: types.ADD_POST, payload: res.data });

    dispatch(alertActions.setAlert("post created", "success"));
  } catch (error) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const commentOnPost = (postId, formData) => async dispatch => {
  const config = { headers: { "Content-Type": "application/json" } };

  try {
    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      formData,
      config
    );

    console.log("\nformData (commentOnPost | postActions) ->", formData);
    console.log("\nres.data (commentOnPost | postActions) ->", res.data);

    dispatch({ type: types.ADD_COMMENT, payload: res.data });

    dispatch(alertActions.setAlert("comment added", "success"));
  } catch (error) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

const deletePostComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    console.log("\nres.data (deletePostComment | postActions) ->", res.data);

    dispatch({ type: types.REMOVE_COMMENT, payload: commentId });

    dispatch(alertActions.setAlert("comment removed", "success"));
  } catch (error) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

export const postActions = {
  createPost,
  getPosts,
  getPostById,
  likePostById,
  unlikePostById,
  deletePostById,
  commentOnPost,
  deletePostComment
};
