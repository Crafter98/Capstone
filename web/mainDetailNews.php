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

$section = substr($section, 1, -1);
$keyword = substr($keyword, 1, -1);

$query = 'SELECT title, url FROM primary_crawling WHERE title LIKE "%';
$query .= $keyword;
$query .= '%" AND date = ';
$query .= $date;
$query .= ' AND section LIKE "';
$query .= $section;
$query .= '%" limit 4;';
$result = mysqli_query($conn, $query);

$output = array();

$i = 0;
while($row = mysqli_fetch_array($result)){
    $output[$i." url"] = $row["url"];
    $output[$i." title"] = $row["title"];

    $i = $i + 1;
}
echo json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>