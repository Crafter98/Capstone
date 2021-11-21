var now // 오늘 날짜 - 1일

// 배너 사이트 이름 클릭
function btnsiteNameClick(){
    location.href = "/web/main.html"
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

// rgb로 된 색상 16진수 색상으로 return
function rgb2hex(rgb) {
    if (  rgb.search("rgb") == -1 ) {
        return rgb
    } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/)
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2)
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
    }
}

// top5 키워드 원 크기 맞추는 함수
function circleSize(){
    for(var i = 1; i <= 5; i++){
        var ID = ".keyword" + i
        var width = $(ID).width()
        $(ID).css("height", width)
    }
    $(".rank").css("height", $(".rank").width())
}

// top5 키워드 원에 맞춰서 세로선, 등수 원 위치와 색 조정
function Top5Positioning(){
    var maxHeight = $(window).height()
    $(".clickDown").css("height", maxHeight)

    for(var i = 1; i <= 5; i++){
        var name = ".keyword" + i
        var color = rgb2hex($(".btn"+name).css("background-color"))
        $(".updown" + name).css("background-color", color)
        $(".updown" + name).css("border", "1px solid " + color)
        $(".rank.circle" + i).css("background-color", color)

        var width = $(".keywordCircle").width()
        $(".updown" + name).css("left", width/2-1 + "px")
    }
}

// top5 키워드 원에 맞는 데이터 값 입력하기
function showKeywords(){
    dateChange = now.replace(/-/gi, '.')
    $.ajax({
        url: "mainTop5.php",
        type: "post",
        data: {date : dateChange},
    }).done(function(data) {
        data = $.parseJSON(data)
        var keys = Object.keys(data)
        for(var i = 0; i < keys.length; i++){
            var key = keys[i]
            var d = data[key]

            if(key.includes('section')){
                key = key.substr(0, 8)
                $(".section." + key).html(d)
            }
            else{
                $(".btn." + key).html(d)
            }
        }
    })
}

// top5 원 클릭했을 때 데이터 local storage에 저장하고 페이지 이동
function btnKeywordClick(num){
    var keyword = $(".btn.keyword" + num).text()
    var section = $(".section.keyword" + num).html()

    sessionStorage.setItem('keyword', keyword)
    sessionStorage.setItem('date', now)
    sessionStorage.setItem('section', section)

    location.href = "/web/test.html"
}

// 뉴스 div 위치 setting
function newsPositioning(){
    // 위치 set
    var h = $(".date").outerHeight()
    $(".day.news").css("top", h + "px")

    // 높이 set
    var maxHeight = $(".keywords").innerHeight()
    var margin = $(".keywords li").css("margin-top").replace(/[^-\d\.]/g, '')
    $(".day.news").css("height", maxHeight + margin * 2 + "px")
}

// 자세히 알아보기 버튼 클릭
function btnDownClick(){
    var y = $(".top5").offset().top
    $("html, body").animate({scrollTop: y - 40}, 500)
}

// top 버튼 클릭
function btnTopClick(){
    $("html, body").animate({scrollTop: 0}, 500)
}

function showDetailNews(target){
    var keyword = $(target).text() // 클릭된 키워드
    var idx = $(target).index()
    var parent = target.closest("ul")
    parent = $(parent).attr("class").substr(9) // days3, days2, days1

    // 선택된 키워드 배경 색 세팅
    $(".keywords li").css("background-color", "") // 여기 때문에 hover 색상 변경 안됨 #EEF2F9
    $(target).css("background-color", "white")

    if($(".day.news." + parent).css("display") != "inline-block") { // 다른게 열려있으면 닫고 이걸로 열고 키워드 바꿈
        $(".day.news").css("display", "none")
        $(".day.news." + parent).css("display", "inline-block")

        $(".day.before").css("border-bottom-right-radius", "20px")
        $(".day.before." + parent).css("border-bottom-right-radius", "0px")

        // 공백 간격 맞추는 코드
        if(parent != "days1"){
            var m = $(".day.before.days2").css("margin-left")
            $(".day.before.days1").css("margin-right", m);
        }
        else{
            $(".day.before.days1").css("margin-right", "0px");
        }
    }
    getDetailNews(parent, idx, keyword) // 뉴스 기사 링크 세팅
    setLi(parent) // li 간격 세팅
}

function setNewsKeyword(date, num){
    dateChange = dateToString(date).replace(/-/gi, '.')
    $.ajax({
       url: "mainNewsKeyword.php",
       type: "post",
       data: {date : dateChange},
   }).done(function(data) {
       data = $.parseJSON(data)
    //    console.log(data)
       var keys = Object.keys(data)
       for(var i = 0; i < keys.length; i++){
           var key = keys[i]
           var d = data[key]

           if(key.includes('section')){
               key = key.substr(0, 1)
               $(".section.days" + num + " li").eq(key).text(d)
           }
           else{
               $(".keywords.days" + num + " li").eq(key).text(d)
           }
       }
       showDetailNews($(".keywords.days1 li").eq(0))
   })
}

function setLi(day){
    var width  = $(".detailNews." + day).width()
    var padding = width * 0.4
    var height = $(".detailNews." + day).height()

    $(".detailNews." + day + " li").css("height", (height - padding) / 4 + "px")
}

function setDate(){
    var date = new Date(now)
    date.setDate(date.getDate() + 1)
    
    for(var i = 1; i < 4; i++){
        date.setDate(date.getDate() - 1)

        var str = dateToString(date)
        var month = str.substr(5, 2)
        var day = str.substr(8)
        $(".date.days" + i).text(month + "월 " + day + "일")
        setNewsKeyword(date, i)
    }
}

function getDetailNews(target, idx, keyword){
    var date = $(".date." + target).text()
    var month = date.substr(0, 2)
    var day = date.substr(4, 2)

    date = "2021." + month + "." + day
    var section = $(".section." + target + " li").eq(idx).text()
    $.ajax({
        url: "mainDetailNews.php",
        type: "post",
        data: {date: date,
            section: section,
            keyword: keyword},
    }).done(function(data) {
        data = $.parseJSON(data)
    //    console.log(data)
       var keys = Object.keys(data)
       var str = "<a href='"
       for(var i = 0; i < keys.length; i++){
           var key = keys[i]
           var d = data[key]
           var index = key.substr(0, 1)

           if(key.includes('url')){
            //    $(".detailNews." + target + " li").eq(index).text(d)
            str = str + d + "' target='_blank'>"
           }
           else{
            //    $(".keywords.days" + num + " li").eq(key).text(d)
            str = str + d + "</a>"
            $(".detailNews." + target + " li").eq(index).html(str)
            str = "<a href='"
           }
       }
    })
}

$(document).ready(function(){
    circleSize()
    Top5Positioning()
    newsPositioning()
    now = setNow()
    // setDate()
    
    $(window).scroll(function(){
        if($(this).scrollTop() > 400){
            $('#Top').fadeIn()
        }
        else {
            $('#Top').fadeOut()
        }
    })
    now = "2021-09-01"
    setDate()
    
    var month = now.substr(5, 2)
    var day = now.substr(8)

    showKeywords()
    $("#top5Date").text(month + "월 " + day + "일 TOP5")
})

$(window).resize(function(){
    circleSize()
    Top5Positioning()
    newsPositioning()
})