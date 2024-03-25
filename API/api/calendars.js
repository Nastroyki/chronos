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
import { Op } from 'sequelize';

router.get('/', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);

    const calendars = await cur_user.getCalendars();

    return res.status(200).json(generateResponse('Calendars data', {
        data: {
            calendars: calendars.map(calendar => ({
                id: calendar.id,
                name: calendar.name,
                public: calendar.public
            }))
        }
    }));
}));

router.post('/', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);

    await checkForBannedFields(["author"], req.body)
    await checkForMissedFields(["name", "public"], req.body);

    const newCalendar = await Calendar.create({
		author_id: cur_user.id,
		name: req.body.name,
        public: req.body.public
	});

	await User_Calendar.create({
		user_id: cur_user.id,
		calendar_id: newCalendar.id,
		access: 'write'
	});

    return res.status(200).json(generateResponse('Calendar created successfully!'));
}));

const getDateSliceByType = (curDay, type) => {
    let startDate;
    let endDate;
    const currentDay = new Date(curDay);

    if (type == 'month') {
        const currentMonth = currentDay.getMonth();
        const currentYear = currentDay.getFullYear();

        startDate = new Date(Date.UTC(currentYear, currentMonth, 1));
        endDate = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
    }
    else if (type == 'week') {
        const firstDayOfWeek = 1; // Понедельник
        const dayOfWeek = currentDay.getDay();
        const diff = firstDayOfWeek - dayOfWeek;
        
        startDate = new Date(currentDay);
        startDate.setDate(startDate.getDate() + diff);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
    }
    else {
        throw 'Invalid type';
    }

    return {
        startDate,
        endDate
    }
}

router.get('/:calendar_id', errorHandler(async (req, res) => {
    const calendarId = req.params.calendar_id
    const calendar = await Calendar.findByPk(calendarId);
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
    
    await checkForMissedFields(["day", "type"], req.body);
    const dateSlice = getDateSliceByType(req.body.day, req.body.type);

    console.log(dateSlice);

    const events_data = await Event.findAll({
        where: {
            calendar_id: calendar.id,
            day: {
                [Op.between]: [dateSlice.startDate, dateSlice.endDate]
            },
        }
    });

    return res.status(200).json(generateResponse('Event data', {
        data: {
            Events: events_data.map(event => ({ id: event.id, name: event.name, day: (new Date(event.day).getDate())}))
        }
    }));
}));



router.post('/:calendar_id', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const calendarId = req.params.calendar_id

    const calendar = await Calendar.findByPk(calendarId);
    if (!calendar) throw 'Calendar not found';

    const user_access = await User_Calendar.findOne({
        where: {
            user_id: cur_user.id,
            calendar_id: calendar.id
        }
    });

    if (user_access.access !== "write") throw 'Permition denied';
    await checkForMissedFields(["name", "day", "description", "startTime", "duration", "event_category"], req.body);

    const new_event = await Event.create({
        calendar_id: calendarId,
        day: req.body.day,
        name: req.body.name
    });

    await Category.create({
        event_id: new_event.id,
        startTime: req.body.startTime,
        duration: req.body.duration,
        description: req.body.description,
        event_category: req.body.event_category
    });

    return res.status(200).json(generateResponse('Event created successfully!'));
}));


router.patch('/:calendar_id', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const calendarId = req.params.calendar_id

    const calendar = await Calendar.findByPk(calendarId);
    if (!calendar) throw 'Calendar not found';

    const user_access = await User_Calendar.findOne({
        where: {
            user_id: cur_user.id,
            calendar_id: calendar.id
        }
    });

    if (user_access.access !== "write") throw 'Permition denied';

    await checkForBannedFields(["author"], req.body);
    await checkForForeignFields(calendar.toJSON(), req.body);

    await calendar.update(req.body);

    return res.status(200).json(generateResponse('Calendar updated successfully!'));
}));



