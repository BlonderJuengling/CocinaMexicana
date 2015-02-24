<?php

class DbConnect
{
    private static $instance = NULL;

    // set constructor to 'private' to prevent create instance with 'new' command
    private function __construct() {

    }

    // return the db-instance
    public static function getInstance() {
        $dbConfig = $GLOBALS['envConfig'];

		if (!self::$instance)
			{
			self::$instance = new PDO(
                "mysql:dbname=". $dbConfig['db_name'] .";host=". $dbConfig['db_host'] .";port=". $dbConfig['db_port'],
                $dbConfig['db_user'], $dbConfig['db_password'],
                array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
			self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			}
		return self::$instance;
    }

    // to prevent cloning the database object
    private function __clone(){
    }
}

?>