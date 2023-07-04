const express = require('express');
const Router = express.Router;
const {
  getAllPosts,
  addAPost,
  getPostWithID,
  updatePost,
  deletePost,
  addCommentToPost,
  getCommentsForPost
} = require('../controllers/post-controllers');

const postRouter = Router();

// Post routes
postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostWithID);
postRouter.post('/', addAPost);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);

// Comment routes
postRouter.post('/:id/comments', addCommentToPost);
postRouter.get('/:id/comments', getCommentsForPost);

module.exports = postRouter;
