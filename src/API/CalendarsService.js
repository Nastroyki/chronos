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
            const user = getUserFromLocalStorage();
            let response;
            if (user) {
                response = await axios.get(`http://localhost:3001/api/calendars/${id}`, {
                    params: {
                        day: day,
                        type: type
                    },
                    headers: {
                        'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                    }
                });
            }
            else {
                response = await axios.get(`http://localhost:3001/api/calendars/${id}`, {
                    params: {
                        day: day,
                        type: type
                    }
                });
            }
            const calendar = response.data.data;
            return calendar;
        }
        catch (error) {
            console.log(error.response.data);
            return error.response.data;
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

    // static async updateCalendar(id, data) {
    //     try {
    //         const response = await axios.patch(`http://localhost:3001/api/calendars/${id}`, data, {
    //             headers: {
    //                 'Authorization': `Bearer ${getUserFromLocalStorage().token}`
    //             }
    //         });
    //         const calendar = response.data.data;
    //         return calendar;
    //     }
    //     catch (error) {
    //         return [];
    //     }
    // }

    static async updateCalendar(id, data) {
        try {
            console.log(id);
            const response = await axios.patch(`http://localhost:3001/api/calendars/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const calendar = response.data.data;
            return calendar;
        }
        catch (error) {
            console.error('Error updating calendar:', error);
            return null;
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
