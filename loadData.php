<?php 
	$podcasts = file_get_contents('js/import.json');
	
	$podcastsObj = json_decode($podcasts);

	foreach($podcastsObj as $key => $podcast){

		$feed =  file_get_contents($podcast -> feed);
		$feed = simplexml_load_string($feed);
		$feed = json_encode($feed);
		
		$feedObj = json_decode($feed);

		$podcast -> name = $feedObj -> channel -> title;
		$image = explode("?",  $feedObj -> channel -> image -> url);
		//var_dump($image);
		$imageLocale = pathinfo($image[0] , PATHINFO_FILENAME).'.'.pathinfo($image[0] , PATHINFO_EXTENSION);
		//var_dump($imageLocale);
		if(!is_file('img/'.$imageLocale)){
			file_put_contents('img/'.$imageLocale, file_get_contents($image[0]));
		}
		$podcast -> cover = 'img/'.$imageLocale;

		$podcast -> lastPub = strtotime($feedObj -> channel -> pubDate);
	}
	$podcastsObj = json_encode($podcastsObj);
	$podcasts = file_put_contents('js/import.json', $podcastsObj);


	
 ?>