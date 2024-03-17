import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('chronos', 'scheban', 'securepass', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение с базой данных установлено успешно!');
  })
  .catch((err) => {
    console.error('Ошибка подключения к базе данных:', err);
  });

export default sequelize;