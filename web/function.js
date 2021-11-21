// 배너 사이트 이름 클릭
function btnsiteNameClick(){
    location.href = "/main.html"
    // location.href = "http://localhost/웹/main.html"
}

// 날짜를 string으로 바꿔주는 함수
function dateToString(curDate){
    var year = curDate.getFullYear()
    var month = curDate.getMonth()+1
    var date = curDate.getDate()

    month = month >=10 ? month : "0" + month
    date  = date  >= 10 ? date : "0" + date
    return today = "" + year + "-" + month + "-" + date
}

// 오늘 하루 전으로 기본 세팅
function setNow(){
    var now = new Date()
    now.setDate(now.getDate()-1)
    now = dateToString(now)
    return now
}