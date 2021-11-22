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
$keyword = '\''.$_POST['keyword'].'\'';
$section = '\''.$_POST['section'].'\'';

$query = "SELECT related_word, frequency FROM secondary_keywords WHERE date = ";
$query .= $date;
$query .= "and keyword =";
$query .= $keyword;
$query .= "and section =";
$query .= $section;
$query .= "ORDER BY frequency desc;";
$result = mysqli_query($conn, $query);

// query 결과를 table로 만들어 웹에 return
// $output = '';
// $output .= '
// <table class="table table-bordered table-hover" width="100%">
// <tr>
// <th width="20%" height="70px">연관어</th>
// <th width="20%">언급량</th>
// </tr>
// ';

// while($row = mysqli_fetch_array($result)){
//     $output .= '
//     <tr>
//     <td>'.$row["related_word"].'</td>
//     <td height="30px">'.$row["frequency"].'</td>
//     </tr>
//     ';
// }
// $output .= '</table>';
// echo $output;

$output = array();

$i = 0;
while($row = mysqli_fetch_array($result)){
    $output[$i] = $row["related_word"];
    $output[$i." frequency"] = $row["frequency"];

    $i = $i + 1;
    if($i > 9){
        break;
    }
}
echo json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>