import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';  // Add this import
import { getPosts } from '../../api/posts';
import { getClaims, createClaim } from '../../api/claims';
import { 
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button  // Add this import
} from '@mui/material';
import PostList from '../posts/PostList';
import ClaimForm from '../claims/ClaimForm';
import ClaimList from '../claims/ClaimList';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { posts, loading: postsLoading } = useSelector(state => state.post);
  const { claims, loading: claimsLoading } = useSelector(state => state.claim);
  const [selectedPosts, setSelectedPosts] = useState([]);

  useEffect(() => {
    dispatch(getPosts());
    dispatch(getClaims());
  }, [dispatch]);

  const handleSubmitClaim = (selectedPosts, mediaProofs) => {
    const claimData = selectedPosts.map(post => ({
      postId: post._id,
      views: post.views,
      likes: post.likes,
      mediaProof: mediaProofs[post._id]
    }));
    dispatch(createClaim(claimData));
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            User Dashboard
          </Typography>
          <Button
            component={Link}
            to="/posts/new"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            Create New Post
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Posts
                </Typography>
                <PostList 
                  posts={posts} 
                  loading={postsLoading} 
                  selectable 
                  onSelectionChange={setSelectedPosts}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Submit Claim
                </Typography>
                <ClaimForm 
                  posts={posts} 
                  onSubmit={handleSubmitClaim} 
                  selectedPosts={selectedPosts}
                />
              </CardContent>
            </Card>
            
            <Box mt={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    My Claims
                  </Typography>
                  <ClaimList claims={claims} loading={claimsLoading} />
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserDashboard;