<?php 
	function former($chaine){
		$chaine = utf8_decode($chaine); 
	    $toReplace="!.°ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ '\"\\/#\|\"()";
	    $byReplace="---AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNn----------";
	    $chaine = strtr($chaine, utf8_decode($toReplace), $byReplace);
	    $chaine = preg_replace('#[^a-zA-Z0-9-]#' , '' , $chaine);
	    
	    
	   	$chaine = strtolower($chaine);
	   	return utf8_encode($chaine); 
	}
	$importPodcasts = file_get_contents('podcasts.opml');
	$importPodcastsObj = simplexml_load_string($importPodcasts);

	$importPodcastsObj = $importPodcastsObj -> body -> outline -> outline;




	foreach($importPodcastsObj as $key => $podcast){


		
		$feed =  file_get_contents($podcast["xmlUrl"]);
		$feedObj = simplexml_load_string($feed);

		$nom = former($feedObj -> channel -> title);

		$obj[$nom] =  new stdClass();

		/* Nom du podcast */	
		$obj[$nom] -> name = (string) $feedObj -> channel -> title;

		/* Flux du podcast */	
		$obj[$nom] -> feed = (string) $podcast["xmlUrl"];

		/* Creation de l'image cover du podcast */	
		$image = ($feedObj -> channel -> image -> url) ? $feedObj -> channel -> image -> url : $feedObj-> channel -> children('http://www.itunes.com/dtds/podcast-1.0.dtd')->image->attributes()->href;
		$image = explode('?', $image);
		$imageLocale = $nom.'.'.pathinfo($image[0] , PATHINFO_EXTENSION);		
		file_put_contents('podcasts/'.$imageLocale, file_get_contents($image[0]));
		
		/* Cover du podcast */	
		$obj[$nom] -> cover = $imageLocale;
		/* Dernière publication */	

		$obj[$nom] -> lastPub = strtotime(($feedObj -> channel -> pubDate) ? $feedObj -> channel -> pubDate : $feedObj -> channel -> lastBuildDate);

		/* Creation du JSON a partir du flux du podcast */	
		$feedObj = json_encode(new SimpleXMLElement($feedObj->asXML(), LIBXML_NOCDATA));			
		file_put_contents('podcasts/'.$nom.'.json', $feedObj);

	}

	/* Création du JSON de la base de podcast */	
	$obj = json_encode($obj);
	file_put_contents('podcasts.json', $obj);


	
 ?>