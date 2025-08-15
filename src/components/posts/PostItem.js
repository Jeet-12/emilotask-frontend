import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePost } from '../../api/posts';
import { likePost, viewPost } from '../../api/posts'; 
import { 
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Stack,
  Tooltip,
  Divider,
  CircularProgress 
} from '@mui/material';
import { 
  ThumbUpOutlined, 
  ThumbUp, 
  VisibilityOutlined,
  EditOutlined,
  DeleteOutline,
  CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
  }
}));

const PostItem = ({ post, selectable, onSelect }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [selected, setSelected] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!post) return null;

  const handleLike = () => {
    if (post?._id) {
      dispatch(likePost(post._id));
      setLiked(!liked);
    }
  };

  const handleView = () => {
    if (post?._id) {
      dispatch(viewPost(post._id));
    }
  };

  const handleSelect = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    if (onSelect && post?._id) {
      onSelect(post._id, newSelected);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setIsDeleting(true);
      await deletePost(post._id);
      window.location.reload();
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const canEdit = user?._id && post?.creator?._id && user._id === post.creator._id;
  const canDelete = canEdit || user?.role === 'admin';
  const likeCount = (post.likes || 0) + (liked ? 1 : 0);

  return (
    <StyledCard>
      {post.mediaUrl && (
        <CardMedia
          component="img"
          alt="Post media"
          height="240"
          image={post.mediaUrl}
          onClick={handleView}
          sx={{ 
            cursor: 'pointer',
            objectFit: 'cover'
          }}
        />
      )}
      
      <CardContent>
        {post.creator && (
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              src={post.creator.avatar} 
              alt={post.creator.username}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography variant="subtitle2" fontWeight="medium">
              {post.creator.username}
            </Typography>
            {post.createdAt && (
              <Typography variant="caption" color="text.secondary" ml={1}>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </Typography>
            )}
          </Box>
        )}
        
        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          {post.content}
        </Typography>
        
        {post.tags?.length > 0 && (
          <Box mb={2}>
            {post.tags.map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                sx={{ mr: 1, mb: 1 }} 
              />
            ))}
          </Box>
        )}
      </CardContent>

      <Divider />
      
      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Like">
            <Button 
              startIcon={liked ? <ThumbUp /> : <ThumbUpOutlined />}
              onClick={handleLike}
              size="small"
              color={liked ? 'primary' : 'inherit'}
            >
              {likeCount}
            </Button>
          </Tooltip>
          
          <Tooltip title="Views">
            <Button 
              startIcon={<VisibilityOutlined />}
              onClick={handleView}
              size="small"
            >
              {post.views || 0}
            </Button>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={1}>
          {selectable && (
            <Button
              variant={selected ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              onClick={handleSelect}
              startIcon={selected ? <CheckCircle /> : null}
              sx={{ borderRadius: '20px' }}
            >
              {selected ? 'Selected' : 'Select'}
            </Button>
          )}
          
          {canEdit && (
            <Button
              component={Link}
              to={`/posts/edit/${post._id}`}
              startIcon={<EditOutlined />}
              size="small"
              variant="outlined"
              color="primary"
            >
              Edit
            </Button>
          )}
          
          {canDelete && (
            <Button
              onClick={handleDelete}
              startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteOutline />}
              size="small"
              variant="outlined"
              color="error"
              disabled={isDeleting}
            >
              Delete
            </Button>
          )}
        </Stack>
      </CardActions>
    </StyledCard>
  );
};

export default PostItem;