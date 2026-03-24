
CREATE DATABASE crm_db;
SHOW DATABASES;
USE crm_db;



CREATE TABLE manager (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150)
);
CREATE TABLE customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150),

    status VARCHAR(20),
    manager_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (manager_id) REFERENCES manager(id)
);
CREATE TABLE customer_note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);
CREATE TABLE task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    due_date DATE,
    status VARCHAR(20),

    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DOUBLE NOT NULL,
    stock INT NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id BIGINT,
    quantity INT NOT NULL,
    total_price DOUBLE NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO manager (name, email) VALUES
('Admin One', 'admin1@crm.com'),
('Admin Two', 'admin2@crm.com');

-- Seed users (passwords are BCrypt encoded; admin123 and cust123)
-- Note: actual seeding is handled by DataLoader on application startup

SELECT * FROM customer;











