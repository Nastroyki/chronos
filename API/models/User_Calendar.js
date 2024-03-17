import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const User_Calendar = sequelize.define('User_Calendar', {
    access: {
      type: DataTypes.ENUM('write', 'read'),
      allowNull: false
    },
    hide: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
});

export { User_Calendar };