let auth_users = new Object();


const getAuthUsers = () => {
    return auth_users;
};

const addToAuthUsers = (user) => {
    auth_users[user.code] = user.id;
};

const deleteAuthUser = (userId) => {
    if (auth_users[userId] !== undefined) {
        delete auth_users[userId];
    }
};

export {getAuthUsers, addToAuthUsers, deleteAuthUser};