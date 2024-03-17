import express from 'express';
const router = express.Router();
import { Op } from 'sequelize';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Post } from '../models/Post.js';

import { getAuthUsers } from '../utils/authUsers.js';
import { getUserFromRequest } from '../utils/tokenUtils.js';
import { generateResponse } from '../utils/responce.js';
import { errorHandler } from '../utils/errorHandler.js';
import { checkForMissedFields, checkForBannedFields, checkForForeignFields } from '../utils/checks.js';

router.get('/', async (req, res) => {
    const categories = await Category.findAll();
    const simplifiedcategories = categories.map(category => ({ id: category.id, title: category.title }));
    return res.status(200).json(generateResponse('Categories data', {data: simplifiedcategories}));
});

router.get('/:categoty_id', async (req, res) => {
    const category = await Category.findOne({ where: { id: req.params.categoty_id } });

    if (!category) throw 'Category not found';

    return res.status(200).json(generateResponse(`Category '${category.title}' data:`, { data: { id: category.id, title: category.title, description: category.description } }));
});

router.get('/:categoty_id/posts', async (req, res) => {
    const category = await Category.findOne({ where: { id: req.params.categoty_id } });
    if (!category) throw 'Category not found';
    
    const posts = await category.getPosts();
    if (posts.length == 0) throw 'Posts not found';

    return res.status(200).json(generateResponse('Posts successfully founded', {
        data: {
            Posts: posts.map(post => ({ id: post.id, title: post.title, score: post.score }))
        }
    }));
});

router.post('/', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);

    if (cur_user.role != "Admin") throw 'Permission denied';

    await checkForMissedFields(["title", "description"], req.body);
    const {title, description} = req.body;

    const categories = await Category.findOne({ where: { title: title } });

    if (categories) throw 'This category already exist';

    await Category.create({
        title: title,
        description: description
    });

    return res.status(200).json(generateResponse(`Category '${title}' created successfully`));
}));

router.patch('/:categoty_id', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);

    if (cur_user.role != "Admin") throw 'Permission denied';

    const category = await Category.findOne({ where: { id: req.params.categoty_id } });
    console.log(category);
    
    if (!category) throw 'Category not found';

    await checkForForeignFields(category.toJSON(), req.body);
    await checkForBannedFields([], req.body);

    category.update(req.body);
    return res.status(200).json(generateResponse('Category successfully modified'));
}));

router.delete('/:categoty_id', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);

    if (cur_user.role != "Admin") throw 'Permission denied';

    const category = await Category.findOne({ where: { id: req.params.categoty_id } });
    if (!category) throw 'Category not found';
    category.destroy();

    return res.status(200).json(generateResponse('Category successfully deleted'));
}));

export default router;