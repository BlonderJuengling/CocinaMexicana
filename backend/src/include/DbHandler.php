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
		$status = array();

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
				$status['status'] = ACCOUNT_CREATED_SUCCESSFULLY;
				$status['detail'] = null;
				return $status;
			}
			else {
				$status['status'] = ACCOUNT_CREATE_FAILED;
				$status['detail'] = null;
			}
		}
		else {
			$status['status'] = ACCOUNT_NOT_UNIQUE;
			$status['detail'] = array();

			if($emailExists)
				$status['detail'][ACCOUNT_EMAIL_ALREADY_EXISTED] = 'e-mail already exists';
			if($usernameExists)
				$status['detail'][ACCOUNT_USERNAME_ALREADY_EXISTED] = 'username already exists';

			return $status;
		}
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
	public function checkLogin($username, $password) {
		require_once('PassHash.php');

		$statement = $this->conn->prepare("SELECT password FROM cm_accounts WHERE username = :username");
		$statement->bindParam(':username', $username, PDO::PARAM_STR);
		$statement->execute();

		if($statement->rowCount() > 0) {
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			$password_hash = $result['password'];
			$statement->closeCursor();

			return PassHash::checkPassword($password_hash, $password);
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
			$statement->closeCursor();
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
			$statement->closeCursor();
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
			$statement->closeCursor();
			return NULL;
		}
	}

	/**
	 * Validate api key
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


	/* ---------------------------- 'ranks' table method ---------------------------- */

	/**
	 * Update rank informatoin for user
	 * @param Integer $rankId id of rank
	 * @param Integer $userId id of user to update rank info
	 * @return boolean result of update (true means update succeed)
	 */
	public function updateUserRankId($rankId, $userId) {
		$statement = $this->conn->prepare("UPDATE cm_accounts SET rank_id = :rank WHERE id = :userid");
		$statement->bindParam(':rank', $rankId, PDO::PARAM_INT);
		$statement->bindParam(':userid', $userId, PDO::PARAM_INT);
		$statement->execute();
		$numRows = $statement->rowCount();
		$statement->closeCursor();
		return $numRows > 0;
	}

	/**
	 * Returns unique id for rank
	 * @param String $category category of rank
	 * @param Integer $sort order of rank in category
	 * @return Integer unique id of specified rank
	 */
	public function getUniqueRankId($category, $sort) {
		$statement = $this->conn->prepare("SELECT id FROM cm_ranks WHERE sort = :sort AND category = :cat");
		$statement->bindParam(':cat', utf8_decode($category), PDO::PARAM_STR);
		$statement->bindParam(':sort', $sort, PDO::PARAM_INT);
		$statement->execute();

		if($statement) {
			$rank = $statement->fetch();
			$statement->closeCursor();
			return $rank['id'];
		}
		else {
			$statement->closeCursor();
			return NULL;
		}
	}

	/**
	 * Return rank name as string
	 * @param Integer $rankdId id of rank
	 * @return String rank name
	 */
	public function getRankNameById($rankdId) {
		$statement = $this->conn->prepare("SELECT rank FROM cm_ranks WHERE id = :rankId");
		$statement->bindParam(':rankId', $rankdId, PDO::PARAM_INT);
		$statement->execute();

		if($statement) {
			$result = $statement->fetch();
			$statement->closeCursor();
			return utf8_encode($result['rank']);
		}
		else {
			$statement->closeCursor();
			return NULL;
		}
	}

	/**
	 * Return list of available ranks in db and all information to ranking
	 * @return Array ranklist
	 */
	public function getRankList() {
		$statement = $this->conn->prepare("SELECT * FROM cm_ranks");
		$statement->execute();

		if($statement) {
			$result = $statement->fetchAll(PDO::FETCH_OBJ);
			$statement->closeCursor();
			return $result;
		}
		else {
			$statement->closeCursor();
			return NULL;
		}
	}
}