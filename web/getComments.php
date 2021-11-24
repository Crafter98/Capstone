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

function RemoveSpecialChar($str)
{
    $res = preg_replace('/[0-9\@\.\;]+/', '', $str);
    $res = str_replace(array("\\n", "\\", "/"), '', $str);

    return $res;
}

// 웹에서 선택된 date와 section 값 가져와서 query 작성
$date = '\''.$_POST['date'].'\'';
$section = '\''.$_POST['section'].'\'';
$keyword = '\''.$_POST['keyword'].'\'';
$react = '\''.$_POST['react'].'\'';

$query = "SELECT comments FROM secondary_crawling WHERE date = ";
$query .= $date;
$query .= " and keyword =";
$query .= $keyword;
$query .= " and section =";
$query .= $section;
$query .= " and react =";
$query .= $react;
$query .= " limit 10;";

$result = mysqli_query($conn, $query);

$output .= '
<table class="table table-bordered table-hover" width="100%">
<tr>
<th width="20%" height="70px" class="title">댓글</th>
</tr>
';

while($row = mysqli_fetch_array($result)){
    $str = RemoveSpecialChar($row["comments"]);

    $output .= '
    <tr>
    <td height="40px" align="left" class="underline">'.$str.'</td>
    </tr>
    ';
}
$output .= '</table>';
echo $output;
?>