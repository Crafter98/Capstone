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

$query = "SELECT keyword, frequency, section FROM primary_keywords WHERE date = ";
$query .= $date;
$query .= "ORDER BY frequency desc;";
$result = mysqli_query($conn, $query);

$output = array();

$i = 0;
while($row = mysqli_fetch_array($result)){
    $output[$i] = $row["keyword"];
    $output[$i." section"] = $row["section"];

    $i = $i + 1;
    if($i > 9){
        break;
    }
}
echo json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

?>