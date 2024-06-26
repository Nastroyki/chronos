import { User }          from '../models/User.js';
import { Event }         from '../models/Event.js';
import { Calendar }      from '../models/Calendar.js';
import { Category }      from '../models/Category.js';
import { User_Calendar } from '../models/User_Calendar.js';

export function defineAssociations() {
  // for User
  User.hasMany(Calendar, { foreignKey: 'author_id', onDelete: 'CASCADE'});
  User.belongsToMany(Calendar, { through: User_Calendar, foreignKey: 'user_id' });

  // for Calendar
  Calendar.belongsTo(User, { foreignKey: 'author_id' });
  Calendar.belongsToMany(User, { through: User_Calendar, foreignKey: 'calendar_id' });
  Calendar.hasMany(Event, { foreignKey: 'calendar_id', onDelete: 'CASCADE' });

  // for Event
  Event.belongsTo(Calendar, { foreignKey: 'calendar_id' });
  Event.hasOne(Category, { foreignKey: 'event_id', onDelete: 'CASCADE' });

  // for Category
  Category.belongsTo(Event, { foreignKey: 'event_id' });
}