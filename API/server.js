import express          from 'express';
import sequelize        from './utils/db.js';
import authRoutes       from './api/auth.js';
import usersRoutes      from './api/users.js';
import PostsRoutes      from './api/posts.js';
import CommentsRoutes   from './api/comments.js';
import categoriesRoutes from './api/categories.js';

import { defineAssociations } from './utils/associations.js';

import cors from 'cors'

import { User } from './models/User.js';
import { getAuthUsers, addToAuthUsers } from './utils/authUsers.js';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/posts', PostsRoutes);
app.use('/api/comments', CommentsRoutes);

// import bcrypt from 'bcrypt';
// const saltRounds = 10;
// const hashedPassword = await bcrypt.hash("admin", saltRounds);
// await User.create({
// 	username: "admin",
// 	email: "test@gmail.com",
// 	password: hashedPassword,
// 	role: "Admin"
// });

app.get('/api/users1', async (req, res) => {
	try {
		const users = await User.findAll();

		return res.status(200).json([users, getAuthUsers()]);
	} catch (error) {
		console.error('Ошибка при получении списка пользователей:', error);
		return res.status(500).json({ error: 'Ошибка сервера' });
	}
});

defineAssociations();

sequelize.sync().then(() => {
	app.listen(PORT, () => {
		console.log(`Сервер запущен на порту ${PORT}`);
	});
});


// { force: true }