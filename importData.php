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



	$i = 0;

	foreach($importPodcastsObj as $key => $podcast){

		
		for ($try=1; $try<=3; $try++) {
			$feed =  file_get_contents($podcast["xmlUrl"]);
			if ($feed) {
			    break;
			}
			sleep(2);
		}

		$feedObj = simplexml_load_string($feed);

		$nom = former($feedObj -> channel -> title);

		// Alias du podcast
		$podcastsFile['list'][$i] -> alias = (string) $nom;

		// Nom du podcast 
		$podcastsFile['list'][$i] -> name = (string) $feedObj -> channel -> title;

		// Flux du podcast 	
		$podcastsFile['list'][$i] -> feed = (string) $podcast["xmlUrl"];

		// Creation de l'image cover du podcast 	
		$image = ($feedObj -> channel -> image -> url) ? $feedObj -> channel -> image -> url : $feedObj-> channel -> children('http://www.itunes.com/dtds/podcast-1.0.dtd')->image->attributes()->href;

		$image = explode('?', $image);

		$imageLocale = $nom.'.'.pathinfo($image[0] , PATHINFO_EXTENSION);	

		for ($try=1; $try<=3; $try++) {
			$cover = file_get_contents($image[0]);
			if ($feed) {
			    break;
			}
			sleep(2);
		}

		file_put_contents('podcasts/'.$imageLocale, $cover);
		
		// Cover du podcast	
		$podcastsFile['list'][$i] -> cover = $imageLocale;	

		// Description du podcast	
		$podcastsFile['list'][$i] -> description = (string) $feedObj -> channel -> description;

		// Dernière publication
		$podcastsFile['list'][$i] -> lastPub = strtotime($feedObj -> channel -> item[0] -> pubDate);

		// Creation du JSON a partir du flux du podcast
		$feedObj = json_encode(new SimpleXMLElement($feedObj->asXML(), LIBXML_NOCDATA));			
		file_put_contents('podcasts/'.$nom.'.json', $feedObj);
		
		$i++;

	}
	//$podcastsFile['list'] = $podcastsList;

	// Création du JSON de la base de podcast
	$podcastsFile = json_encode($podcastsFile);
	file_put_contents('podcasts.json', $podcastsFile);


	
 ?>