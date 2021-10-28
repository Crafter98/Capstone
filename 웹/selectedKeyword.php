<?php
error_reporting(E_ALL);

ini_set("display_errors", 1);

$date = $_POST['date'];
$section = $_POST['section'];
$keyword = $_POST['keyword'];
if($date == null){
    echo console.log('n u l l')
}
else{
    echo console.log($keyword)
}
?>