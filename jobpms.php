<?php
include_once('ConnectToDb.php');

$what = $_POST['what'];    // Insert or Delete tech assignment 1 & 0
$jobType = $_POST['jobType']; //  0 = pms, 1 = jobOrder
$jobId = $_POST['jobId'];
$techId = $_POST['techId'];


if ( $what == 1 ){ // Insert

	$q = "INSERT INTO JobAssign ( JobType, JobId, TechId ) VALUES ( $jobType, $jobId, $techId )";
} else { //Remove

	$q = "DELETE FROM JobAssign WHERE JobType=$jobType and JobId=$jobId and TechId=$techId";
}

if ( mysql_query( $q ) ){ 

	echo "success";
 }else{ 
 
	echo "failed";
}


?>