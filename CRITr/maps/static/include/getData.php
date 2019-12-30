<?php
$servername = "localhost:3306";
$username = "dbBot1";
$password = "kZ66R!E5Cl^eh";
$dbName = "admin_";
try {
	$conn = new PDO("mysql:host=$servername;dbname=$dbName", $username, $password);
	// set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$xmin = $_REQUEST["xmin"];
	$xmax = $_REQUEST["xmax"];
	$ymin = $_REQUEST["ymin"];
	$ymax = $_REQUEST["ymax"];
	$table = $_REQUEST["tableName"];
	$columns = $_REQUEST["columns"];
	$extra = $_REQUEST["extra"];
	
	$sqlQuery = "SELECT $columns FROM $table $extra;";
	$sqlQuery = $conn->prepare($sqlQuery);
	$sqlQuery->execute();
	
	echo json_encode($sqlQuery->fetchAll());
	
}
catch(PDOException $e)
{
	echo "SQL Connection failed: " . $e->getMessage();
}
$conn = null;
?>
