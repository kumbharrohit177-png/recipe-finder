-- Drop tables in correct order to handle foreign key constraints
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Create tables
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE recipes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    instructions VARCHAR(2000),
    cooking_time INT,
    difficulty VARCHAR(20),
    cuisine VARCHAR(50),
    image_url VARCHAR(500),
    category VARCHAR(50)
);

CREATE TABLE recipe_ingredients (
    recipe_id BIGINT NOT NULL,
    ingredients VARCHAR(255),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
