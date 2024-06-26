import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Category = sequelize.define('Category', {
    startTime: {
        type: DataTypes.TIME,
        defaultValue: null
    },
    duration: {
        type: DataTypes.TIME,
        defaultValue: null
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    event_category: {
        type: DataTypes.ENUM('arrangement', 'reminder', 'task', 'holiday', 'other'),
        allowNull: false
    },
    repeat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export { Category };