<?php 
	if ($_REQUEST['url']) {
		$podcast =  file_get_contents($_REQUEST['url']);
		$podcast = simplexml_load_string($podcast);
		$podcast = json_encode($podcast);
		echo $podcast ;
	}else{
		die();
	}
 ?>