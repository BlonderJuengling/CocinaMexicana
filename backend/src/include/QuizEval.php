<?php

class QuizEval {

	private $numberOfCorrectAnswers;
	private $numberOfQuestions;
	private $rank;

	function __construct($quizResult) {
		$result = json_decode(stripslashes($quizResult));

		$this->numberOfQuestions = $result->{'questions'};
		$this->numberOfCorrectAnswers = $result->{'correct_answers'};

		$this->rank = $this->setRank();
	}

	private function setRank() {
		$rankSpec = array('category' => 'Anfänger');
		$percentCorrect = $this->numberOfCorrectAnswers / $this->numberOfQuestions;

		if($this->numberOfCorrectAnswers >= $this->numberOfQuestions -1) {
			$rankSpec['sort'] = 3;
		}
		else if($percentCorrect >= 0.6) {
			$rankSpec['sort'] = 2;
		}
		else {
			$rankSpec['sort'] = 1;
		}

		return $rankSpec;
	}

	public function getRankId() {
		return $this->requestUniqueRankId();
	}

	private function requestUniqueRankId() {
		$db = new DbHandler();
		return $db->getUniqueRankId($this->rank['category'], $this->rank['sort']);
	}


}

?>