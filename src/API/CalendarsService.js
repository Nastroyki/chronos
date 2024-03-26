import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class CalendarsService {
    static async getAllCalendars() {
        try {
            const response = await axios.get("http://localhost:3001/api/calendars/", {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const calendars = response.data.data;
            return calendars;
        }
        catch (error) {
            return [];
        }
    }

    static async getcalendarData(id, day, type) {
        try {
            const response = await axios.get(`http://localhost:3001/api/calendars/${id}`, {
                params: {
                    day: day,
                    type: type
                },
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const calendar = response.data.data;
            return calendar;
        }
        catch (error) {
            return [];
        }
    }

    // static async getCalendarById(id) {
    //     try {
    //         const response = await axios.get(`http://localhost:3001/api/calendars/${id}`);
    //         const calendar = response.data.data;
    //         return calendar;
    //     }
    //     catch (error) {
    //         return [];
    //     }
    // }

    static async createCalendar(name, public_) {
        const response = await axios.post("http://localhost:3001/api/calendars/", {
            name: name,
            public: public_
        }, {
            headers: {
                'Authorization': `Bearer ${getUserFromLocalStorage().token}`
            }
        });
        return response;
    }

    static async updateCalendar(id, data) {
        try {
            const response = await axios.post(`http://localhost:3001/api/calendars/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const calendar = response.data.data;
            return calendar;
        }
        catch (error) {
            return [];
        }
    }

    static async deleteCalendar(id) {
        try {
            const response = await axios.delete(`http://localhost:3001/api/calendars/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const calendar = response.data.data;
            return calendar;
        }
        catch (error) {
            return [];
        }
    }
}

// export default class PostsService {
//     static async getAllPosts() {
//         try {
//             const response = await axios.get("http://localhost:3001/api/posts/");
//             const posts = response.data.data;
//             return posts;
//         }
//         catch (error) {
//             return [];
//         }
//     }

//     static async VoteMessage(id, type) {
//         try {
//             const response = await axios.post(`http://localhost:3001/api/comments/${id}/like`,
//             {
//                 type: type
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${getUserFromLocalStorage().token}`
//                 }
//             });
//             const posts = response.data.data;
//             return posts;
//         }
//         catch (error) {
//             return [];
//         }
//     }

//     static async getCommentsByPostId(id) {
//         try {
//             const response = await axios.get(`http://localhost:3001/api/posts/${id}/comments`);
//             const posts = response.data.data;
//             return posts;
//         }
//         catch (error) {
//             return [];
//         }
//     }

//     static async VotePost(id, type) {
//         try {
//             const response = await axios.post(`http://localhost:3001/api/posts/${id}/like`,
//             {
//                 type: type
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${getUserFromLocalStorage().token}`
//                 }
//             });
//             const posts = response.data.data;
//             return posts;
//         }
//         catch (error) {
//             return [];
//         }
//     }

//     static async getPostById(id) {
//         try {
//             const response = await axios.get(`http://localhost:3001/api/posts/${id}`);
//             const posts = response.data.data;
//             return posts;
//         }
//         catch (error) {
//             return [];
//         }
//     }


//     static async getAllPostsByAuthorId(id) {
//         try {
//             const response = await axios.get(`http://localhost:3001/api/posts/by_author/${id}`);
//             const posts = response.data.data;
//             return posts;
//         }
//         catch (error) {
//             return [];
//         }
//     }
// }
