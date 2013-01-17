<?php
  #######################################################################################################################
	##	Name = Waseem Riaz.
	##	Contact = 00923324514134
	##	Description = This is a simple php script to generate International Bank Account 
	##	Number (IBAN) for any bank in pakistan.
	##	This number is needed for online transactions like withdraw money from moneybookers.com and other online payment
	##	Processors. i contacted my bank and they said they dont know about iban number, so i did a little search and
	##	Created this simple iban number generation script. hope it helps someone.
	#######################################################################################################################

	function generateIbanNumber($bank_acount_number, $swift_code, $country_code)
	{
		// Checking number should be less or equal to 16	
		if(strlen($bank_acount_number)	>	16)
			return "Error => Bank Account number cannot be greater than 16 digits";
		
		// Converting account number to 16 digit if less by adding 0's to left side.
		$bank_acount_number = str_pad($bank_acount_number, 16, "0", STR_PAD_LEFT);
	
		// Converting swift code into an array
		$swift_code_array = explode(",", $swift_code);
		
		// Swift code should be off 4 digits only
		if(count($swift_code_array) != 4 || strlen($swift_code) != 7)
			return 'Error => Wrong swift code provided';
	
		// Loop through swiftcode array and change alphabets to specific numbers
		$swift_code_converted = "";
		foreach($swift_code_array as $c){
			$swift_code_converted .= getCharacterDigit($c);
			
		}
	
		$extra	=	getCharacterDigit("P").getCharacterDigit("K")."00";
		$IBAN	=	$swift_code_converted.$bank_acount_number.$extra;
		$modulo97	=	bcmod($IBAN, '97');
		$check_digit	=	(98 - $modulo97) < 10 ? "0".(98 - $modulo97) : (98 - $modulo97);
		
		$IBAN_NUMBER	=	$country_code.$check_digit.str_replace(",", "", $swift_code).$bank_acount_number;
		
		return	chunk_split($IBAN_NUMBER, 4, ' ');
	
	}
	
	function getCharacterDigit($character){
		
		//loop through alphabets and store a sequesce of digits against each character
		$counter = 10;
		$characters_array = array();
	
		for( $i=65; $i<=90; $i++) {
			$characters_array[chr($i)]	=	$counter;
			$counter++;
		}
	
		return $characters_array[strtoupper($character)];
		
	}

?>
