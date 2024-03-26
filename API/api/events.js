import express from 'express';
const router = express.Router();
import { User } from '../models/User.js';
import { generateResponse } from '../utils/responce.js';
import { getUserFromRequest } from '../utils/tokenUtils.js';
import { getAuthUsers } from '../utils/authUsers.js';
import { errorHandler } from '../utils/errorHandler.js';
import { checkForForeignFields, checkForBannedFields, checkForMissedFields } from '../utils/checks.js';
import { Calendar } from '../models/Calendar.js';
import { User_Calendar } from '../models/User_Calendar.js';
import { Event } from '../models/Event.js';
import { Category } from '../models/Category.js';

router.delete('/:event_id', errorHandler(async (req, res) => {
    const eventId = req.params.event_id
    const event = await Event.findByPk(eventId);
    if (!event) throw 'Event not found';

    const calendar = await Calendar.findOne({
        where: {
            id: event.calendar_id
        }
    });
    if (!calendar) throw 'Calendar not found';
    
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);

    const user_access = await User_Calendar.findOne({
        where: {
            user_id: cur_user.id,
            calendar_id: calendar.id
        }
    });

    if (user_access.access !== 'write') throw 'Permition denied';
    
    await Category.destroy({
        where: {
            event_id: event.id
        }
    });
    await event.destroy();

    return res.status(200).json(generateResponse('Event deleted'));
}));

router.patch('/:event_id', errorHandler(async (req, res) => {
    const eventId = req.params.event_id
    const event = await Event.findByPk(eventId);
    if (!event) throw 'Event not found';

    const calendar = await Calendar.findOne({
        where: {
            id: event.calendar_id
        }
    });
    if (!calendar) throw 'Calendar not found';
    
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);

    const user_access = await User_Calendar.findOne({
        where: {
            user_id: cur_user.id,
            calendar_id: calendar.id
        }
    });

    if (user_access.access !== 'write') throw 'Permition denied';

    const category = await Category.findOne({
        where: {
            event_id: event.id
        }
    });

    await checkForMissedFields(["name", "day", "description", "startTime", "duration", "event_category"], req.body);
    await checkForBannedFields(["calendar_id", "event_id"], req.body);

    await event.update(req.body);
    await category.update(req.body);

    return res.status(200).json(generateResponse('Event data'));
}));

router.get('/:event_id', errorHandler(async (req, res) => {
    const eventId = req.params.event_id
    const event = await Event.findByPk(eventId, {
        include: Category
    });
    if (!event) throw 'Event not found';
    console.log(event);

    const calendar = await Calendar.findOne({
        where: {
            id: event.calendar_id
        }
    });
    if (!calendar) throw 'Calendar not found';
    
    if (!calendar.public) {
        const cur_userId = await getUserFromRequest(req);
        const users = getAuthUsers();
        const cur_user = await User.findByPk(users[cur_userId]);
    
        const user_access = await User_Calendar.findOne({
            where: {
                user_id: cur_user.id,
                calendar_id: calendar.id
            }
        });
    
        if (!user_access) throw 'Permition denied';
    }

    return res.status(200).json(generateResponse('Event data:', {
        data: {
            id: event.id,
            name: event.name,
            day: event.day,
            startTime: event.Category.startTime,
            duration: event.Category.duration,
            description: event.description,
            eventCategory: event.Category.event_category
        }
    }));
}));

export default router;