import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid } from '@mui/material';
import { 
  Box,
  Typography,
  CircularProgress,
  List
} from '@mui/material';
import PostItem from './PostItem';

const PostList = ({ posts, loading, selectable = false, onSelect }) => {
  const [selectedPosts, setSelectedPosts] = React.useState([]);

  const handleSelect = (postId, isSelected) => {
    if (isSelected) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
    
    if (onSelect) {
      onSelect(postId, isSelected);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Box mt={4}>
        <Typography variant="body1" align="center">
          No posts found
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
      {posts.map(post => (
        <PostItem 
          key={post._id} 
          post={post} 
          selectable={selectable}
          onSelect={handleSelect}
           xs={12}   
            sm={6} 
        />
      ))}
       </Grid>
    </Container>
    </List>
  );
};

export default PostList;