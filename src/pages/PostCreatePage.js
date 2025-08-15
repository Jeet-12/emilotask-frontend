
import { Container, Box, Typography } from '@mui/material';
import PostForm from '../components/posts/PostForm';

const PostCreatePage = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Create New Post
        </Typography>
        <PostForm />
      </Box>
    </Container>
  );
};

export default PostCreatePage;