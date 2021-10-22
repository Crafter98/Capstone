<?php

error_reporting(E_ALL);

ini_set("display_errors", 1);

// DB 연결 파트
// $conn = mysqli_connect(
//     '127.0.0.1',
//     'root',
//     'twailight7',
//     'capstone'
// );

$conn = mysqli_connect(
    '125.187.32.134',
    'user',
    'KAU',
    'capstone'
);

// 웹에서 선택된 date와 section 값 가져와서 query 작성
$date = '\''.$_POST['date'].'\'';

$query = "SELECT keyword, frequency FROM primary_keywords WHERE date = ";
$query .= $date;
$query .= "ORDER BY frequency desc;";
$result = mysqli_query($conn, $query);

// query 결과를 table로 만들어 웹에 return
// $output = '';
$output = array();

$i = 1;
while($row = mysqli_fetch_array($result)){
    // $output["keyword".$i] = $row["keyword"]."&#13;".$row["frequency"];
    $output["keyword".$i] = $row["keyword"];

    $i = $i + 1;
    if($i > 5){
        break;
    }
}
echo json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>