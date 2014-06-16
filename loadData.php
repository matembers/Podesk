<?php 
setlocale(LC_TIME , 'fr_FR.iso885915@euro','fra');
if(!empty($_REQUEST['action'])){
    
    $action = $_REQUEST['action'];
	
	switch($action){
		case 'miseAJourAll':
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
			break;
		case 'miseAJourOne':
			$alias = 'tom-rhodes-radio';
			$listEpisodes = file_get_contents('podcasts/'.$alias.'.json');
			$listEpisodesObj = json_decode($listEpisodes);
			$listEpisodesObj = $listEpisodesObj -> episodes;
			

			$listPodcasts = file_get_contents('podcasts.json');
			$listPodcastsObj = json_decode($listPodcasts);
			$listPodcastsObj = $listPodcastsObj -> list;

			foreach($listPodcastsObj as $key => $podcast){
				if ($podcast -> alias == $alias) {
					$feed = file_get_contents($podcast -> feed);
				}
			}

			$feedObj = simplexml_load_string($feed);
			$feedObj = $feedObj -> channel -> item;

			$j = 0;

			foreach($feedObj as $key => $episode){
					
				$podcastFile['episodes'][$j] = new stdClass();
				
				// Nom de l'episode 
				$podcastFile['episodes'][$j] -> title = (string) $episode -> title;

				// Date de l'episode 
				$podcastFile['episodes'][$j] -> pubDate = (int) strtotime($episode -> pubDate);

				// Date FR de l'episode 
				$podcastFile['episodes'][$j] -> pubDateFR = (string) utf8_encode(ucwords(strftime('%d %B %Y',$podcastFile['episodes'][$j] -> pubDate))) ;

				// Description du podcast
				$description = ($episode -> children('http://www.itunes.com/dtds/podcast-1.0.dtd') -> summary) ? nl2br($episode -> children('http://www.itunes.com/dtds/podcast-1.0.dtd') -> summary) : $episode -> description;
				$podcastFile['episodes'][$j] -> description = (string) trim($description);

				// Lien du podcast	
				$podcastFile['episodes'][$j] -> link = (string) $episode -> link;

				// URL du podcast	
				$podcastFile['episodes'][$j] -> url = (string) $episode -> enclosure['url'];

				// Durée du podcast	
				$podcastFile['episodes'][$j] -> duration = (string) $episode -> children('http://www.itunes.com/dtds/podcast-1.0.dtd') -> duration;

				if (strtotime($episode -> pubDate) > $listEpisodesObj[0] -> pubDate) {
					// Lien du podcast	
					$podcastFile['episodes'][$j] -> read = (boolean) false;
				}else{
					$podcastFile['episodes'][$j] -> read = (boolean) true;
				}

				$j++;
			}
			usort($podcastFile['episodes'], function($a, $b){
				if($a->pubDate == $b->pubDate){ return 0 ; }
				return ($a->pubDate > $b->pubDate) ? -1 : 1;
			});
			//array_unshift($listEpisodesObj, $podcastFile);


			$podcastFile = json_encode($podcastFile);	
			file_put_contents('podcasts/'.$alias.'.json', $podcastFile);


			/*$listPodcasts = file_get_contents('podcasts.json');
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
			file_put_contents('podcasts.json', $listPodcastsObj);*/
			break;
	}
}

?>