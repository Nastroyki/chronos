import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class EventsService {
    static async getEvent(id) {
        try {
            const response = await axios.get(`http://localhost:3001/api/events/${id}`, {
                headers: {'Authorization': `Bearer ${getUserFromLocalStorage().token}`}
            });
            const event = response.data.data;
            return event;
        }
        catch (error) {
            return [];
        }
    }

    static async updateEvent(id, data) {
        try {
            const response = await axios.patch(`http://localhost:3001/api/events/${id}`, data, {
                headers: {'Authorization': `Bearer ${getUserFromLocalStorage().token}`}
            });
            const event = response.data.data;
            return event;
        }
        catch (error) {
            return [];
        }
    }

    static async deleteEvent(id) {
        try {
            const response = await axios.delete(`http://localhost:3001/api/events/${id}`, {
                headers: {'Authorization': `Bearer ${getUserFromLocalStorage().token}`}
            });
            const event = response.data.data;
            return event;
        }
        catch (error) {
            return [];
        }
    }

    static async createEvent(calendarid, data) {
        try {
            const response = await axios.post(`http://localhost:3001/api/calendars/${calendarid}`, data, {
                headers: {'Authorization': `Bearer ${getUserFromLocalStorage().token}`}
            });
            const event = response.data.data;
            return event;
        }
        catch (error) {
            console.log(error.response);
            return [];
        }
    }
}

