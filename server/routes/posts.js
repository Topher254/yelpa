const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/user/:userId', postController.getUserPosts);
router.post('/like/:postId', postController.likePost);
router.delete('/:postId', postController.deletePost);

module.exports = router;