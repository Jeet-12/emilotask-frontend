import { 
  GET_REPORTS, 
  GET_REPORT, 
  EXPORT_REPORT,
  REPORT_ERROR
} from '../actions/types';

const initialState = {
  reports: [],
  report: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  
  switch (type) {
    case GET_REPORTS:
      return {
        ...state,
        reports: payload.data,
        loading: false
      };
    case GET_REPORT:
      return {
        ...state,
        report: payload.data,
        loading: false
      };
    case EXPORT_REPORT:
      return {
        ...state,
        loading: false
      };
    case REPORT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}