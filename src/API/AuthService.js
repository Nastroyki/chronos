import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class AuthService {
    static async login(login, password) {
        const response = await axios.post("http://localhost:3001/api/auth/login", {
            login: login,
            password: password,
        });
        return response;
    }

    static async logout() {
        const response = await axios.post("http://localhost:3001/api/auth/logout", {} ,{
            headers: {
                'Authorization': `Bearer ${getUserFromLocalStorage().token}`
            }
        });
        console.log(response);
        return response;
    }

    static async register(login, password, email) {
        const response = await axios.post("http://localhost:3001/api/auth/register", {
            login: login,
            password: password,
            email: email,
            confirmPassword: password,
        });
        return response;
    }
}