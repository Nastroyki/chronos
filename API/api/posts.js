import express from 'express';
const router = express.Router();

import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Like } from '../models/Like.js';
import { Comment } from '../models/Comment.js';
import { Category } from '../models/Category.js';

import { getAuthUsers } from '../utils/authUsers.js';
import { generateResponse } from '../utils/responce.js';
import { errorHandler } from '../utils/errorHandler.js';
import { getUserFromRequest } from '../utils/tokenUtils.js';
import { checkForMissedFields, checkForBannedFields, checkForForeignFields } from '../utils/checks.js';

router.get('/:post_id', errorHandler(async (req, res) => {
    console.log("asdasdasd");
    const postId = req.params.post_id;
    const post = await Post.findOne({
      where: {
        id: postId
      },
      include: [
        {
          model: User,
          attributes: ['username'] // Указываете те атрибуты, которые вы хотите получить
        }
      ]
    });

    if (!post) throw 'Post not found';

    return res.status(200).json(generateResponse('Post found', 
        { data: { 
          id: post.id, 
          status: post.status, 
          score: post.score,
          title: post.title,
          content: post.content,
          publish_date: post.createdAt,
          author_id: post.author_id,
          login: post.User ? post.User.username : null,
          } 
        }));
}));

router.patch('/:post_id', errorHandler(async (req, res) => {
  const userId = await getUserFromRequest(req);
  const users = getAuthUsers();
  const cur_user = await User.findByPk(users[userId]);

  if (cur_user.role != "Admin") throw 'Permission denied';

  const postId = req.params.post_id;
  const post = await Post.findByPk(postId);

  if (cur_user.id != post.author_id) throw 'Permission denied';

  await checkForBannedFields(["score", "status", "post_id", "author_id"], req.body)
  await checkForMissedFields(["title", "content", "categories"], req.body);

  const categories = await Category.findAll({ where: { title: req.body.categories } });
  const existingCategories = categories.map(category => category.title);
  const missingCategories = req.body.categories.filter(category => !existingCategories.includes(category));

  if (missingCategories.length > 0) {
      return res.status(400).json(generateResponse('Categories not found', 
      { type: "error",
        data: {
          Categories: missingCategories
        } 
      }));
  }

  const currentCategories = await post.getCategories();
  const newCategoryTitles = req.body.categories;

  const categoriesToRemove = currentCategories.filter(category => !newCategoryTitles.includes(category.title));
  const categoriesToAdd = newCategoryTitles.filter(title => !currentCategories.some(category => category.title === title));

  await post.removeCategories(categoriesToRemove);

  const newCategories = await Category.findAll({ where: { title: categoriesToAdd } });
  await post.addCategories(newCategories);

  post.update({title: req.body.title, content: req.body.content});

  return res.status(200).json(generateResponse('Post successfully modified'));
}));


router.delete('/:post_id', errorHandler(async (req, res) => {
  const userId = await getUserFromRequest(req);
  const users = getAuthUsers();
  const cur_user = await User.findByPk(users[userId]);
  const post = await Post.findByPk(req.params.post_id);

  if (cur_user.role != "Admin" && cur_user.id != post.author_id) throw 'Permission denied';
  if (!post) throw 'Post not found';

  cur_user.update({
    rating: cur_user.rating - post.score
  });

  const likes = Like.findAll({
    where: {
        entity_id: req.params.post_id,
        target: 'post'
    }
});

for (const like of likes) {
    like.destroy();
}

  post.destroy();
  res.status(200).json(generateResponse('Post successfully destroyed'));
}));


router.get('/', errorHandler(async (req, res) => {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'] // Указываете те атрибуты, которые вы хотите получить
        }
      ]
    });
    if (!posts) throw "No posts"

    return res.status(200).json(generateResponse('Posts successfully founded', {
      data: {
          Posts: posts.map(post => ({ 
            id: post.id, 
            title: post.title, 
            score: post.score,
            author_id: post.author_id,
            login: post.User ? post.User.username : null
          }
          ))
      }
    }));
}));

router.get('/by_author/:author_id', errorHandler(async (req, res) => {
  const author_id = req.params.author_id
  const posts = await Post.findAll({
    where: {
      author_id: author_id
    },
    include: [
      {
        model: User,
        attributes: ['username'] // Указываете те атрибуты, которые вы хотите получить
      }
    ]
  });
  if (!posts) throw "No posts"

  return res.status(200).json(generateResponse('Posts successfully founded', {
    data: {
        Posts: posts.map(post => ({ 
          id: post.id, 
          title: post.title, 
          score: post.score,
          author_id: post.author_id,
          login: post.User ? post.User.username : null
        }
        ))
    }
  }));
}));


router.get('/:post_id/categories', errorHandler(async (req, res) => {
    const postId = req.params.post_id;
    const post = await Post.findByPk(postId);
    if (!post) throw 'Post not found';
    
    const categories = await post.getCategories();
    if (categories.length == 0) throw 'Categories not found';

    return res.status(200).json(generateResponse('Posts successfully founded', {
    data: {
        Categories: categories.map(category => ({ id: category.id, title: category.title}))
    }
    }));
}));


