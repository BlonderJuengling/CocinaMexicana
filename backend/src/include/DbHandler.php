<?php

class DbHandler {

	private $conn;

	function __construct() {
		require_once dirname(__FILE__) . '/DbConnect.php';

		// open database connection
		$this->conn = DbConnect::getInstance();
	}

	/* ---------------------------- 'accounts' table method ---------------------------- */

	/**
	 * Creating new account
	 * @param String $name Full name of account owner
	 * @param String $email E-Mail of account owner
	 * @param String $password Account login password
	 */
	public function createAccount($username, $email, $password, $firstname, $lastname) {
		require_once('PassHash.php');
		$response = array();

		$emailExists = $this->isEmailExists($email);
		$usernameExists = $this->isUsernameExists($username);

		if(!$emailExists && !$usernameExists) {
			$password_hash = PassHash::hash($password);
			$api_key = $this->generateApiKey();

			$statement = $this->conn->prepare("INSERT INTO cm_accounts(username, password, email,
				firstname, lastname, api_key)
				VALUES(:username, :password, :email, :firstname, :lastname, :api_key)");
			$statement->bindParam(':username', $username, PDO::PARAM_STR);
			$statement->bindParam(':password', $password_hash, PDO::PARAM_STR);
			$statement->bindParam(':email', $email, PDO::PARAM_STR);
			$statement->bindParam(':firstname', $firstname, PDO::PARAM_STR);
			$statement->bindParam(':lastname', $lastname, PDO::PARAM_STR);
			$statement->bindParam(':api_key', $api_key, PDO::PARAM_STR);

			$result = $statement->execute();
			$statement->closeCursor();

			if($result) {
				return ACCOUNT_CREATED_SUCCESSFULLY;
			}
			else {
				return ACCOUNT_CREATE_FAILED;
			}
		}
		else if($emailExists) {
			return ACCOUNT_EMAIL_ALREADY_EXISTED;
		}
		else {
			return ACCOUNT_USERNAME_ALREADY_EXISTED;
		}

		return $response;
	}

	/**
	 * Checking for duplicate accounts
	 * @param String $email E-Mail to check in database
	 * @return boolean
	 */
	private function isEmailExists($email) {
		$statement = $this->conn->prepare("SELECT id FROM cm_accounts WHERE email = :email");
		$statement->bindParam(':email', $email, PDO::PARAM_STR);

		try {
			$statement->execute();
			$result_length = $statement->rowCount();
			$statement->closeCursor();

			return $result_length > 0;
		}
		catch(Exception $e) {
			print($e);
		}


	}

	/**
	 * Checking for duplicate account name
	 * @param String $username Username to check in database
	 * @return boolean
	 */
	private function isUsernameExists($username) {
		$statement = $this->conn->prepare("SELECT id FROM cm_accounts WHERE username = :username");
		$statement->bindParam(':username', $username, PDO::PARAM_STR);
		$statement->execute();
		$result_length = $statement->rowCount();
		$statement->closeCursor();

		return $result_length > 0;
	}

	/**
	 * Generating random Unique MD5 String for api key
	 */
	private function generateApiKey() {
		return md5(uniqid(rand(), true));
	}

	/**
	 * Check login information entered
	 * @param String $email email address
	 * @param String $password password to account
	 * @return boolean
	 */
	public function checkLogin($usernme, $password) {
		require_once('PassHash.php');

		$statement = $this->conn->prepare("SELECT password FROM cm_accounts WHERE username = :username");
		$statement->bindParam(':username', $username, PDO::PARAM_STR);
		$statement->execute();

		if($statement->rowCount() > 0) {
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			$password_hash = $result['password'];
			$statement->closeCursor();

			if(PassHash::checkPassword($password_hash, $password)) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			$statement->closeCursor();
			return false;
		}
	}

	/**
	 * Get account bei username
	 * @param String $username account username
	 * @return Object account information
	 */
	public function getAccountByUsername($username) {
		$statement = $this->conn->prepare("SELECT * FROM cm_accounts WHERE username = :username");
		$statement->bindParam(':username', $username, PDO::PARAM_STR);
		$statement->execute();

		if($statement) {
			$account = $statement->fetch(PDO::FETCH_OBJ);
			$statement->closeCursor();
			return $account;
		}
		else {
			return NULL;
		}
	}

	/**
	 * Get api key from account id
	 * @param Integer $accountId unique account id
	 * @return String api key
	 */
	public function getApiKeyByAccountId($accountId) {
		$statement = $this->conn->prepare("SELECT api_key FROM cm_accounts WHERE id = :accountId");
		$statement->bindParam(':accountId', $accountId, PDO::PARAM_INT);
		$statement->execute();

		if($statement) {
			$apiKey = $statement->fetch();
			$statement->closeCursor();
			return $apiKey;
		}
		else {
			return NULL;
		}
	}

	/**
	 * Get account id by account api key
	 * @param String $apiKey unique api key of account
	 * @return Integer unique account id
	 */
	public function getAccountIdByApiKey($apiKey) {
		$statement = $this->conn->prepare("SELECT id FROM cm_accounts WHERE api_key = :apiKey");
		$statement->bindParam(':apiKey', $apiKey, PDO::PARAM_STR);
		$statement->execute();

		if($statement) {
			$accountId = $statement->fetch();
			$statement->closeCursor();
			return $accountId;
		}
		else {
			return NULL;
		}
	}

	/**
	 * validate api key
	 * if the api key is in db than we know that it is an valid key
	 * @param String $apiKey api key to validate
	 * @return boolean result of validation (true means that key is valid)
	 */
	public function isValidApiKey($apiKey) {
		$statement = $this->conn->prepare("SELECT id FROM cm_accounts WHERE api_key = :apiKey");
		$statement->bindParam(':apiKey', $apiKey, PDO::PARAM_STR);
		$statement->execute();
		$numRows = $statement->rowCount();
		$statement->closeCursor();
		return $numRows > 0;
	}

}