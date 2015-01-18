<?php

define('PROJECT_ROOT', realpath(__DIR__ . '/..'));

require PROJECT_ROOT . '/libs/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim(
	array(
		'version' => 0.1,
		'debug' => false,
		'mode' => 'production',
	)
);

require_once __DIR__ . '/app.php';

$app->run();