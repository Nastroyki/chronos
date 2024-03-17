import { User }     from '../models/User.js';
import { User_Calendar } from '../models/User_Calendar.js';
import { Calendar } from '../models/Calendar.js';
import { Event } from '../models/Event.js';
import { Category } from '../models/Category.js';

export function defineAssociations() {
  // for User
  User.belongsToMany(Calendar, { through: User_Calendar, foreignKey: 'user_id' });
  User.hasMany(Calendar, { foreignKey: 'user_id' });

  // for Calendar
  Calendar.belongsTo(User, { foreignKey: 'user_id' });
  Calendar.belongsToMany(User, { through: User_Calendar, foreignKey: 'calendar_id' });
  Calendar.hasMany(Event, { foreignKey: 'calendar_id' });

  // for Event
  Event.belongsTo(Calendar, { foreignKey: 'calendar_id' });
  Event.hasMany(Category, { foreignKey: 'event_id' });

  // for Category
  Category.belongsTo(Event, { foreignKey: 'event_id' });
}