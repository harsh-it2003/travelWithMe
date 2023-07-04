const Posts = require('../models/Post');
const mongoose = require('mongoose');
const Users = require('../models/User');


const getAllPosts = async (req, res) => {
    try {
        let posts = await Posts.find().populate("user");
        return res.status(200).json({ posts });
    } catch (err) {
        return console.log(err);
    }
}

const addAPost = async (req, res) => {

    try {
        const { title, description, image, location, date, user, comments} = req.body;

        if (!title || !description || !image || !location || !date || !user || title.trim().length === 0 || description.trim().length === 0 || image.trim().length === 0 || location.trim().length === 0 || date.trim().length === 0 || user.trim().length === 0) {
            return res.status(422).json({ message: "Invalid data" });
        }

        let existingUser = await Users.findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: "No such user found" });
        }

        let post = new Posts({ title, description, image, location, date, user, comments});

        const session = await mongoose.startSession();

        session.startTransaction();
        existingUser.posts.push(post);
        await existingUser.save({ session });
        post = await post.save({ session });
        session.commitTransaction();

        return res.status(200).json({ post });

    } catch (err) {
        console.log(err);
        return res.status(406).json({ message: "Unexpected error occured" });
    }
}

const getPostWithID = async (req, res) => {
    const _id = req.params.id;
    let post;
    try {
        post = await Posts.findById(_id);
    } catch (err) {
        return console.log(err);
    }

    if (!post) {
        return res.status(404).json({ message: "No post found" });
    }
    return res.status(200).json({ post });
}

const updatePost = async (req, res) => {
    const id = req.params.id;
    const { title, description, image, location, date } = req.body;

    if (!title || !description || !image || !location || !date || title.trim().length === 0 || description.trim().length === 0 || image.trim().length === 0 || location.trim().length === 0 || date.trim().length === 0) {
        return res.status(422).json({ message: "Invalid data" });
    }

    let post;
    try {
        post = await Posts.findByIdAndUpdate(id, { title, description, image, location, date });
        if (!post) {
            return res.status(500).json({ message: "Unable to update" });
        }
        return res.status(200).json({ message: "updataed succesfully" });
    } catch (err) {
        console.log(err);
        return res.status(406).json({ message: "Unexpected error occured" });
    }


}

const deletePost = async (req, res) => {
    try {
        let post;
        const id = req.params.id;

        const session = await mongoose.startSession();
        session.startTransaction();
        post = await Posts.findById(id).populate("user");
        let ind = post.user.posts.indexOf(id);
        post.user.posts = post.user.posts.slice(0, ind).concat(post.user.posts.slice(ind + 1));
        await post.user.save({ session });
        post = await Posts.findByIdAndRemove(id);
        session.commitTransaction();

        return res.status(200).json({ message: "deleted succesfully" });

    } catch (err) {
        console.log(err);
        return res.status(406).json({ message: "couldn't delete the post" });
    }

}


const addCommentToPost = async (req, res) => {
    const postId = req.params.id;
    const {comment} = req.body;
  
    if (!postId || !comment || postId.trim().length === 0) {
      return res.status(422).json({ message: "Invalid data" });
    }

    try {
      const post = await Posts.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "No post found" });
      }

      const user = await Users.findById(comment.user);
      const username=user.name;
      comment.user=username;
      
      post.comments.push(comment);
      await post.save();
      return res.status(200).json({comment});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unexpected error occurred" });
    }
  };
  

const getCommentsForPost = async (req, res) => {
    const postId = req.params.id;

    if (!postId || postId.trim().length === 0) {
        return res.status(422).json({ message: "Invalid data" });
    }

    try {
        const post = await Posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "No post found" });
        }

        const comments = post.comments;
        return res.status(200).json({ comments });
    } catch (err) {
        console.log(err);
        return res.status(406).json({ message: "Unexpected error occurred" });
    }
}


module.exports = {
    getAllPosts,
    addAPost,
    getPostWithID,
    updatePost,
    deletePost,
    addCommentToPost,
    getCommentsForPost,
};