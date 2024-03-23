import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { User } from '../models/User.js';
import { Calendar } from '../models/Calendar.js';
import { User_Calendar } from '../models/User_Calendar.js';

import schema from '../utils/passwordSchema.js';
import { deleteAuthUser } from '../utils/authUsers.js';
import { generateResponse } from '../utils/responce.js';
import { errorHandler } from '../utils/errorHandler.js';
import { checkForMissedFields } from '../utils/checks.js';
import { createToken, getUserFromRequest } from '../utils/tokenUtils.js';

router.post('/login', errorHandler(async (req, res) => {
	await checkForMissedFields(["login", "password"], req.body);
    const { login, password } = req.body;
    const existingUser = await User.findOne({ where: { login: login } });

    if (!existingUser) throw 'User does not exist';

	const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
	if (!isPasswordCorrect) throw 'Wrong password';
	
	return res.status(200).json(generateResponse('You have successfully logged in', { data: { token: createToken(existingUser) }}));
}));

router.post('/register', errorHandler(async (req, res) => {
	await checkForMissedFields(["login", "email", "password", "confirmPassword"], req.body);
	const { login, email, password, confirmPassword } = req.body;

	const existingUser = await User.findOne({ where: { [Op.or]: [ { login: login }, { email: email } ] } });
	if (existingUser) {
		if (existingUser.login === login) throw 'User with this username already exists';
		else throw 'User with this email already exists';
	}

	if (password !== confirmPassword) throw 'Password mismatch';
	if (!schema.validate(password)) {
		return res.status(400).json(generateResponse('Password too weak', { type: 'error', data: { errors: schema.validate(password, { list: true }) } }));
	}

    const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const newUser = await User.create({
		login: login,
		email,
		password: hashedPassword
	});

	const newCalendar = await Calendar.create({
		author_id: newUser.id,
		name: 'default'
	});

	await User_Calendar.create({
		user_id: newUser.id,
		calendar_id: newCalendar.id,
		access: 'write'
	});

	return res.status(201).json(generateResponse('You have successfully registered'));
}));

router.post('/logout', errorHandler(async (req, res) => {
	try {
		const userId = await getUserFromRequest(req);
		deleteAuthUser(userId);
	}
	catch (error) {
		return res.status(201).json(generateResponse('You are not logged in'));
	}
	return res.status(201).json(generateResponse('You logged out successfully'));
}));

export default router;