<?php

function getStock($quote='GOOG+AIMCO.BO+MEIL') {
	$file = "http://download.finance.yahoo.com/d/quotes.csv?s=$quote&f=snl1c1p2&e=.csv";
	$handle = fopen($file, "r");
	while($data = fgetcsv($handle, 40960, ',')) 
		$ret[$data[1]] = $data;
	fclose($handle);
	return json_encode($ret);
}

function getSymbols() {
	$symbolsText = file_get_contents("nasdaqlisted.txt");
	$symbolsLines = explode("\n", $symbolsText);
	$symbols = "";
	$c = 0;
	foreach($symbolsLines as $line) {
		$symbolsArr = explode("|", $line);
		if($symbolsArr[0] != "Symbol" &&
				substr($symbolsArr[0] , 0, 4)!= "File" &&
				$symbolsArr[0] != "")
			$symbols .= $symbolsArr[0]."+";
		if($c == 30)
			break;
		$c++;
	}
	return trim($symbols, "+");
}

$symbols = getSymbols();
echo getStock($symbols);