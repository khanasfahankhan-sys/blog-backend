const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', auth, createPost);
router.put('/:slug', auth, updatePost);
router.delete('/:slug', auth, deletePost);

module.exports = router;
