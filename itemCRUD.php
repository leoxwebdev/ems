<?php

	include_once('ConnectToDb.php');
	
	$what = $_POST[ 'what' ];
	$itemId = $_POST[ 'itemId' ];
	$itemOver = $_POST[ 'itemOver' ];
	$itemMajor = $_POST[ 'itemMajor' ];
	$itemLocation = $_POST[ 'itemLocation' ];
	$itemLabel = $_POST[ 'itemLabel' ];
	$itemDepartment = $_POST[ 'itemDepartment' ];
	$itemGroup = $_POST[ 'itemGroup' ];
	$itemBrand = $_POST[ 'itemBrand' ];
	$itemModel = $_POST[ 'itemModel' ];
	$itemSerial = $_POST[ 'itemSerial' ];
	$itemPurchaseDate = $_POST[ 'itemPurchaseDate' ];
	$itemSupplier = $_POST[ 'itemSupplier' ];
	$itemAssetId = $_POST[ 'itemAssetId' ];
	$itemDetail1 = $_POST[ 'itemDetail1' ];
	$itemDetail2 = $_POST[ 'itemDetail2' ];
	$itemDetail3 = $_POST[ 'itemDetail3' ];
	$itemDetail4 = $_POST[ 'itemDetail4' ];
	$itemDetail5 = $_POST[ 'itemDetail5' ];
	$itemDetail6 = $_POST[ 'itemDetail6' ];
	$itemDetail7 = $_POST[ 'itemDetail7' ];
	$itemDetail8 = $_POST[ 'itemDetail8' ];

	if ( $what == "ItemInsert" ){
	
		$q = "INSERT INTO `items` (`Brand`,`Model`,`Serial`,`ItemGroup`,`ItemDept`,`LocGroup`,`LocMajorGroup`,`LocOverGroup`,`PurchaseDate`,`Supplier`,`AssetId`,`D1`,`D2`,`D3`,`D4`,`D5`,`D6`,`D7`,`D8`,`Label`) VALUES ('$itemBrand','$itemModel','$itemSerial',$itemGroup,$itemDepartment,$itemLocation,$itemMajor,$itemOver,'$itemPurchaseDate','$itemSupplier','$itemAssetId','$itemDetail1','$itemDetail2','$itemDetail3','$itemDetail4','$itemDetail5','$itemDetail6','$itemDetail7','$itemDetail8','$itemLabel')";
	} else if ( $what == "ItemUpdate" ){
	
		$q = "UPDATE items SET Brand='$itemBrand',Model='$itemModel',Serial='$itemSerial',PurchaseDate='$itemPurchaseDate',Label='$itemLabel'," .
				"Supplier='$itemSupplier',AssetId='$itemAssetId',D1='$itemDetail1',D2='$itemDetail2',D3='$itemDetail3'," .
				"D4='$itemDetail4',D5='$itemDetail5',D6='$itemDetail6',D7='$itemDetail7',D8='$itemDetail8' WHERE ItemId=$itemId";
	}
	//echo $q;
	
	if ( mysql_query( $q ) ){ 
	
		echo "success";
	 }else{ 
	 
		echo "failed";
	}
	
?>