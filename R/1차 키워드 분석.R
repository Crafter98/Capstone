library(KoNLP)
library(dplyr)
library(stringr)
library(RMySQL)
useNIADic() # KoNLP에서 지원하는 NIA사전


# 오류났을 경우 반복된 DB연결을 막기 위해 아래 1줄 같이 실행
#dbDisconnect(con)
# DB 연결 및 삽입
con <- dbConnect(MySQL(),
                 user = 'user',
                 password = 'KAU',
                 host = "125.187.32.134",
                 dbname = 'capstone')
dbSendQuery(con, "ALTER TABLE primary_keywords convert to charset utf8;")
dbSendQuery(con, "SET NAMES utf8;")
dbSendQuery(con, "SET CHARACTER SET utf8;")
dbSendQuery(con, "SET character_set_connection=utf8;")

secList <- list('100', '101', '102', '103', '104', '105')

for (i in secList) {
  
  df_base <- dbGetQuery(
    con,
    paste0("SELECT section, date, title FROM primary_crawling WHERE section_num = ", i, " AND date = '2021.09.01';"))
  df_base <- as.data.frame(df_base)
  
  Encoding(df_base[,1]) <- 'UTF-8'
  Encoding(df_base[,3]) <- 'UTF-8'
  
  # 특수문자, 특정 단어, 숫자 제거
  df_base$section <- gsub("속보", "", df_base$section)
  df_base$section <- gsub(" ", "", df_base$section)
  df_base$title <- gsub("\\d+", "", df_base$title)
  df_base$title <- gsub("오늘", "", df_base$title)
  df_base$title <- str_replace_all(df_base$title, "\\W", " ")
  
  # 명사추출
  nouns <- extractNoun(df_base$title)
  # 추출한 명사 list를 문자열 벡터로 변환, 단어별 빈도표 생성
  wordcount <- table(unlist(nouns))
  # 데이터 프레임으로 변환
  df_keyword <- as.data.frame(wordcount, stringsAsFactors = F)
  # 변수명 수정
  df_keyword <- rename(df_keyword, keyword=Var1, freqeuncy=Freq)
  # 두 글자 이상 단어만 추출
  df_keyword <- filter(df_keyword, nchar(keyword) >= 2)
  # 상위 5개 추출
  top5 <- df_keyword %>%
    arrange(desc(freqeuncy)) %>%
    head(5)
  # df 추가
  top5$section <- df_base$section[1]
  top5$date <- df_base$date[1]
  
  word <- top5$keyword
  sec <- top5$section
  date <- top5$date
  fre <- top5$freqeuncy
  
  j <- 1
  for (w in word) {
    if (w=="")
      break
    dbSendQuery(
      con,
      paste0("INSERT INTO primary_keywords VALUES ('", word[j], "', '", sec[j], "', '",  date[j], "', '", fre[j], "');"))
    j <- j+1
  }
}
dbDisconnect(con)