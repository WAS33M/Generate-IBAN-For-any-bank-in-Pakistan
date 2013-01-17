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

	require("functions.php");

	$bank_account_number = $_POST['bank_account_number'];
	$swift_code = $_POST['swift_code'];
	
	$country_code	=	"PK";
	
	$return_data = array();

	$return_data['message'] = json_encode(generateIbanNumber($bank_account_number, $swift_code, $country_code));

	echo json_encode($return_data);
	die();

?>
