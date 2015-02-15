/**
 * table - cm_accounts
 * stores accounts for cocina mexicana elearning system
 */
CREATE TABLE IF NOT EXISTS cm_accounts (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'unique account id',
	username VARCHAR(55) NOT NULL UNIQUE COMMENT 'unique name for account',
	password TEXT NOT NULL COMMENT 'password for account hashed with sha-1',
	email VARCHAR(255) UNIQUE NOT NULL COMMENT 'email of account owner',
	firstname VARCHAR(100) DEFAULT NULL COMMENT 'firstname of account owner',
	lastname VARCHAR(100) DEFAULT NULL COMMENT 'lastname of account owner',
	api_key VARCHAR(32) NOT NULL COMMENT 'api key for account',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'datetime when account was created',
    rank_id INT NOT NULL DEFAULT 0 COMMENT 'rank id of account owner',
    class_quiz_done TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'shows if user already done the classification quiz'
);

/**
 * table - cm_ranks
 * available ranks for cocina mexicana users
 */
CREATE TABLE IF NOT EXISTS cm_ranks (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'unique rank id',
	rank VARCHAR(32) NOT NULL UNIQUE COMMENT 'name of rank',
	sort TINYINT(1) NOT NULL COMMENT 'order of ranks in group',
	category VARCHAR(32) NOT NULL COMMENT 'group the rank belongs to'
);

/**
* insert predefined ranks into cm_ranks
*/
INSERT INTO cm_ranks (rank, sort, category) VALUES
	('Tellerwäscher', 1, 'Anfänger'),
	('Küchenhilfe', 2, 'Anfänger'),
	('Fertigtortillakäufer', 3, 'Anfänger'),
	('Gelegenheitskocher', 1, 'Fortgeschrittener'),
	('Mexikourlauber', 2, 'Fortgeschrittener'),
	('Jalapnozüchter', 1, 'Profi'),
	('Küchengott', 2, 'Profi'),
	('Mexikaner', 3, 'Profi');
