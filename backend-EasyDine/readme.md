BackEnd:
Các package cần cài đặt:
npm install nodemon express sequelize mysql2 dotenv bcrypt jsonwebtoken rand-token

chạy server:
npm run dev

sql: cài đặt tài khoản, mật khẩu trong file .env

MySQL:
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    avatar varchar(255),
    bio TEXT,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255)
);

<!-- create table user(
    id int primary key auto_increment,
    role enum("CUSTOMER", "ADMIN") not null,
    name varchar(255) not null,
    gmail varchar(255) unique not null,
    address varchar(255),
    avatar varchar(255),
    bio text,
    phone varchar(15), 
    password varchar(255) not null
); -->