<?php 
	function miseAJour(){
		$listPodcasts = file_get_contents('podcasts.json');
		$listPodcastsObj = json_decode($listPodcasts);
		$listPodcastsObj = $listPodcastsObj -> list;

		foreach($listPodcastsObj as $key => $podcast){
			$feed =  file_get_contents($podcast -> feed);
			$feedObj = simplexml_load_string($feed);
			
			if(strtotime($feedObj -> channel -> item[0] -> pubDate) > $podcast -> lastPub){

				$podcast -> lastPub = strtotime($feedObj -> channel -> item[0] -> pubDate);

				// Creation du JSON a partir du flux du podcast
				$feedObj = json_encode(new SimpleXMLElement($feedObj->asXML(), LIBXML_NOCDATA));			
				file_put_contents('podcasts/'.$nom.'.json', $feedObj);
			}

		}

		// Création du JSON de la base de podcast	
		$listPodcastsObj = json_encode($listPodcastsObj);
		file_put_contents('podcasts.json', $listPodcastsObj);
	}
?>