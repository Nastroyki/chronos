import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class PostsService {
    static async getUserById(id) {
        const response = await axios.get(`http://localhost:3001/api/users/${id}`, {});
        return response;
    }
}