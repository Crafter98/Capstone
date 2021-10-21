<?php

DB 연결 파트
$conn = mysqli_connect(
    '127.0.0.1',
    'root',
    'twailight7',
    'capstone'
);

// $conn = mysqli_connect(
//     '125.187.32.134',
//     'user',
//     'KAU',
//     'capstone'
// );

// 웹에서 선택된 date와 section 값 가져와서 query 작성
$date = '\''.$_POST['date'].'\'';
$section = '\''.$_POST['section'].'\'';

$query = "SELECT keyword, frequency FROM primary_keywords WHERE date = ";
$query .= $date;
$query .= "and section =";
$query .= $section;
$query .= "ORDER BY frequency desc;";
$result = mysqli_query($conn, $query);

// query 결과를 table로 만들어 웹에 return
$output .= '
<table class="table table-bordered table-hover" width="100%">
<tr>
<th width="20%" height="70px">순위</th>
<th width="20%">키워드</th>
<th width="20%">언급량</th>
</tr>
';

$i = 1;
while($row = mysqli_fetch_array($result)){
    $output .= '
    <tr>
    <td>'.$i.'</td>
    <td onClick="ClickKeyword(this);">'.$row["keyword"].'</td>
    <td height="30px">'.$row["frequency"].'</td>
    </tr>
    ';
    $i = $i + 1;
}
$output .= '</table>';
echo $output;
?>