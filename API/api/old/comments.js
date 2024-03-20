import express from 'express';
const router = express.Router();

import { Comment } from '../models/Comment.js';
import { Like } from '../models/Like.js';
import { User } from '../../models/User.js';

import { getAuthUsers } from '../../utils/authUsers.js';
import { generateResponse } from '../../utils/responce.js';
import { errorHandler } from '../../utils/errorHandler.js';
import { getUserFromRequest } from '../../utils/tokenUtils.js';

import { checkForMissedFields, checkForBannedFields, checkForForeignFields } from '../../utils/checks.js';


router.get('/:comment_id', errorHandler(async (req, res) => {
    const commentId = req.params.comment_id;
    const comment = await Comment.findByPk(commentId);

    if (!comment) throw 'Comment not found';

    return res.status(200).json(generateResponse('Comment found', 
    { data: { 
        id: comment.id,
        score: comment.score,
        content: comment.content,
        publish_date: comment.createdAt,
        author_id: comment.author_id
    } 
    }));
}));

router.get('/:comment_id/like', errorHandler(async (req, res) => {
    const commentId = req.params.comment_id;
    const comment = await Comment.findByPk(commentId);

    if (!comment) throw 'Comment not found';

    const likes = await Like.findAll({
        where: {
            entity_id: commentId,
            target: 'comment'
        }
    });
    
    if (!likes || likes.length == 0) throw 'Likes not found';

    return res.status(200).json(generateResponse('Likes successfully founded', {
        data: {
            Likes: likes.map(like => ({ post_id: like.entity_id, type: like.type, author_id: like.author_id }))
        }
    }));
}));

router.post('/:comment_id/like', errorHandler(async (req, res) => {
    const userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[userId]);
    const commentId = req.params.comment_id;
    const comment = await Comment.findByPk(commentId);

    if (!comment) throw 'Comment not found';
    const subject = await User.findByPk(comment.author_id);

    const like_ = await Like.findOne({
        where: {
            entity_id: commentId,
            author_id: users[userId],
            target: 'comment'
        }
    });
    let value = req.body.type == "like" ? +1 : -1;
    if (!like_) {
        let like = await Like.create({
            author_id: users[userId],
            entity_id: commentId,
            type: req.body.type,
            target: 'comment'
        });

        comment.update({
            score: comment.score + value
        });

        subject.update({
            rating: subject.rating + value
        });

        return res.status(200).json(generateResponse('Like successfully placed', {
            data: {
              new_number: comment.score
            }
          }));
    }
    if (like_.type != req.body.type) {
        like_.update({
            type: req.body.type
        });

        comment.update({
            score: comment.score + value * 2
        });

        subject.update({
            rating: subject.rating + value * 2
        });

        return res.status(200).json(generateResponse('Like successfully placed', {
            data: {
              new_number: comment.score
            }
          }));
    }

    like_.destroy();
    comment.update({
        score: comment.score - value
    });

    subject.update({
        rating: subject.rating - value
    });
    return res.status(200).json(generateResponse('Nothing changed', {
        data: {
          new_number: comment.score
        }
      }));
}));


router.delete('/:comment_id/like', errorHandler(async (req, res) => {
    const userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[userId]);
  
    const commentId = req.params.comment_id;
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw 'Post not found';
  
    const like = await Like.findOne({
        where: {
            author_id: users[userId],
            entity_id: commentId,
            target: 'comment'
        }
    });
  
    if (!like) throw 'Like not found';
    let value = like.type === "like" ? -1 : +1;
  
    comment.update({
        score: comment.score + value
    });
  
    cur_user.update({
        rating: cur_user.rating + value
    });
  
    like.destroy();
    return res.status(200).json(generateResponse('Like successfully destroyed'));
  }));

router.delete('/:comment_id', errorHandler(async (req, res) => {
    const userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[userId]);

    const commentId = req.params.comment_id;
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw 'Comment not found';
    if (cur_user.role != "Admin" && cur_user.id != comment.author_id) throw 'Permission denied';
    
    cur_user.update({
        rating: cur_user.rating - comment.score
    });

    const likes = Like.findAll({
        where: {
            entity_id: commentId,
            target: 'comment'
        }
    });

    for (const like of likes) {
        like.destroy();
    }

    comment.destroy();
    return res.status(200).json(generateResponse('Comment successfully destroyed'));
}));


router.patch('/:comment_id', errorHandler(async (req, res) => {
    const userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[userId]);

    const commentId = req.params.comment_id;
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw 'Comment not found';
    if (cur_user.role != "Admin" && cur_user.id != comment.author_id) throw 'Permission denied';
    
    await checkForBannedFields(["score", "author_id"], req.body);

    comment.update(req.body);
    return res.status(200).json(generateResponse('Comment updated successfully'));
}));

export default router;