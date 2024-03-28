import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const User_Calendar = sequelize.define('User_Calendar', {
    access: {
      type: DataTypes.ENUM('write', 'read'),
      defaultValue: 'read'
    }
});

export { User_Calendar };