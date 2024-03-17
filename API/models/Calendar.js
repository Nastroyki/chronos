import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Calendar = sequelize.define('Calendar', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export { Calendar };