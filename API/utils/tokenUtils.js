import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { addToAuthUsers, getAuthUsers } from './authUsers.js';

// const secretKey = crypto.randomBytes(32).toString('hex');
const secretKey = 'caf6dc3d3ca9f8ddfb677032d6c600509332d20aad5d42a46e61a88199be1a54';

const createToken = (existingUser) => {
	let code = crypto.randomBytes(16).toString('hex');
	addToAuthUsers({code: code, id: existingUser.id});
	const token = jwt.sign({ user_id: code, id: existingUser.id, username: existingUser.username, role: existingUser.role, rating: existingUser.rating}, secretKey, { expiresIn: '1d' });
	return token;
}

const getTokenFromRequest = (req) => {
    const data = req.get("Authorization");
    if (data !== undefined) return data.split(' ')[1];
    return null;
};

const getUserFromRequest = (req) => {
    return new Promise((resolve, reject) => {
        const token = getTokenFromRequest(req);

        if (!token) reject('No token provided');

        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) reject('Token is obsolete');
            else {
                const users = getAuthUsers();
                const id = users[decoded.user_id];
                if (id !== undefined) resolve(decoded.user_id);
                else reject('You are not authorized');
            }
        });
    });
};

export { createToken, getTokenFromRequest, getUserFromRequest };