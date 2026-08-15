const Post = require('../models/Post');

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

exports.createPost = async (req, res, next) => {
  try {
    const { title, slug, content, tags, published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }
    const post = await Post.create({
      title,
      slug: slug || slugify(title),
      content,
      tags,
      published,
      author: req.userId,
    });
    res.status(201).json(post);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Slug already exists' });
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const { tag, published } = req.query;
    const filter = {};
    if (tag) filter.tags = tag;
    if (published !== undefined) filter.published = published === 'true';
    const posts = await Post.find(filter).populate('author', 'username').sort('-createdAt');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title, slug, content, tags, published } = req.body;
    Object.assign(post, {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(content !== undefined && { content }),
      ...(tags !== undefined && { tags }),
      ...(published !== undefined && { published }),
    });
    await post.save();
    res.json(post);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Slug already exists' });
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};
