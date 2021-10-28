var now

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
function positioning(){
    var maxWidth = $(window).width()
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
        // console.log(data)
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

    location.href = "http://localhost/웹/test.html"
    // location.href = "125.187.32.134:8080/웹/main.html"
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

$(document).ready(function(){
    circleSize()
    positioning()
    now = setNow()

    $(window).scroll(function(){
        if($(this).scrollTop() > 400){
            $('#Top').fadeIn()
        }
        else {
            $('#Top').fadeOut()
        }
    })
    now = "2021-09-01"
    
    var month = now.substr(5, 2)
    var day = now.substr(8)

    showKeywords()
    $("#top5Date").text(month + "월 " + day + "일 TOP5")
})

$(window).resize(function(){
    circleSize()
    positioning()
})