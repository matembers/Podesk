<?php 
	if ($_REQUEST['url'] && $_REQUEST['nom']) {

		$podcast =  file_get_contents($_REQUEST['url']);
		$podcast = simplexml_load_string($podcast);
		$podcast = json_encode($podcast);

		$podcastObj = json_decode($podcast);


		$podcasts = file_get_contents('js/import.json');
		$podcastsObj = json_decode($podcasts);

		$lastPub = $podcastsObj -> $_REQUEST['nom'] -> lastPub;	
		$newPub = strtotime($podcastObj -> channel -> pubDate);	

		if($newPub > $lastPub){
			$podcastsObj -> $_REQUEST['nom'] -> lastPub = strtotime($newPub);
			$podcastsObj = json_encode($podcastsObj);
			$podcasts = file_put_contents('js/import.json', $podcastsObj);

			$podcast = json_encode($podcast);

			file_put_contents('podcasts/'.$_REQUEST['nom'].'.json', $podcast);
		}	

		if (file_exists('podcasts/'.$_REQUEST['nom'].'.json')) {
			$podcast = json_encode($podcast);
			$podcast =  file_get_contents('podcasts/'.$_REQUEST['nom'].'.json');
			echo $podcast;
		}else{
			$podcast = json_encode($podcast);
			file_put_contents('podcasts/'.$_REQUEST['nom'].'.json', $podcast);		
			echo $podcast;
		}
		
	}else{
		die();
	}
 ?>