CREATE DATABASE sampletest;

CREATE TABLE tbmovie(
    prid SERIAL PRIMARY KEY,
    name json,
    asset json,
    parental_rating json,
    description VARCHAR(255)
);