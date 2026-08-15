const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPost,
  getPublicPosts,
  getPublicPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router.get('/public', getPublicPosts);
router.get('/public/:slug', getPublicPost);
router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', auth, createPost);
router.put('/:slug', auth, updatePost);
router.delete('/:slug', auth, deletePost);

module.exports = router;
