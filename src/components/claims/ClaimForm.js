import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Checkbox, 
  FormControlLabel,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Input
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7000/api';

const ClaimForm = ({ posts = [] }) => {
  const navigate = useNavigate();
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Track "fake" uploaded files for UI purposes
  const [fakeUploads, setFakeUploads] = useState({});

  const handlePostSelect = (postId, isChecked) => {
    if (isChecked) {
      const post = posts.find(p => p._id === postId);
      setSelectedPosts([...selectedPosts, post]);
    } else {
      setSelectedPosts(selectedPosts.filter(p => p._id !== postId));
      const newFakeUploads = {...fakeUploads};
      delete newFakeUploads[postId];
      setFakeUploads(newFakeUploads);
    }
  };

  const handleFakeUpload = (postId, e) => {
    if (e.target.files.length > 0) {
      setFakeUploads({
        ...fakeUploads,
        [postId]: {
          name: e.target.files[0].name,
          size: e.target.files[0].size
        }
      });
    }
  };

  const generateRandomMediaProof = () => {
    const types = ['jpg', 'png', 'mp4', 'mov'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return `proof_${Math.random().toString(36).substring(2, 8)}.${randomType}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (selectedPosts.length === 0) {
        throw new Error('Please select at least one post');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const postsData = selectedPosts.map(post => ({
        postId: post._id,
        views: post.views,
        likes: post.likes,
        mediaProof: generateRandomMediaProof() 
      }));

      // Make API call with JSON data
      const response = await axios.post(`${API_URL}/claims`, { posts: postsData }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        navigate('/user');
      } else {
        throw new Error(response.data.error || 'Failed to submit claim');
      }
    } catch (err) {
      console.error('Claim submission error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Select Posts to Claim</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {posts.map(post => (
              <Grid item xs={12} key={post._id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPosts.some(p => p._id === post._id)}
                      onChange={(e) => handlePostSelect(post._id, e.target.checked)}
                      color="primary"
                    />
                  }
                  label={`${post.content.substring(0, 50)}... (Views: ${post.views}, Likes: ${post.likes})`}
                />
                
                {selectedPosts.some(p => p._id === post._id) && (
                  <Box mt={1} ml={4}>
                    <Typography variant="body2" gutterBottom>
                      Media Proof :
                    </Typography>
                    <Input
                      type="file"
                      inputProps={{ accept: 'image/*,video/*' }}
                      onChange={(e) => handleFakeUpload(post._id, e)}
                      sx={{ display: 'none' }}
                      id={`file-upload-${post._id}`}
                    />
                    <label htmlFor={`file-upload-${post._id}`}>
                      <Button 
                        variant="outlined" 
                        component="span"
                        size="small"
                      >
                        Choose File
                      </Button>
                    </label>
                    {fakeUploads[post._id] && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {fakeUploads[post._id].name} ({Math.round(fakeUploads[post._id].size/1024)} KB)
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
          
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || selectedPosts.length === 0}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Claim'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClaimForm;