DROP DATABASE IF EXISTS testdb;

CREATE DATABASE testdb;

CREATE TABLE guest (
    id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    tableNumber INT,
    eventId INT,
    PRIMARY KEY(id)
);