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
$section = '\''.$_POST['section'].'\'';
$keyword = '\''.$_POST['keyword'].'\'';

$query = "SELECT react FROM secondary_crawling WHERE date = ";
$query .= $date;
$query .= " and keyword =";
$query .= $keyword;
$query .= " and section =";
$query .= $section;
$query .= ";";

$result = mysqli_query($conn, $query);

$output = array();

$pos = 0;
$neg = 0;
$i = 1;
while($row = mysqli_fetch_array($result)){
    if($row["react"] == 0){
        $neg = $neg + 1;
    }
    else{
        $pos = $pos + 1;
    }
}
$output["pos"] = $pos;
$output["neg"] = $neg;

echo json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>