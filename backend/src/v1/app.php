 <?php

require_once PROJECT_ROOT . '/include/environment.php';
require_once PROJECT_ROOT . '/include/config.inc.php';
require_once PROJECT_ROOT . '/include/DbHandler.php';
require_once PROJECT_ROOT . '/include/PassHash.php';

// allow cors
$app->response->headers->set('Access-Control-Allow-Origin', '*');
$app->response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
$app->response->headers->set('Access-Control-Max-Age', '3600');

// global user id from database
$account_id = NULL;


/**
 * define 'apache_request_headers' if not exists
 * source from http://php.net/manual/de/function.apache-request-headers.php
 */
if(!function_exists('apache_request_headers'))
{
	function apache_request_headers() {
		$arh = array();
		$rx_http = '/\AHTTP_/';
  		foreach($_SERVER as $key => $val) {
    		if( preg_match($rx_http, $key) ) {
      			$arh_key = preg_replace($rx_http, '', $key);
      			$rx_matches = array();
			    // do some nasty string manipulations to restore the original letter case
			    // this should work in most cases
			    $rx_matches = explode('_', $arh_key);
			    if( count($rx_matches) > 0 and strlen($arh_key) > 2 ) {
        			foreach($rx_matches as $ak_key => $ak_val)
        				$rx_matches[$ak_key] = ucfirst($ak_val);
        			$arh_key = implode('-', $rx_matches);
      			}
      			$arh[$arh_key] = $val;
    		}
  		}
  		return( $arh );
	}
}

/**
 * Verifying required params posted or not
 */
if(!function_exists('verifyRequiredParams')) {
	function verifyRequiredParams($requiredFields, $app)
	{
		$error = false;
		$errorFields = '';
		$requestParams = array();
		$requestParams = $app->request->params();

		// manual handling of PUT requests
		if($app->request->getMethod() == 'PUT') {
			parse_str($app->request->getBody(), $requestParams);
		}

		foreach($requiredFields as $field) {
			if(!isset($requestParams[$field]) || strlen(trim($requestParams[$field])) <= 0) {
				$error = true;
				$errorFields .= $field . ', ';
			}
		}

		if($error) {
			// missing required fields or empty fields
			$app->halt(400, 'Required field(s) ' . substr($errorFields, 0, -2) . ' is missing or empty');
		}
	}
}

/**
 * extract post parameters and values from request
 * @return Array
 */
if(!function_exists('getRequestPostValues'))
{
	function getRequestPostValues($request, $paramList)
	{
		$values = array();

		foreach ($paramList as $field) {
			$values[$field] = $request->post($field);
		}

		return $values;
	}
}

/**
 * Validating email address
 */
if(!function_exists('validateEmail'))
{
	function validateEmail($email)
	{
		$app = \Slim\Slim::getInstance();
		if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$response['error'] = true;
			$response['message'] = 'E-Mail adress is not valid';
			$response['email'] = $email;
			echoResponse(400, $response);
			$app->stop();
		}
	}
}

/**
 * Echoing json response
 */
if(!function_exists('echoResponse'))
{
	function echoResponse($statusCode, $response) {
		$app = \Slim\Slim::getInstance();
		$app->status($statusCode);
		$app->contentType('application/json');
		echo json_encode($response);
	}
}

/**
 *
 */
if(!function_exists('authenticate'))
{
	function authenticate(\Slim\Route $route) {
		$headers = apache_request_headers();
		$response = array();
		$app = \Slim\Slim::getInstance();

		if(isset($headers['Authorization'])) {
			$db = new DbHandler();
			$apiKey = $headers['Authorization'];

			if(!$db->isValidApiKey($apiKey)) {
				$response['error'] = true;
				$response['message'] = 'Access denied. Invalid api key in authorization header';
				echoResponse(401, $response);
				$app->stop();
			}
			else {
				global $account_id;
				$account = $db->getAccountIdByApiKey($apiKey);

				if($account != null) {
					$account_id = $account['id'];
				}
			}
		}
		else {
			$response['error'] = true;
			$response['message'] = 'Api key is missing in authorization header';
			echoResponse(400, $response);
			$app->stop();
		}
	}
}

/**
 * Account registration
 * url - /account
 * method - POST
 * params - username, email, password, firstname, lastname
 */
$app->post('/account', function() use ($app) {
	$requiredParams = array('username', 'email', 'password', 'firstname', 'lastname');

	verifyRequiredParams($requiredParams, $app);

	$response = array();
	$accountData = getRequestPostValues($app->request(), $requiredParams);

	validateEmail($accountData['email']);

	$db = new DbHandler();
	$result = $db->createAccount($accountData['username'], $accountData['email'], $accountData['password'],
								$accountData['firstname'], $accountData['lastname']);

	if($result['status'] === ACCOUNT_CREATED_SUCCESSFULLY) {
		$response['error'] = false;
		$response['message'] = 'You are successfully registered';
		echoResponse(201, $response);
	}
	else if($result['status'] === ACCOUNT_CREATE_FAILED) {
		$response['error'] = true;
		$response['message'] = 'Oops! An error occured while registration';
		echoResponse(200, $response);
	}
	else if($result['status'] === ACCOUNT_NOT_UNIQUE) {
		$response['error'] = true;
		$response['error_codes'] = $result['detail'];
		$response['message'] = 'Sorry, account is not unique';
		echoResponse(200, $response);
	}
});

/**
 * Account - get list of accounts
 * url - /account
 * method - GET
 */
$app->get('/account', function() use ($app) {
	$response = array();

	$response['error'] = true;
	$response['message'] = 'Get account via RestAPI not yet implemented';
	echoResponse(200, $response);
});

 /**
  * Account deletion
  * url - /account
  * method - DELETE
  */
$app->delete('/account', function() use ($app) {
	$response = array();

	$response['error'] = true;
	$response['message'] = 'Delete account via RestAPI not yet implemented';
	echoResponse(200, $response);
});

/**
 * Account - update account information
 * url - /account
 * method - PUT
 * params - email, password, firstname, lastname
 */
$app->put('/account', function() use ($app) {
	$response = array();

	$response['error'] = true;
	$response['message'] = 'Update account information via RestAPI not yet implemented';
	echoResponse(200, $response);
});

/**
 * Login for user using email and password
 * url - /login
 * method - POST
 * params - email, password
 */
$app->post('/login', function() use ($app) {
	$params = array('username', 'password');
	verifyRequiredParams($params, $app);

	$loginData = getRequestPostValues($app->request(), $params);
	$response = array();

	$db = new DbHandler();
	if($db->checkLogin($loginData['username'], $loginData['password'])) {
		$account = $db->getAccountByUsername($loginData['username']);

		if($account != null) {
			$response['error'] = false;
			$response['account'] = $account;
		}
		else {
			$response['error'] = true;
			$response['message'] = "An error occured. Please try again";
		}
	}
	else {
		$response['error'] = true;
		$response['username'] = $loginData['username'];
		$response['password'] = $loginData['password'];
		$response['message'] = 'Login failed. Incorrect credentials';
	}

	echoResponse(200, $response);
});

?>