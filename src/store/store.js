const saveUserToLocalStorage = (user) => {
    const userString = JSON.stringify(user);
    localStorage.setItem('user', userString);
  };
  
const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem('user');
    return JSON.parse(userString);
};


const login = (user) => {
    saveUserToLocalStorage(user);
}

const logout = () => {
    saveUserToLocalStorage(null)
}

export {login, logout, getUserFromLocalStorage};