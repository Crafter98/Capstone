<?php
$conn = mysqli_connect(
    'localhost',
    'root',
    'twailight7',
    'capstone'
);

$date = '\''.$_POST['date'].'\'';
$section = '\''.$_POST['section'].'\'';

$query = "SELECT keyword, frequency FROM keywords WHERE date = ";
$query .= $date;
$query .= "and section =";
$query .= $section;
$result = mysqli_query($conn, $query);

$output .= '
<table class="table table-bordered">
<tr>
<th width="35%">키워드</th>
<th width="35%">빈도 수</th>
</tr>
';

while($row = mysqli_fetch_array($result)){
    $output .= '
    <tr>
    <td>'.$row["keyword"].'</td>
    <td>'.$row["frequency"].'</td>
    </tr>
    ';
}
$output .= '</table>';
echo $output;
?>