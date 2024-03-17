import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import { Op } from 'sequelize';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import schema from '../utils/passwordSchema.js';
import { getAuthUsers } from '../utils/authUsers.js';
import { errorHandler } from '../utils/errorHandler.js';
import { generateResponse } from '../utils/responce.js';
import { getUserFromRequest } from '../utils/tokenUtils.js';
import { checkForForeignFields, checkForBannedFields, checkForMissedFields } from '../utils/checks.js';

router.get('/', async (req, res) => {
    const users = await User.findAll();
    const simplifiedUsers = users.map(user => ({ id: user.id, username: user.username }));
    return res.status(200).json(generateResponse('Users data', {data: simplifiedUsers}));
});


router.post('/', errorHandler(async (req, res) => {
    const userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const user = await User.findByPk(users[userId]);

    if (user.role !== "Admin") throw 'Permission denied';
    
    await checkForBannedFields(["rating"], req.body)
    await checkForMissedFields(["login", "email", "password", "confirmPassword", "role"], req.body);
    const { login, email, password, confirmPassword, role } = req.body;
    const existingUser = await User.findOne({ where: { [Op.or]: [ { username: login }, { email: email } ] } });

    if (existingUser) {
        if (existingUser.username === login) throw 'User with this username already exists';
        else throw 'User with this email already exists';
    }

    if (password !== confirmPassword) throw 'Password mismatch';
    if (!schema.validate(password)) {
        return res.status(400).json(generateResponse('Password too weak', { type: 'error', data: { errors: schema.validate(password, { list: true }) } }));
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
        username: login,
        email,
        password: hashedPassword,
        role
    });

    return res.status(200).json(generateResponse("User created successfully"));
}));

router.get('/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    const user = await User.findByPk(userId);

    if (!user) return res.status(400).json(generateResponse('User not found', { type: 'error' }));

    return res.status(200).json(generateResponse('User found', { 
        data: { 
            id: user.id, 
            username: user.username, 
            mail: user.email,
            rating: user.rating,
            createdAt: user.createdAt,
            role: user.role
        } }));
});

router.get('/:user_id/:user_login.jpg', async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const imagePath = path.join(__dirname, '../storage/unnamed.jpg');
    res.sendFile(imagePath);
});

router.delete('/:user_id', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const userId = req.params.user_id;

    if (cur_user.role !== "Admin" && cur_user.id !== userId) throw 'Permission denied';
    
    const user = await User.findByPk(userId);

    if (!user) throw 'User not found';
    user.destroy();

    return res.status(200).json(generateResponse('User successfully deleted'));
}));

router.patch('/:user_id', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const userId = req.params.user_id;

    if (cur_user.role != "Admin" && cur_user.id != userId) throw 'Permission denied';
    
    const user = await User.findByPk(userId);

    if (!user) throw 'User not found';

    await checkForForeignFields(user.toJSON(), req.body);

    if (cur_user.role != "Admin") await checkForBannedFields(["role", "password", "rating"], req.body);
    else await checkForBannedFields(["rating"], req.body);

    await user.update(req.body);
    return res.status(200).json(generateResponse('User successfully modified'));
}));

export default router;