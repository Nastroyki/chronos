import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Event = sequelize.define('Event', {
    day: {
        type: DataTypes.DATE,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export { Event };