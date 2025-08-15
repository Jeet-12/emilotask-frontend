import { 
  GET_POSTS, 
  GET_POST, 
  CREATE_POST, 
  UPDATE_POST, 
  DELETE_POST, 
  LIKE_POST, 
  VIEW_POST,
  POST_ERROR
} from './types';
import { setAlert } from './alertActions';
import api from '../../api/posts';

// Get all posts
export const getPosts = (params = {}) => async (dispatch) => {
  try {
    const res = await api.getPosts(params);
    
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get single post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await api.getPost(id);
    
    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create post
export const createPost = (postData) => async (dispatch) => {
  try {
    const res = await api.createPost(postData);
    
    dispatch({
      type: CREATE_POST,
      payload: res.data
    });
    
    dispatch(setAlert('Post created successfully', 'success'));
    return true;
  } catch (err) {
    const errors = err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    return false;
  }
};

// Update post
export const updatePost = (id, postData) => async (dispatch) => {
  try {
    const res = await api.updatePost(id, postData);
    
    dispatch({
      type: UPDATE_POST,
      payload: res.data
    });
    
    dispatch(setAlert('Post updated successfully', 'success'));
    return true;
  } catch (err) {
    dispatch(setAlert('Failed to update post', 'danger'));
    return false;
  }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    
    dispatch({
      type: DELETE_POST,
      payload: id
    });
    
    dispatch(setAlert('Post deleted successfully', 'success'));
  } catch (err) {
    dispatch(setAlert('Failed to delete post', 'danger'));
  }
};

// Like post
export const likePost = (id) => async (dispatch) => {
  try {
    const res = await api.likePost(id);
    
    dispatch({
      type: LIKE_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch(setAlert('Failed to like post', 'danger'));
  }
};

// View post
export const viewPost = (id) => async (dispatch) => {
  try {
    const res = await api.viewPost(id);
    
    dispatch({
      type: VIEW_POST,
      payload: res.data
    });
  } catch (err) {
    console.error('Failed to record view:', err);
  }
};