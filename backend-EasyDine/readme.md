BackEnd:

install express: npm install express
install mysql2: npm install mysql2
install dotenv: npm install dotenv --save
install nodemon: npm install nodemon
npm install express sequelize mysql2 dotenv bcrypt

vào : http://localhost:3000/test-connection
để thấy kết quả test connect:
{
"message": "Database connection successful!",
"solution": 2
}

CREATE TABLE User (
id INT AUTO_INCREMENT PRIMARY KEY,
role ENUM('customer', 'admin') NOT NULL,
name VARCHAR(255) NOT NULL,
address VARCHAR(255),
bio TEXT,
email VARCHAR(255) UNIQUE,
phone VARCHAR(20) UNIQUE,
username VARCHAR(50) UNIQUE,
password VARCHAR(255) NOT NULL,
token VARCHAR(255)
);

-- Tạo bảng Evaluate
CREATE TABLE Evaluate (
id INT AUTO_INCREMENT PRIMARY KEY,
star INT CHECK (star BETWEEN 1 AND 5),
comment TEXT
);

-- Tạo bảng Reservation
CREATE TABLE Reservation (
id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT,
reservation_time DATETIME,
status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
evaluate_ID INT,
FOREIGN KEY (customer_id) REFERENCES User(id),
FOREIGN KEY (evaluate_ID) REFERENCES Evaluate(id)
);

-- Tạo bảng RestaurantTable
CREATE TABLE RestaurantTable (
id INT AUTO_INCREMENT PRIMARY KEY,
capacity INT NOT NULL,
status ENUM('available', 'occupied') DEFAULT 'available'
);

-- Tạo bảng Table_order
CREATE TABLE Table_order (
id INT AUTO_INCREMENT PRIMARY KEY,
reservation_id INT,
table_id INT,
FOREIGN KEY (reservation_id) REFERENCES Reservation(id),
FOREIGN KEY (table_id) REFERENCES RestaurantTable(id)
);

-- Tạo bảng Payment
CREATE TABLE Payment (
id INT AUTO_INCREMENT PRIMARY KEY,
amount DECIMAL(10, 2) NOT NULL,
date DATE,
method ENUM('cash', 'credit_card', 'paypal', 'other') NOT NULL
);

-- Tạo bảng Ship
CREATE TABLE Ship (
id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT,
status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
payment_id INT,
evaluate_ID INT,
FOREIGN KEY (customer_id) REFERENCES User(id),
FOREIGN KEY (payment_id) REFERENCES Payment(id),
FOREIGN KEY (evaluate_ID) REFERENCES Evaluate(id)
);

-- Tạo bảng Item
CREATE TABLE Item (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
image VARCHAR(255),
price DECIMAL(10, 2) NOT NULL
);

-- Tạo bảng Reservation_item_order
CREATE TABLE Reservation_item_order (
id INT AUTO_INCREMENT PRIMARY KEY,
item_id INT,
quantity INT NOT NULL,
reservation_id INT,
FOREIGN KEY (item_id) REFERENCES Item(id),
FOREIGN KEY (reservation_id) REFERENCES Reservation(id)
);

-- Tạo bảng Ship_item_order
CREATE TABLE Ship_item_order (
id INT AUTO_INCREMENT PRIMARY KEY,
item_id INT,
quantity INT NOT NULL,
ship_id INT,
FOREIGN KEY (item_id) REFERENCES Item(id),
FOREIGN KEY (ship_id) REFERENCES Ship(id)
);

-- Tạo bảng Message
CREATE TABLE Message (
id INT AUTO_INCREMENT PRIMARY KEY,
content TEXT NOT NULL,
customer_id INT,
admin_id INT,
time DATETIME,
FOREIGN KEY (customer_id) REFERENCES User(id),
FOREIGN KEY (admin_id) REFERENCES User(id)
);
