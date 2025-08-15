import axios from 'axios';
import { saveAs } from 'file-saver';
import { setAlert } from '../store/actions/alertActions';

const API_URL = process.env.REACT_APP_API_URL;

// Get all reports
export const getReports = (params = {}) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/reports`, { params });
    
    dispatch({
      type: 'GET_REPORTS',
      payload: res.data
    });
  } catch (err) {
    dispatch(setAlert('Failed to fetch reports', 'danger'));
  }
};

// Get single report
export const getReport = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/reports/${id}`);
    
    dispatch({
      type: 'GET_REPORT',
      payload: res.data
    });
  } catch (err) {
    dispatch(setAlert('Failed to fetch report', 'danger'));
  }
};

// Export report
export const exportReport = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${API_URL}/reports/${id}/export`, {
      responseType: 'blob'
    });
    
    const blob = new Blob([res.data], { type: 'text/csv' });
    saveAs(blob, `report-${id}.csv`);
    
    dispatch(setAlert('Report exported successfully', 'success'));
  } catch (err) {
    dispatch(setAlert('Failed to export report', 'danger'));
  }
};