<?php 
	function former($chaine){
		$chaine = utf8_decode($chaine); 
	    $toReplace="!.°ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ '\"\\/#\|\"()";
	    $byReplace="___AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNn__________";
	    $chaine = strtr($chaine, utf8_decode($toReplace), $byReplace);
	    $chaine = preg_replace('#[^a-zA-Z0-9_]#' , '' , $chaine);
	    
	    
	   	$chaine = strtolower($chaine);
	   	return utf8_encode($chaine); 
	}
	$podcasts = file_get_contents('js/import.json');
	
	$podcastsObj = json_decode($podcasts);

	foreach($podcastsObj as $key => $podcast){

		$feed =  file_get_contents($podcast -> feed);
		$feed = simplexml_load_string($feed);
		$feed = json_encode($feed);

		$feedObj = json_decode($feed);

		$nom = former($feedObj -> channel -> title);

		$podcast -> name = $feedObj -> channel -> title;



		$image = explode('?', $feedObj -> channel -> image -> url);
		//var_dump($image);
		$imageLocale = $nom.'.'.pathinfo($image[0] , PATHINFO_EXTENSION);
		//var_dump($imageLocale);
		if(!is_file('podcasts/img/'.$imageLocale)){
			file_put_contents('podcasts/img/'.$imageLocale, file_get_contents($image[0]));
		}
		$podcast -> cover = $imageLocale;

		$podcast -> lastPub = strtotime($feedObj -> channel -> pubDate);


		if (!is_file('podcasts/'.$nom.'.json')) {
			$feedObj = json_encode($feedObj);			
			file_put_contents('podcasts/'.$nom.'.json', $feedObj);	
		}

	}
	$podcastsObj = json_encode($podcastsObj);
	file_put_contents('js/import.json', $podcastsObj);


	
 ?>