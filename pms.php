<?php

include_once('ConnectToDb.php');

$what = $_GET['what'];
$pmsOver = (integer)$_GET['pmsOver'];
$pmsMajor = (integer)$_GET['pmsMajor'];
$pmsLocation = (integer)$_GET['pmsLocation'];
$pmsSorting = (string)$_GET['pmsSorting'];
//$pmsDepartment = (integer)$_GET['pmsDepartment'];
$pmsGroup = (integer)$_GET['pmsGroup'];
//$pmsBrand = (string)$_GET['pmsBrand'];
//$pmsModel = (string)$_GET['pmsModel'];
//$pmsSerial = (string)$_GET['pmsSerial'];

$qwhere = "";
$orderby = "";

if ( $pmsSorting == "pms" ){ $orderby = "p.pmsDate,l.LGroupDesc,i.Label"; } 
else if ( $pmsSorting == "fcs" ){ $orderby = "f.fcsDate,l.LGroupDesc,i.Label"; }

if( $what == "itempms" ){

	if ( $pmsOver > 1 ){ $qwhere = "i.LocOverGroup=".$pmsOver; }
	if ( $pmsMajor > 1 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.LocMajorGroup=".$pmsMajor; } else { $qwhere = "i.LocMajorGroup=".$pmsMajor; }}
	if ( $pmsLocation > 1 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.LocGroup=".$pmsLocation; } else { $qwhere = "i.LocGroup=".$pmsLocation; }}
	//if ( $pmsDepartment > 1 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.ItemDept=".$pmsDepartment; } else { $qwhere = "i.ItemDept=".$pmsDepartment; }}
	if ( $pmsGroup > 1 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.ItemGroup=".$pmsGroup; } else { $qwhere = "i.ItemGroup=".$pmsGroup; }}
	//if ( strlen( $pmsBrand ) > 0 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.Brand LIKE '%".$pmsBrand."%'"; } else { $qwhere = "i.Brand LIKE '%".$pmsBrand."%'"; }}
	//if ( strlen( $pmsModel ) > 0 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.Model LIKE '%".$pmsModel."%'"; } else { $qwhere = "i.Model LIKE '%".$pmsModel."%'"; }}
	//if ( strlen( $pmsSerial ) > 0 ){ if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere." and i.Serial LIKE '%".$pmsSerial."%'"; } else { $qwhere = "i.Serial LIKE '%".$pmsSerial."%'"; }}

	if ( strlen( $qwhere ) > 3 ){ $qwhere = $qwhere . " and ( p.Status=0 or p.Status is null or p.Status='' )" . " and ( f.Status=0 or f.Status is null or f.Status='' )"; }
	
	$q = mysql_query( "SELECT i.ItemId, i.Brand, i.Model, i.ItemGroup, i.Label, i.PurchaseDate, l.LGroupDesc, p.pmsId, DATE_FORMAT(p.pmsDate,'%m-%d-%Y') as pmsDate, f.fcsId, DATE_FORMAT(f.fcsDate,'%m-%d-%Y') as fcsDate  FROM items i inner join locationgroup l on i.LocGroup=l.LGroupId left join pmsCurrent p on i.ItemId=p.ItemId left join fcsCurrent f on i.ItemId=f.ItemId where $qwhere ORDER BY $orderby");

	$itempms = array();

	while( $row = mysql_fetch_array( $q ) ){

		$itempms[] = array( "ItemId" => $row[ "ItemId" ], "Brand" => $row[ "Brand" ], "Label" => $row[ "Label" ], "PurchaseDate" => $row[ "PurchaseDate" ], "Model" => $row[ "Model" ], "ItemGroup" => $row[ "ItemGroup" ], "LGroupDesc" => $row[ "LGroupDesc" ], "pmsId" => $row[ "pmsId" ], "pmsDate" => $row[ "pmsDate" ], "fcsId" => $row[ "fcsId" ], "fcsDate" => $row[ "fcsDate" ] );
	}

	echo json_encode( $itempms );

}

?>

