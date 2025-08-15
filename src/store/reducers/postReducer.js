import { 
  GET_POSTS, 
  GET_POST, 
  CREATE_POST, 
  UPDATE_POST, 
  DELETE_POST, 
  LIKE_POST, 
  VIEW_POST,
  POST_ERROR
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload.data,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: payload.data,
        loading: false
      };
    case CREATE_POST:
      return {
        ...state,
        posts: [payload.data, ...state.posts],
        loading: false
      };
    case UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post => 
          post._id === payload.data._id ? payload.data : post
        ),
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case LIKE_POST:
    case VIEW_POST:
      return {
        ...state,
        posts: state.posts.map(post => 
          post._id === payload.data._id ? payload.data : post
        ),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}