CREATE DATABASE testdb;

CREATE TABLE mvTable(
    mvid SERIAL PRIMARY KEY,
    name json,
    asset json,
    parental_rating json,
    description VARCHAR(255)
);