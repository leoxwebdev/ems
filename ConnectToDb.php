<?php
mysql_connect("localhost", "root", "") or die("Problem with the connection");
mysql_select_db("pms");

mysql_query('SET CHARACTER SET utf8');
mysql_query('SET NAMES utf8');
mysql_set_charset('utf8');
?>