router.post('/', errorHandler(async (req, res) => {
    const userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[userId]);

    if (cur_user.role != "Admin") throw 'Permission denied';

    await checkForBannedFields(["score", "status", "post_id"], req.body)
    await checkForMissedFields(["title", "content", "categories"], req.body);

    if (!req.body.categories || req.body.categories.length === 0) {
        throw 'No categories provided';
    }

    const categories = await Category.findAll({ where: { title: req.body.categories } });
    const existingCategories = categories.map(category => category.title);
    const missingCategories = req.body.categories.filter(category => !existingCategories.includes(category));

    if (missingCategories.length > 0) {
        return res.status(400).json(generateResponse('Categories not found', 
        { type: "error",
          data: {
            Categories: missingCategories
          } 
        }));
    }

    let post = await Post.create({
        title: req.body.title,
        content: req.body.content,
        author_id: users[userId]
    });

    await post.addCategories(categories);

    return res.status(200).json(generateResponse('Post created successfully'));
}));


router.post('/:post_id/comments', errorHandler(async (req, res) => {
  const userId = await getUserFromRequest(req);
  const users = getAuthUsers();
  
  await checkForBannedFields(["score", "author_id"], req.body)

  const postId = req.params.post_id;
  const post = await Post.findByPk(postId);
  if (!post) throw 'Post not found';

  let comment = await Comment.create({
    content: req.body.content,
    author_id: users[userId],
    post_id: postId
  });

  return res.status(200).json(generateResponse('Comment created successfully'));
}));


router.get('/:post_id/comments', errorHandler(async (req, res) => {
  const postId = req.params.post_id;
  const post = await Post.findByPk(postId);
  if (!post) throw 'Post not found';

  const comments = await Comment.findAll({ 
    where: { post_id: postId },
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  });
  if (!comments || comments.length == 0) throw 'Comments not found';

  return res.status(200).json(generateResponse('Posts successfully founded', {
    data: {
      Comments: comments.map(comment => ({ id: comment.id, content: comment.content, score: comment.score, author_id: comment.author_id, author_name: comment.User.username, publish_date: comment.createdAt }))
    }
  }));
}));


router.post('/:post_id/like', errorHandler(async (req, res) => {
  const userId = await getUserFromRequest(req);
  const users = getAuthUsers();
  const cur_user = await User.findByPk(users[userId]);

  const postId = req.params.post_id;
  const post = await Post.findByPk(postId);
  if (!post) throw 'Post not found';
  const subject = await User.findByPk(post.author_id);

  const like_ = await Like.findOne({
    where: {
      author_id: users[userId],
      entity_id: postId,
      target: 'post'
    }
  });

  let value = req.body.type == "like" ? +1 : -1;

  if (!like_) {
    let like = await Like.create({
      author_id: users[userId],
      entity_id: postId,
      type: req.body.type,
      target: 'post'
    });

    post.update({
      score: post.score + value
    });

    subject.update({
      rating: subject.rating + value
    });

    return res.status(200).json(generateResponse('Like successfully placed', {
      data: {
        new_number: post.score
      }
    }));
  }

  if (like_.type != req.body.type) {
    like_.update({
      type: req.body.type
    });

    post.update({
      score: post.score + value * 2
    });

    subject.update({
      rating: subject.rating + value * 2
    });

    return res.status(200).json(generateResponse('Like successfully placed', {
      data: {
        new_number: post.score
      }
    }));
  }

  post.update({
    score: post.score - value
  });

  subject.update({
    rating: subject.rating - value
  });

  like_.destroy();
  res.status(200).json(generateResponse('Nothing changed', {
    data: {
      new_number: post.score
    }
  }));
}));

router.get('/:post_id/like', errorHandler(async (req, res) => {
  const postId = req.params.post_id;
  const post = await Post.findByPk(postId);
  if (!post) throw 'Post not found';

  const likes = await Like.findAll({
    where: {
      entity_id: postId,
      target: 'post'
    }
  });

  if (!likes || likes.length == 0) throw 'Likes not found';

  return res.status(200).json(generateResponse('Likes successfully founded', {
    data: {
      Likes: likes.map(like => ({ post_id: like.entity_id, type: like.type, author_id: like.author_id }))
    }
  }));
}));


router.delete('/:post_id/like', errorHandler(async (req, res) => {
  const userId = await getUserFromRequest(req);
  const users = getAuthUsers();
  const cur_user = await User.findByPk(users[userId]);

  const postId = req.params.post_id;
  const post = await Post.findByPk(postId);
  if (!post) throw 'Post not found';

  const like = await Like.findOne({
    where: {
      author_id: users[userId],
      entity_id: postId,
      target: 'post'
    }
  });

  if (!like) throw 'Like not found';
  let value = like.type == "like" ? -1 : +1;

  post.update({
    score: post.score + value
  });

  cur_user.update({
    rating: cur_user.rating + value
  });

  like.destroy();
  res.status(200).json(generateResponse('Like successfully destroyed'));
}));


//nodemailer

export default router;