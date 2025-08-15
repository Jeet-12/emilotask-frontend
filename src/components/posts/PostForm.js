import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import FileInput from '../common/FileInput';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const PostForm = ({ post = null, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    mediaUrl: ''
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        content: post.content || '',
        mediaUrl: post.mediaUrl || ''
      });
    }
  }, [post]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setFormData(prev => ({ ...prev, mediaUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const postData = {
        content: formData.content.trim(),
        mediaUrl: formData.mediaUrl.trim() || undefined
      };

      let response;
      if (post) {
        response = await axios.put(`${API_URL}/posts/${post._id}`, postData, config);
        setSuccess('Post updated successfully!');
      } else {
        // Create new post
        response = await axios.post(`${API_URL}/posts`, postData, config);
        setSuccess('Post created successfully!');
      }

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      } else if (post) {
        navigate("/user");
      }

      if (!post) {
        setFormData({ content: '', mediaUrl: '' });
        setFile(null);
      }
      navigate("/user");

    } catch (err) {
      console.error('Post operation error:', err);
      let errorMessage = post ? 'Failed to update post' : 'Failed to create post';
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Server error: ${err.response.status}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: '0 auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {post ? 'Edit Post' : 'Create New Post'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Content"
            name="content"
            multiline
            rows={4}
            value={formData.content}
            onChange={handleChange}
            disabled={isSubmitting}
            error={!!error && !formData.content.trim()}
            helperText={!!error && !formData.content.trim() ? 'Content is required' : ''}
          />

          {!file && (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Media URL (optional)"
              name="mediaUrl"
              value={formData.mediaUrl}
              onChange={handleChange}
              disabled={!!file || isSubmitting}
            />
          )}

          <FileInput
            onChange={handleFileChange}
            accept="image/*,video/*"
            label="Or upload media file"
            disabled={isSubmitting}
            selectedFile={file}
            onClear={() => setFile(null)}
          />

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            {post && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !formData.content.trim()}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                post ? 'Update Post' : 'Create Post'
              )}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;