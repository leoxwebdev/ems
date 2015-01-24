<?php

	include_once('ConnectToDb.php');

	$what = $_POST[ 'what' ];
	$itemgroupId = $_POST[ 'itemgroupId' ];
	$itemgroupName = $_POST[ 'itemgroupName' ];
	$daysInterval = $_POST[ 'daysInterval' ];
	$itemDetail1 = $_POST[ 'itemDetail1' ];
	$itemDetail2 = $_POST[ 'itemDetail2' ];
	$itemDetail3 = $_POST[ 'itemDetail3' ];
	$itemDetail4 = $_POST[ 'itemDetail4' ];
	$itemDetail5 = $_POST[ 'itemDetail5' ];
	$itemDetail6 = $_POST[ 'itemDetail6' ];
	$itemDetail7 = $_POST[ 'itemDetail7' ];
	$itemDetail8 = $_POST[ 'itemDetail8' ];

	//$q = "INSERT INTO `itemdepartment` (`ItemDeptDesc`) VALUES ('$value') ON DUPLICATE KEY UPDATE ItemDeptDesc = ItemDeptDesc";
	if ( $what == "ItemGroupCreate" ){

		$q = "INSERT INTO `itemgroup` (`ItemGroupDesc`,`pmsDays`,`D1`,`D2`,`D3`,`D4`,`D5`,`D6`,`D7`,`D8`) VALUES ('$itemgroupName',$daysInterval,'$itemDetail1','$itemDetail2','$itemDetail3','$itemDetail4','$itemDetail5','$itemDetail6','$itemDetail7','$itemDetail8')";
		
	} elseif ( $what == "ItemGroupUpdate" ) {
		
		// CHECK IF THE NEW NAME DOES NOT EXIST
		// CHECK IF PMS Days greater than zero(0) in case of previous pms days greater 0
		$ItemId = $_POST[ 'ItemId' ];
		$q = "UPDATE `itemgroup` SET ItemGroupDesc='$itemgroupName', pmsDays=$daysInterval, D1='$itemDetail1', D2='$itemDetail2', D3='$itemDetail3', D4='$itemDetail4', D5='$itemDetail5', D6='$itemDetail6', D7='$itemDetail7',D8='$itemDetail8' where ItemGroupId=$itemgroupId";
	}
	//echo $q;
	
	if ( mysql_query( $q ) ){ 
	
		if ( $what == "ItemGroupCreate" ){
		
			echo mysql_insert_id();
		} else { // update
		
			echo "success";
		}
	 }else{ 
	 
		echo "failed";
	}
	
?>