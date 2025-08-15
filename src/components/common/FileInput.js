import React, { useState } from 'react';
import { Button, Typography } from '@mui/material'; // Updated import
import { CloudUpload } from '@mui/icons-material'; // Updated icon import

const FileInput = ({ onChange, accept, label, multiple = false }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      onChange(e.target.files[0]);
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file-input"
        type="file"
        onChange={handleFileChange}
        multiple={multiple}
      />
      <label htmlFor="file-input">
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<CloudUpload />}
        >
          {label}
        </Button>
      </label>
      {fileName && (
        <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
          Selected: {fileName}
        </Typography>
      )}
    </div>
  );
};

export default FileInput;