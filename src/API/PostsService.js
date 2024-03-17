import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class PostsService {
    static async getAllPosts() {
        try {
            const response = await axios.get("http://localhost:3001/api/posts/");
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }

    static async VoteMessage(id, type) {
        try {
            const response = await axios.post(`http://localhost:3001/api/comments/${id}/like`, 
            {
                type: type
            },
            {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }

    static async getCommentsByPostId(id) {
        try {
            const response = await axios.get(`http://localhost:3001/api/posts/${id}/comments`);
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }

    static async VotePost(id, type) {
        try {
            const response = await axios.post(`http://localhost:3001/api/posts/${id}/like`, 
            {
                type: type
            },
            {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }

    static async getPostById(id) {
        try {
            const response = await axios.get(`http://localhost:3001/api/posts/${id}`);
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }


    static async getAllPostsByAuthorId(id) {
        try {
            const response = await axios.get(`http://localhost:3001/api/posts/by_author/${id}`);
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }
}
