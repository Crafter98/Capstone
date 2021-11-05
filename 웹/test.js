var cur, now, section

function showKeywords(){
    var dateChange = cur.replace(/-/gi, '.')
    $.ajax({
        url: "keywords.php",
        type: "post",
        data: {date : dateChange,
                section : section},
    }).done(function(data) {
        data = $.parseJSON(data)
        var idx = 1, keyword = sessionStorage.getItem('keyword')

        if(data != null){
            var keys = Object.keys(data)
            for(var i = 0; i < keys.length; i++){
                var key = keys[i]
                $(".result.keyword" + (i + 1)).html(data[key])
                if(data[key] == keyword){
                    idx = i + 1
                }
            }
            ClickKeyword($(".result.keyword" + idx))
        }
        else{
            for(var i = 0; i < 5; i++){
                $(".result.keyword" + (i + 1)).html("키워드" + (i + 1))
            }
        }
    })
}

// 키워드 클릭했을 때 색 바꾸고 결과 띄우는 함수
function ClickKeyword(target){
    var keyword = $(target).text()
    sessionStorage.setItem('keyword', keyword) // 키워드 바뀔 때마다 storage 갱신
    $(".result").css("color", "black")
    $(target).css("color", "red")
    $("#DBKeyword").text(keyword)

    dateChange = $("#currentDate").text().replace(/-/gi, '.')
    $.ajax({
        url: "relatedWords.php",
        type: "post",
        data: {date : dateChange,
            keyword : keyword },
        }).done(function(data) {
            $('#relatedWordsTable').html(data);
            $(".grid.result2").css("visibility", "visible")

            var y = $(".grid.result2").offset().top
            // $("html, body").animate({scrollTop: y - 40}, 500)
    });
}

// 날짜 변경 버튼 활성화 / 비활성화 함수
function btnActive(){ $("#tom").removeAttr("disabled");}
function btnInActive(){ $("#tom").attr("disabled", "disabled");}

function toEnglish(str){
    if(str == "정치"){
        return "#politic"
    }
    else if(str == "경제"){
        return "#economy"
    }
    else if(str == "사회"){
        return "#social"
    }
    else if(str == "생활/문화"){
        return "#lifeCulture"
    }
    else if(str == "세계"){
        return "#global"
    }
    else if(str == "IT/과학"){
        return "#science"
    }
}

// 카테고리 버튼 활성화/비활성화 색 변경 함수
function activateButton(){
    btn = toEnglish(section)
    $(btn).css("background-color", "#F4B183")
    // $(btn).css("background-color", "#8497B0")
}
function inactivateButton(btn){
    btn = toEnglish(section)
    $(btn).css("background-color", "#8497B0")
    // $(btn).css("background-color", "#89BDE4")
}

function setPosition(){
    // #detail 위치 가운데로
    var width = $(".category").width()
    var padding = $(".category").css("padding-left").replace(/[^-\d\.]/g, '')
    width = width + padding * 2
    $("#detail").css("margin-left", width + "px")
    $("#yes").css("margin-left", width + "px")

    // 메달을 wrapper 정 가운데에 위치시키기
    width = ($(".wrapper").width() - 70) / 2
    $(".medal").css("margin-left", width)

    // 1차 키워드 높이 80%만큼으로 지정하기
    var height = $(window).height() * 0.8
    $(".result1").css("height", height)

    // 단상 아래로 내리기
    $(".wrapper").css("margin-top", height * 0.15)

    // top banner만큼 result1 내리기
    height = $("#date").innerHeight() - 46.4
    $(".main").css("margin-top", height + "px")

    height = $("#date").height()
    $("#selectedKeyword").css("height", height)
}

// <, > 버튼 클릭했을 때 날짜 바꾸는 코드
function moveDate(str){
    cur = new Date(cur)
    if(str == '+'){ cur.setDate(cur.getDate() + 1)}
    else{ cur.setDate(cur.getDate() - 1)}
    cur = dateToString(cur)
    if(cur == now){ btnInActive()}
        
    $("#currentDate").text(cur)
    $('#datePicker').datepicker().datepicker("setDate", cur)
    sessionStorage.setItem('date', cur) // 날짜 바뀔 때마다 storage 갱신
    showKeywords()
}

function categoryClick(str){
    inactivateButton()
    section = str
    sessionStorage.setItem('section', section) // 분야 바뀔 때마다 storage 갱신

    activateButton()
    showKeywords()
}

function setChartSize(){
    var width = $(".grid.result3").width()
    $("#chart").css("width", width * 0.7)
}

$.datepicker.setDefaults({
    showOn: 'button',
    buttonImage: "image/calender.png",
    maxDate : -1,

    dateFormat: 'yy-mm-dd',
    prevText: '이전 달',
    nextText: '다음 달',
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    showMonthAfterYear: true,
    yearSuffix: '년'
})

$(document).ready(function(){
    setPosition()
    // setChartSize()
    now = setNow()
    cur = now // now = 오늘 날짜, cur = 현재 선택된 날짜

    section = sessionStorage.getItem('section')
    cur = sessionStorage.getItem('date')

    $("#currentDate").text(cur)
    // btnInActive();
    showKeywords()
    activateButton()

    $('#datePicker').datepicker().datepicker("setDate", cur)

    $('#datePicker').change(function(){
        cur = dateToString($('#datePicker').datepicker("getDate"))
        $("#currentDate").text(cur)
        sessionStorage.setItem('date', cur) // 날짜 바뀔 때마다 storage 갱신
        showKeywords()
    })
})

$(window).resize(function(){
    setPosition()
    // setChartSize()
})