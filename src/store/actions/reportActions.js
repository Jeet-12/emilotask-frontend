import { 
  GET_REPORTS, 
  GET_REPORT, 
  EXPORT_REPORT,
  REPORT_ERROR
} from './types';
import { setAlert } from './alertActions';
import api from '../../api/reports';

// Get all reports
export const getReports = (params = {}) => async (dispatch) => {
  try {
    const res = await api.getReports(params);
    
    dispatch({
      type: GET_REPORTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get single report
export const getReport = (id) => async (dispatch) => {
  try {
    const res = await api.getReport(id);
    
    dispatch({
      type: GET_REPORT,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: REPORT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Export report
export const exportReport = (id) => async (dispatch) => {
  try {
    await api.exportReport(id);
    
    dispatch({
      type: EXPORT_REPORT,
      payload: id
    });
    
    dispatch(setAlert('Report exported successfully', 'success'));
  } catch (err) {
    dispatch(setAlert('Failed to export report', 'danger'));
  }
};