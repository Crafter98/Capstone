<?php

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

$query = "SELECT keyword, frequency FROM primary_keywords WHERE date = ";
$query .= $date;
$query .= "and section =";
$query .= $section;
$query .= "ORDER BY frequency desc;";
$result = mysqli_query($conn, $query);

////////////////////// new code ////////////////////////
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