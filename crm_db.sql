
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
INSERT INTO manager (name, email) VALUES
('Admin One', 'admin1@crm.com'),
('Admin Two', 'admin2@crm.com');
SELECT * FROM customer;
USE crm_db;

INSERT INTO manager (name, email) VALUES
('Admin One', 'admin1@crm.com'),
('Admin Two', 'admin2@crm.com'),
('Sales Lead', 'sales@crm.com');










