<?php
include_once('ConnectToDb.php');
$what = $_POST['what'];
$value = $_POST['value'];

if ( $what == "deptAdd" ){

	$q = "INSERT INTO `itemdepartment` (`ItemDeptDesc`) VALUES ('$value') ON DUPLICATE KEY UPDATE ItemDeptDesc = ItemDeptDesc";
} else if ( $what == "itemgroupAdd" ){

	$q = "INSERT INTO `itemgroup` (`ItemGroupDesc`) VALUES ('$value') ON DUPLICATE KEY UPDATE ItemGroupDesc = ItemGroupDesc";

} else if ( $what == "locationAdd" ){
	
	$comma1 = strpos( $value, "," );
	$comma2 = strrpos( $value, "," );
	
	$locName = substr( $value, 0, $comma1 );
	$locMajorId = substr( $value, $comma1 + 1, $comma2 - ( $comma1 + 1 ) );
	$locOverGroupId = substr( $value, $comma2 + 1 );
	
	$q = "INSERT INTO `locationgroup` (`LGroupDesc`,`LMajorGroup`,`LOverGroup`) VALUES ('$locName',$locMajorId,$locOverGroupId) ON DUPLICATE KEY UPDATE LGroupDesc = LGroupDesc";

} else if ( $what == "locationmajorAdd" ){

	$commaIndex = strpos( $value, "," );
	
	$mgroupName = substr( $value, 0, $commaIndex );
	$mgroupOverGroupId = substr( $value, $commaIndex + 1 );

	$q = "INSERT INTO `locationmajorgroup` (`LMajorGroupDesc`,`LOverGroup`) VALUES ('$mgroupName',$mgroupOverGroupId) ON DUPLICATE KEY UPDATE LMajorGroupDesc = LMajorGroupDesc";

} else if ( $what == "locationoverAdd" ){

	$q = "INSERT INTO `locationovergroup` (`LOverGroupDesc`) VALUES ('$value') ON DUPLICATE KEY UPDATE LOverGroupDesc = LOverGroupDesc";

} else if ( $what == "startingPMSDate" ){
/*	
	$pmsStat = substr( $value, 0, 1 );
	$pmsDate = substr( $value, 2, 10 );
	$pmsItemId = substr( $value, 13 );
	
	if ( $pmsStat == 1 ){
	
		$q = "INSERT INTO pmsCurrent ( ItemId, pmsDate ) VALUES ( $pmsItemId, '$pmsDate' )";
	} else {
	
		$q = "UPDATE pmsCurrent set pmsDate='$pmsDate' where ItemId=$pmsItemId and Status=0";
	}
*/
	//0,2014-01-01,2014-03-03,123
	$pmsStat = substr( $value, 0, 1 );
	$nextpmsDate = substr( $value, 2, 10 );
	$lastpmsDate = substr( $value, 13, 10 );
	$pmsItemId = substr( $value, 24 );
	
	if ( $pmsStat == 1 ){
		
		$q = "INSERT INTO pmsCurrent ( ItemId, pmsDate, Status ) VALUES ( $pmsItemId, '$lastpmsDate', 1 )";
		if ( mysql_query( $q ) ){ 

			$q = "INSERT INTO pmsCurrent ( ItemId, pmsDate ) VALUES ( $pmsItemId, '$nextpmsDate' )";

		 }else{ 
		 
			echo "failed";
		}
	} else {
	
		$q = "UPDATE pmsCurrent set pmsDate='$pmsDate', Status=1 where ItemId=$pmsItemId and Status=0";
		if ( mysql_query( $q ) ){ 

			$q = "INSERT INTO pmsCurrent ( ItemId, pmsDate ) VALUES ( $pmsItemId, '$nextpmsDate' )";

		 }else{ 
		 
			echo "failed";
		}	
	}	

} else if ( $what == "startingFCSDate" ){
	//0,2014-01-01,2014-03-03,123
	$fcsStat = substr( $value, 0, 1 );
	$nextfcsDate = substr( $value, 2, 10 );
	$lastfcsDate = substr( $value, 13, 10 );
	$fcsItemId = substr( $value, 24 );
	
	if ( $fcsStat == 1 ){
		
		$q = "INSERT INTO fcsCurrent ( ItemId, fcsDate, Status ) VALUES ( $fcsItemId, '$lastfcsDate', 1 )";
		if ( mysql_query( $q ) ){ 

			$q = "INSERT INTO fcsCurrent ( ItemId, fcsDate ) VALUES ( $fcsItemId, '$nextfcsDate' )";

		 }else{ 
		 
			echo "failed";
		}
	} else {
	
		//$q = "UPDATE fcsCurrent set fcsDate='$fcsDate' where ItemId=$fcsItemId and Status=0";
		$q = "UPDATE fcsCurrent set fcsDate='$lastfcsDate', Status=1 where ItemId=$fcsItemId and Status=0";
		
		if ( mysql_query( $q ) ){ 

			$q = "INSERT INTO fcsCurrent ( ItemId, fcsDate ) VALUES ( $fcsItemId, '$nextfcsDate' )";

		 }else{ 
		 
			echo "failed";
		}	
	}

} else if ( $what == "pmsRemarks" ){
	
	$commaIndex = strpos( $value, "," );
	
	$pmsId = substr( $value, 0, $commaIndex );
	$pmsRemarks = substr( $value, $commaIndex + 1 );
	
	 $q = "UPDATE pmsCurrent SET Remarks='$pmsRemarks' where pmsId=$pmsId";
	
} else if ( $what == "updatePMSStat" ){
	
	$commaIndex = strpos( $value, "," );
	
	$pmsId = substr( $value, 0, $commaIndex );
	$nextDate = substr( $value, $commaIndex + 1 , 10 ); // yyyy-mm-dd12,3434
	$itemId = substr( $value, $commaIndex + 11 );
	$qUpdate = "UPDATE pmsCurrent set Status=1,pmsDate=DATE_FORMAT(now(),'%Y-%m-%d') where pmsId=$pmsId";

	if ( mysql_query( $qUpdate ) ){ 

		$q = "INSERT INTO pmsCurrent ( ItemId, pmsDate ) VALUES ( $itemId, '$nextDate' )";
	 }else{ 
	 
		$q = "Leo Gwapo";
	}

}

if ( mysql_query( $q ) ){ 
	
	if ( $what == "updatePMSStat" ){
		
		echo mysql_insert_id();
	} else {
		echo "success";
	}	
 }else{ 
 
	echo "failed";
}

?>