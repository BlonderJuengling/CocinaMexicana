/**
 * table - cm_accounts
 * stores accounts for cocina mexicana elearning system
 */
CREATE TABLE IF NOT EXISTS cm_accounts (
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'unique account id',
	username varchar(55) NOT NULL UNIQUE COMMENT 'unique name for account',
	password text NOT NULL COMMENT 'password for account hashed with sha-1',
	email VARCHAR(255) UNIQUE NOT NULL COMMENT 'email of account owner',
	firstname varchar(100) DEFAULT NULL COMMENT 'firstname of account owner',
	lastname varchar(100) DEFAULT NULL COMMENT 'lastname of account owner',
	api_key VARCHAR(32) NOT NULL COMMENT 'api key for account',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'datetime when account was created'
    class_quiz_done TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'shows if user already done the classification quiz'
);