<?php 
	if ($_REQUEST['url']) {
		$podcast =  file_get_contents($_REQUEST['url']);
		$podcast = simplexml_load_string($podcast);
		$podcast = json_encode($podcast, JSON_FORCE_OBJECT,10);
		echo $podcast ;
	}else{
		die();
	}
 ?>