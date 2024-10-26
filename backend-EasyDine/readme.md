BackEnd:

install express: npm install express
install mysql2: npm install mysql2
install dotenv: npm install dotenv --save
install nodemon: npm install nodemon

vào : http://localhost:3000/test-connection
để thấy kết quả test connect:
{
"message": "Database connection successful!",
"solution": 2
}

database:
CREATE DATABASE restaurant_db;
USE restaurant_db;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
phone_number VARCHAR(20) NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN role ENUM('customer', 'admin', 'guest') DEFAULT 'customer';

Thêm admin:

INSERT INTO users (name, email, phone_number, password, role)
VALUES ('Admin User', 'admin@example.com', '0123456789', 'hashed_password', 'admin');
