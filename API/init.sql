CREATE DATABASE IF NOT EXISTS chronos;
-- CREATE USER 'scheban'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON chronos.* TO 'scheban'@'localhost';
FLUSH PRIVILEGES;