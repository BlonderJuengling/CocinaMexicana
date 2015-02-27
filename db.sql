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
    rank_id INT NOT NULL DEFAULT -1 COMMENT 'rank id of account owner, -1 = quiz not done yet'
);

/**
 * table - cm_ranks
 * available ranks for cocina mexicana users
 */
CREATE TABLE IF NOT EXISTS cm_ranks (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'unique rank id',
	rank VARCHAR(32) NOT NULL UNIQUE COMMENT 'name of rank',
	sort TINYINT(1) NOT NULL COMMENT 'order of ranks in group',
	category VARCHAR(32) NOT NULL COMMENT 'group the rank belongs to',
	promotion_criterions VARCHAR(200) NOT NULL COMMENT 'criterion for promotion to get next rank'
);

/**
* insert predefined ranks into cm_ranks
*/
INSERT INTO cm_ranks (rank, sort, category, promotion_criterions) VALUES
	('Tellerwäscher', 1, 'Anfänger', '3'),
	('Küchenhilfe', 2, 'Anfänger', '4'),
	('Fertigtortillakäufer', 3, 'Anfänger', '5'),
	('Gelegenheitskoch', 1, 'Fortgeschrittener', '6'),
	('Mexikourlauber', 2, 'Fortgeschrittener', '8'),
	('Jalapenozüchter', 1, 'Profi', '15'),
	('Küchengott', 2, 'Profi', '20'),
	('Mexikaner', 3, 'Profi', '25');
