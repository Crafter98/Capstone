library(KoNLP)
library(dplyr)
library(stringr)
library(RMySQL)
library(arules)
useNIADic() # KoNLP에서 지원하는 NIA사전
useSejongDic()


# 오류났을 경우 반복된 DB연결을 막기 위해 아래 1줄 같이 실행
dbDisconnect(con)
# DB 연결 및 삽입
con <- dbConnect(MySQL(),
                 user = 'user',
                 password = 'KAU',
                 host = "125.187.32.134",
                 dbname = 'capstone')
dbSendQuery(con, "ALTER TABLE secondary_keywords convert to charset utf8;")
dbSendQuery(con, "SET NAMES utf8;")
dbSendQuery(con, "SET CHARACTER SET utf8;")
dbSendQuery(con, "SET character_set_connection=utf8;")

df_base <- dbGetQuery(
  con,
  "SELECT section, keyword, comments, date FROM secondary_crawling WHERE date = '2021.09.01'")
df_base <- as.data.frame(df_base)

Encoding(df_base[,1]) <- 'UTF-8'
Encoding(df_base[,2]) <- 'UTF-8'
Encoding(df_base[,3]) <- 'UTF-8'
Encoding(df_base[,4]) <- 'UTF-8'

# 특수문자, 특정 단어, 숫자 제거
df_base$comments <- gsub(" ", "", df_base$comments)
df_base$comments <- gsub("\\n", "", df_base$comments)
df_base$comments <- gsub('\\"', "", df_base$comments)
df_base$comments <- gsub("\\d+", "", df_base$comments)
df_base$comments <- gsub("ㅋ", "", df_base$comments)
df_base$comments <- gsub("[A-Za-z]", "", df_base$comments)
df_base$comments <- str_replace_all(df_base$comments, "\\W", " ")

idx <- 1

for (i in 1:nrow(df_base)) {
  
  df_base$comments[i] <- gsub(df_base$keyword[i], "", df_base$comments[i])
  
  words <- function(doc){
    doc <- as.character(doc)
    doc2 <- paste(SimplePos22(doc))
    doc3 <- str_match(doc2, "([가-힣]+)/(PA|PV)")
    doc4 <- doc3[,2]
    doc4[!is.na(doc4)]
  }
  # 명사추출
  nouns <- extractNoun(as.character(df_base$comments[i]))
  # 추출한 명사 list를 문자열 벡터로 변환, 단어별 빈도표 생성
  wordcount <- table(unlist(nouns))
  # 데이터 프레임으로 변환
  df_comments <- as.data.frame(wordcount, stringsAsFactors = F)
  # 변수명 수정
  df_comments <- rename(df_comments, rel_word=Var1, freqeuncy=Freq)
  # 두 글자 이상 단어만 추출
  df_comments <- filter(df_comments, nchar(rel_word) >= 2)
  # 상위 5개 추출
  top5 <- df_comments %>%
    arrange(desc(freqeuncy)) %>%
    head(5)
  # df 추가
  top5$section <- df_base$section[i]
  top5$keyword <- df_base$keyword[i]
  top5$date <- df_base$date[1]
  
  sec <- top5$section
  keyword <- top5$keyword
  rel_word <- top5$rel_word
  fre <- top5$freqeuncy
  react <- 0
  date <- top5$date
  
  j <- 1
  for (w in rel_word) {
    if (w=="")
      break
    dbSendQuery(
      con,
      paste0("INSERT INTO secondary_keywords VALUES ('", sec[j], "', '", keyword[j], "', '",  rel_word[j], "', ", fre[j], ", ", react, ", '", date[j], "', ", idx, ");"))
    j <- j+1
    idx <- idx+1
  }
}
dbDisconnect(con)