router.delete('/:calendar_id', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const calendarId = req.params.calendar_id

    const calendar = await Calendar.findByPk(calendarId);
    if (!calendar) throw 'Calendar not found';

    if (calendar.author_id !== cur_user.id) throw 'Permition denied';

    calendar.destroy();

    return res.status(200).json(generateResponse('Calendar deleted successfully!'));
}));


router.get('/:calendar_id/users', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const calendarId = req.params.calendar_id

    const calendar = await Calendar.findByPk(calendarId);
    if (!calendar) throw 'Calendar not found';

    const calendar_users = await calendar.getUsers();

    const userInCalendarUsers = calendar_users.find(u => u.id === cur_user.id);
    // только для write
    if (!userInCalendarUsers) throw 'Permition denied';

    const users_access = await User_Calendar.findAll({
        where: {
            calendar_id: calendar.id
        }
    });

    const usersWithAccess = calendar_users.map(user => {
        const userAccess = users_access.find(item => item.user_id === user.id);
    
        return {
            id: user.id,
            login: user.login,
            access: userAccess.access
        };
    });

    return res.status(200).json(generateResponse('Calendar users info:', {
        data: {
            users: usersWithAccess
        }
    }));
}));


router.post('/:calendar_id/users', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const calendarId = req.params.calendar_id

    const calendar = await Calendar.findByPk(calendarId);
    if (!calendar) throw 'Calendar not found';

    const user_access = await User_Calendar.findOne({
        where: {
            user_id: cur_user.id,
            calendar_id: calendar.id
        }
    });
    
    if (user_access.access !== "write" || cur_user.id == req.body.user_id) throw 'Permition denied';
    await checkForMissedFields(["user_id", "access"], req.body);

    const target_user = await User.findByPk(req.body.user_id);

    if (!target_user) throw 'User not found';

	await User_Calendar.create({
		user_id: target_user.id,
		calendar_id:  calendar.id,
		access: req.body.access
	});

    return res.status(200).json(generateResponse('Calendar users access updated successfully!'));
}));


router.patch('/:calendar_id/users', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const calendarId = req.params.calendar_id

    const calendar = await Calendar.findByPk(calendarId);
    if (!calendar) throw 'Calendar not found';

    const user_access = await User_Calendar.findOne({
        where: {
            user_id: cur_user.id,
            calendar_id: calendar.id
        }
    });
    
    if (user_access.access !== "write" || cur_user.id == req.body.user_id) throw 'Permition denied';
    await checkForMissedFields(["user_id", "access"], req.body);

    const target_user = await User_Calendar.findOne({
        where: {
            user_id: req.body.user_id,
            calendar_id: calendar.id
        }
    });

    if (!target_user) throw 'User not found';
    await target_user.update({ access: req.body.access });

    return res.status(200).json(generateResponse('Calendar users access updated successfully!'));
}));


router.delete('/:calendar_id/users', errorHandler(async (req, res) => {
    const cur_userId = await getUserFromRequest(req);
    const users = getAuthUsers();
    const cur_user = await User.findByPk(users[cur_userId]);
    const calendarId = req.params.calendar_id

    const calendar = await Calendar.findByPk(calendarId);
    if (!calendar) throw 'Calendar not found';

    const user_access = await User_Calendar.findOne({
        where: {
            user_id: cur_user.id,
            calendar_id: calendar.id
        }
    });
    
    await checkForMissedFields(["user_id"], req.body);
    if ((cur_user.id != req.body.user_id && user_access.access !== "write") 
        || (calendar.author_id == cur_user.id && cur_user.id == req.body.user_id)) 
        throw 'Permition denied';

    const target_user = await User_Calendar.findOne({
        where: {
            user_id: req.body.user_id,
            calendar_id: calendar.id
        }
    });

    if (!target_user) throw 'User not found';
    await target_user.destroy();

    return res.status(200).json(generateResponse('Calendar users access updated successfully!'));
}));


export default router;