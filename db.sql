/**
 * table - cm_accounts
 * stores accounts for cocina mexicana elearning system
 */
CREATE TABLE IF NOT EXISTS cm_accounts (
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'unique account id',
	name varchar(55) NOT NULL UNIQUE COMMENT 'unique name for account',
	password char(40) NOT NULL COMMENT 'password for account hashed with sha-1',
	firstname varchar(100) DEFAULT NULL COMMENT 'firstname of account owner',
	lastname varchar(100) DEFAULT NULL COMMENT 'lastname of account owner'
);