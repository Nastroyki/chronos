import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Category = sequelize.define('Category', {
    time: {
        type: DataTypes.TIME,
        defaultValue: null
    },
    length: {
        type: DataTypes.TIME,
        defaultValue: null
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    event_category: {
        type: DataTypes.ENUM('work', 'hobby', 'family', 'other'),
        allowNull: false
    }
});

export { Category };