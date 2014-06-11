<?php 
	if ($_REQUEST['url'] && $_REQUEST['nom']) {

		/*$podcast =  file_get_contents($_REQUEST['url']);
		$podcast = simplexml_load_string($podcast);
		$podcast = json_encode($podcast);

		$podcastObj = json_decode($podcast);



		$lastPub = $_REQUEST['nom'];	
		$newPub = strtotime($podcastObj -> channel -> pubDate);	

		if($newPub > $lastPub){
			$podcasts = file_get_contents('js/import.json');
			$podcastsObj = json_decode($podcasts);			
			$podcastsObj -> $_REQUEST['nom'] -> lastPub = strtotime($newPub);
			$podcastsObj = json_encode($podcastsObj);
			file_put_contents('js/import.json', $podcastsObj);

			$podcastObj = json_encode($podcastObj);

			file_put_contents('podcasts/'.$_REQUEST['nom'].'.json', $podcastObj);
		}*/	

		$finalpodcast = file_get_contents('podcasts/'.$_REQUEST['nom'].'.json');
		echo $finalpodcast;

		
	}else{
		die();
	}
 ?>