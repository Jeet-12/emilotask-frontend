import axios from 'axios';
import { setAlert } from '../store/actions/alertActions';

const API_URL = process.env.REACT_APP_API_URL;

// Get all posts
export const getPosts = (params = {}) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/posts`, { params });
    
    dispatch({
      type: 'GET_POSTS',
      payload: res.data
    });
  } catch (err) {
    dispatch(setAlert('Failed to fetch posts', 'danger'));
  }
};

// Get single post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/posts/${id}`);
    
    dispatch({
      type: 'GET_POST',
      payload: res.data
    });
  } catch (err) {
    dispatch(setAlert('Failed to fetch post', 'danger'));
  }
};

// Create post
export const createPost = (postData) => async (dispatch) => {
  console.log('Creating post with data:', postData);
  try {
    const res = await axios.post(`${API_URL}/posts`, postData);
    
    dispatch({
      type: 'CREATE_POST',
      payload: res.data
    });
    
    dispatch(setAlert('Post created successfully', 'success'));
    return true;
  } catch (err) {
    const errors = err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    return false;
  }
};

// Update post
export const updatePost = async (postId, postData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/posts/${postId}`, postData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error updating post:', err);
    throw err;
  }
};

export const getPostById = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching post:', err);
    throw err;
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error deleting post:', err);
    throw err;
  }
};

// Like post
export const likePost = (id) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/posts/${id}/like`);
    
    dispatch({
      type: 'LIKE_POST',
      payload: res.data
    });
  } catch (err) {
    dispatch(setAlert('Failed to like post', 'danger'));
  }
};

// View post
export const viewPost = (id) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/posts/${id}/view`);
    
    dispatch({
      type: 'VIEW_POST',
      payload: res.data
    });
  } catch (err) {
    console.error('Failed to record view:', err);
  }
};