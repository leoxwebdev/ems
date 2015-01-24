<?php

include_once('ConnectToDb.php');

$what = $_GET['what'];
$itemlookupOver = (integer)$_GET['itemlookupOver'];
$itemlookupMajor = (integer)$_GET['itemlookupMajor'];
$itemlookupLocation = (integer)$_GET['itemlookupLocation'];
$itemlookupDepartment = (integer)$_GET['itemlookupDepartment'];
$itemlookupGroup = (integer)$_GET['itemlookupGroup'];
$itemlookupBrand = (string)$_GET['itemlookupBrand'];
$itemlookupModel = (string)$_GET['itemlookupModel'];
$itemlookupSerial = (string)$_GET['itemlookupSerial'];

$qwhere = "";

if( $what == "lookupLists" ){

	if ( $itemlookupOver > 1 ){ $qwhere = "i.LocOverGroup=".$itemlookupOver; }
	if ( $itemlookupMajor > 1 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.LocMajorGroup=".$itemlookupMajor; } else { $qwhere = "i.LocMajorGroup=".$itemlookupMajor; }}
	if ( $itemlookupLocation > 1 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.LocGroup=".$itemlookupLocation; } else { $qwhere = "i.LocGroup=".$itemlookupLocation; }}
	if ( $itemlookupDepartment > 1 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.ItemDept=".$itemlookupDepartment; } else { $qwhere = "i.ItemDept=".$itemlookupDepartment; }}
	if ( $itemlookupGroup > 1 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.ItemGroup=".$itemlookupGroup; } else { $qwhere = "i.ItemGroup=".$itemlookupGroup; }}
	if ( strlen( $itemlookupBrand ) > 0 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.Brand LIKE '%".$itemlookupBrand."%'"; } else { $qwhere = "i.Brand LIKE '%".$itemlookupBrand."%'"; }}
	if ( strlen( $itemlookupModel ) > 0 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.Model LIKE '%".$itemlookupModel."%'"; } else { $qwhere = "i.Model LIKE '%".$itemlookupModel."%'"; }}
	if ( strlen( $itemlookupSerial ) > 0 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.Serial LIKE '%".$itemlookupSerial."%'"; } else { $qwhere = "i.Serial LIKE '%".$itemlookupSerial."%'"; }}

	//if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere . " and ( p.Status=0 or p.Status is null )"; }
	
	$q = mysql_query( "SELECT i.ItemId, i.Brand, i.Label, i.Model, i.ItemGroup, l.LGroupDesc FROM items i inner join locationgroup l on i.LocGroup=l.LGroupId where $qwhere ORDER BY l.LGroupDesc,i.Label");

	$lookupLists = array();

	while( $row = mysql_fetch_array( $q ) ){

		$lookupLists[] = array( "ItemId" => $row[ "ItemId" ], "Brand" => $row[ "Brand" ], "Label" => $row[ "Label" ], "Model" => $row[ "Model" ], "ItemGroup" => $row[ "ItemGroup" ], "LGroupDesc" => $row[ "LGroupDesc" ] );
	}

	echo json_encode( $lookupLists );

}

?>

