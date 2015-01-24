<?php

include_once('ConnectToDb.php');

$log = $_GET['log'];
$pass = $_GET['pass'];

$leoLog = "";
$leoPass = "";
$correctName = "false";
$correctPass = "false";

$q = mysql_query( "SELECT leoName, leoPass FROM emsUsers WHERE leoName='$log'" );

$row = mysql_fetch_assoc( $q );

$leoLog = $row[ "leoName" ];
$leoPass = $row[ "leoPass" ];

if ( $log === $leoLog ){ $correctName = "true"; }
if ( $pass === $leoPass ){ $correctPass = "true"; }

if ( $correctName === "true" && $correctPass === "true" ){
	
	echo "success";
	
} else if( $correctName === "true" ){

	echo "1";
} else {

	echo "0";
}
//echo "login name: $leoLog, password = $leoPass";
//echo "login name: $log, password = $pass";
?>