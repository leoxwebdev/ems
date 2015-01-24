<?php
include_once('ConnectToDb.php');
$what = $_GET['what'];
$value = $_GET['value'];

if( $what == "deptList"){

	$q = mysql_query( "SELECT * FROM itemdepartment ORDER BY ItemDeptDesc" );
	$Depts = array();	

	while( $row = mysql_fetch_array( $q ) ){
	
		$Depts[]=array("ItemDeptId"=>$row["ItemDeptId"],"ItemDeptDesc"=>$row["ItemDeptDesc"]);
	}
	
	echo json_encode( $Depts );
	
} else if( $what == "itemgroupList" ){

	$q = mysql_query( "SELECT * FROM itemgroup ORDER BY ItemGroupDesc" );
	$ItemGroups = array();
	
	while( $row = mysql_fetch_array( $q ) ){
	
		$ItemGroups[] = array( "ItemGroupId" => $row[ "ItemGroupId" ], "ItemGroupDesc" => $row[ "ItemGroupDesc" ] );
	}
	
	echo json_encode( $ItemGroups );
	
} else if( $what == "locationList" ){

	$q = mysql_query( "SELECT * FROM locationgroup ORDER BY LGroupDesc" );
	$LocationGroups = array();
	
	while( $row = mysql_fetch_array( $q ) ){
	
		$LocationGroups[] = array( "LGroupId" => $row[ "LGroupId" ], "LGroupDesc" => $row[ "LGroupDesc" ], "LMajorGroup" => $row[ "LMajorGroup" ], "LOverGroup" => $row[ "LOverGroup" ] );
	}
	
	echo json_encode( $LocationGroups );
	
} else if( $what == "locationmajorList" ){

	$q = mysql_query( "SELECT * FROM locationmajorgroup ORDER BY LMajorGroupDesc" );
	$LocationMajorGroups = array();
	
	while( $row = mysql_fetch_array( $q ) ){
	
		$LocationMajorGroups[] = array( "LMajorGroupId" => $row[ "LMajorGroupId" ], "LMajorGroupDesc" => $row[ "LMajorGroupDesc" ], "LOverGroup" => $row[ "LOverGroup" ] );
	}
	
	echo json_encode( $LocationMajorGroups );
	
} else if( $what == "locationoverList" ){

	$q = mysql_query( "SELECT * FROM locationovergroup ORDER BY LOverGroupDesc" );
	$LocationOverGroups = array();
	
	while( $row = mysql_fetch_array( $q ) ){
	
		$LocationOverGroups[] = array( "LOverGroupId" => $row[ "LOverGroupId" ], "LOverGroupDesc" => $row[ "LOverGroupDesc" ] );
	}
	
	echo json_encode( $LocationOverGroups );
	
} else if( $what == "OverGroupMajorList" ){

	//$q = mysql_query( "SELECT * FROM locationmajorgroup where LOverGroup=$value ORDER BY LMajorGroupDesc");
	$q = mysql_query( "SELECT * FROM locationmajorgroup ORDER BY LMajorGroupDesc");
	$OverGrouplocationmajorList = array();
	
	while( $row = mysql_fetch_array( $q ) ){
	
		$OverGrouplocationmajorList[] = array( "LMajorGroupId" => $row[ "LMajorGroupId" ], "LMajorGroupDesc" => $row[ "LMajorGroupDesc" ] );
	}
	
	echo json_encode( $OverGrouplocationmajorList );
	
} else if( $what == "MajorGroupLocationList" ){

	$q = mysql_query( "SELECT * FROM locationgroup where LMajorGroup=$value ORDER BY LGroupDesc");
	$MajorGroupLocationList = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$MajorGroupLocationList[] = array( "LGroupId" => $row[ "LGroupId" ], "LGroupDesc" => $row[ "LGroupDesc" ] );
	}
	
	echo json_encode( $MajorGroupLocationList );
	
} else if( $what == "locationDetails" ){

	$q = mysql_query( "SELECT * FROM locationgroup where LMajorGroup=$value ORDER BY LGroupDesc");
	$MajorGroupLocationList = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$MajorGroupLocationList[] = array( "LGroupId" => $row[ "LGroupId" ], "LGroupDesc" => $row[ "LGroupDesc" ] );
	}
	
	echo json_encode( $MajorGroupLocationList );
	
} else if( $what == "itemDetails" ){

	$q = mysql_query( "SELECT i.ItemGroup, i.ItemId, i.Brand, i.Label, i.Model, i.Serial, i.D1, i.D2, i.D3, i.D4, i.D5, i.D6, i.D7, i.D8, DATE_FORMAT(i.PurchaseDate,'%Y-%m-%d') as PurchaseDate, i.Supplier, l.LGroupDesc FROM items i inner join locationgroup l on i.LocGroup=l.LGroupId where i.ItemId=$value");
	
	$itemDetails = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$itemDetails[] = array( "ItemGroup" => $row[ "ItemGroup" ], "ItemId" => $row[ "ItemId" ], "Brand" => $row[ "Brand" ], "Label" => $row[ "Label" ], "Model" => $row[ "Model" ], "Serial" => $row[ "Serial" ], "D1" => $row[ "D1" ], "D2" => $row[ "D2" ], "D3" => $row[ "D3" ], "D4" => $row[ "D4" ], "D5" => $row[ "D5" ], "D6" => $row[ "D6" ], "D7" => $row[ "D7" ], "D8" => $row[ "D8" ], "PurchaseDate" => $row[ "PurchaseDate" ], "Supplier" => $row[ "Supplier" ], "LGroupDesc" => $row[ "LGroupDesc" ] );
	}
	
	echo json_encode( $itemDetails );
	
} else if( $what == "itemDetailsLoc" ){

	$q = mysql_query( "SELECT ItemId, Brand, Model, Serial, ItemGroup, ItemDept, LocGroup, LocMajorGroup, LocOverGroup FROM items where ItemId=$value");
	
	$itemDetails = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$itemDetails[] = array( "ItemId" => $row[ "ItemId" ], "Brand" => $row[ "Brand" ], "Model" => $row[ "Model" ], "Serial" => $row[ "Serial" ], "ItemGroup" => $row[ "ItemGroup" ], "ItemDept" => $row[ "ItemDept" ], "LocGroup" => $row[ "LocGroup" ], "LocMajorGroup" => $row[ "LocMajorGroup" ], "LocOverGroup" => $row[ "LocOverGroup" ] );
	}
	
	echo json_encode( $itemDetails );
	
} else if( $what == "itemDetailsPMSDate" ){

	$q = mysql_query( "SELECT i.ItemId, i.Brand, i.Model, ig.ItemGroupDesc, l.LGroupDesc, p.pmsDays, p.fcsDays FROM items i INNER JOIN locationgroup l ON i.LocGroup=l.LGroupId INNER JOIN itemgroup ig ON i.ItemGroup=ig.ItemGroupId INNER JOIN pmsDefault p ON ig.ItemGroupId=p.ItemGroup WHERE i.ItemId=$value LIMIT 1");
	
	$itemDetails = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$itemDetails[] = array( "ItemId" => $row[ "ItemId" ], "Brand" => $row[ "Brand" ], "Model" => $row[ "Model" ], "ItemGroupDesc" => $row[ "ItemGroupDesc" ], "pmsDays" => $row[ "pmsDays" ], "fcsDays" => $row[ "fcsDays" ], "LGroupDesc" => $row[ "LGroupDesc" ] );
	}
	
	echo json_encode( $itemDetails );
	
} else if( $what == "airconTech" ){

	$q = mysql_query( "SELECT * FROM Technician ORDER BY Name");
	//$q = SELECT t.* FROM Technician t NATURAL LEFT JOIN JobAssign j WHERE j.FirstName IS NULL
	
	$airconTech = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$airconTech[] = array( "TechId" => $row[ "TechId" ], "Name" => $row[ "Name" ], "Title" => $row[ "Title" ] );
	}
	
	echo json_encode( $airconTech );
	
} else if( $what == "assignedTech" ){
	//JobType, JobId, TechId
	$q = mysql_query( "SELECT t.TechId, t.Name FROM Technician t INNER JOIN JobAssign j on t.TechId=j.TechId WHERE j.JobId=$value ORDER BY t.Name");
	
	$assignedTech = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$assignedTech[] = array( "TechId" => $row[ "TechId" ], "Name" => $row[ "Name" ] );
	}
	
	echo json_encode( $assignedTech );
	
} else if( $what == "getPMSRemarks" ){

	$q = mysql_query( "SELECT Remarks FROM pmsCurrent WHERE pmsId=$value" );
	
	$row = mysql_fetch_assoc($q);
	
	
	echo $row[ "Remarks" ];
	
} else if( $what == "itemPMSDays" ){

	$q = mysql_query( "SELECT d.pmsDays FROM pmsDefault d INNER JOIN items i ON d.ItemGroup=i.ItemGroup WHERE i.ItemId=$value LIMIT 1" );
	
	$row = mysql_fetch_assoc($q);
	
	$valueReturn = $row[ "pmsDays" ];
	echo $valueReturn;
	
} else if( $what == "itemFCSDays" ){

	$q = mysql_query( "SELECT d.fcsDays FROM pmsDefault d INNER JOIN items i ON d.ItemGroup=i.ItemGroup WHERE i.ItemId=$value LIMIT 1" );
	
	$row = mysql_fetch_assoc($q);
	
	$valueReturn = $row[ "fcsDays" ];
	echo $valueReturn;
	
} else if( $what == "FieldMapping" ){

	$q = mysql_query( "SELECT * FROM itemgroup WHERE ItemGroupId=$value LIMIT 1" );
	
	$Fieldmapping = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$Fieldmapping[] = array( "ItemGroupId" => $row[ "ItemGroupId" ], "ItemGroupDesc" => $row[ "ItemGroupDesc" ], "pmsDays" => $row[ "pmsDays" ], "D1" => $row[ "D1" ], "D2" => $row[ "D2" ], "D3" => $row[ "D3" ], "D4" => $row[ "D4" ], "D5" => $row[ "D5" ], "D6" => $row[ "D6" ], "D7" => $row[ "D7" ], "D8" => $row[ "D8" ] );
	}
	
	echo json_encode( $Fieldmapping );
	
} else if( $what == "itemPMSHistoryDate" ){

	$q = mysql_query( "SELECT pmsDate FROM pmsCurrent WHERE Status=1 and ItemId=$value ORDER BY pmsDate DESC");
	
	$pmsHistoryDates = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$pmsHistoryDates[] = array( "pmsDate" => $row[ "pmsDate" ] );
	}
	
	echo json_encode( $pmsHistoryDates );
	
} else if( $what == "itemFCSHistoryDate" ){

	$q = mysql_query( "SELECT DATE_FORMAT(fcsDate,'%m-%d-%Y') as fcsDate FROM fcsCurrent WHERE Status=1 and ItemId=$value ORDER BY fcsDate DESC");
	
	$fcsHistoryDates = array();
	
	while( $row = mysql_fetch_array( $q ) ){

		$fcsHistoryDates[] = array( "fcsDate" => $row[ "fcsDate" ] );
	}
	
	echo json_encode( $fcsHistoryDates );
	
} else if( $what == "itemsetsList" ){

	$q = mysql_query( "SELECT * FROM itemSets ORDER BY setName" );
	$ItemsetsRec = array();
	
	while( $row = mysql_fetch_array( $q ) ){
	
		$ItemsetsRec[] = array( "setId" => $row[ "setId" ], "setName" => $row[ "setName" ], "majorGroup" => $row[ "majorGroup" ], "Location" => $row[ "Location" ], "setDesc" => $row[ "setDesc" ] );
	}
	
	echo json_encode( $ItemsetsRec );
	
}


?>