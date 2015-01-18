<?php

$envConfig = array();

// initialize environment configuration for development (local machine)
if(isset($_SERVER['APPLICATION_ENV']) && $_SERVER['APPLICATION_ENV'] == 'development') {
	$envConfig = array(
		'db_user' => '',
		'db_password' => '',
		'db_host' => 'localhost',
		'db_port' => '3306',
		'db_name' => ''
	);
}

// initialize environment configuration for unit-testing (local machine)
else if(isset($_SERVER['APPLICATION_ENV']) && $_SERVER['APPLICATION_ENV'] == 'unittest') {
	$envConfig = array(
		'db_user' => '',
		'db_password' => '',
		'db_host' => 'localhost',
		'db_port' => '3306',
		'db_name' => ''
	);
}

//  finally define environment configuration for production
else {
	$envConfig = array(
		'db_user' => '',
		'db_password' => '',
		'db_host' => 'localhost',
		'db_port' => '3306',
		'db_name' => ''
	);
}

?>