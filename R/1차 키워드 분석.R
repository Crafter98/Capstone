```{r}
install.packages("KoNLP")
```
library(KoNLP)
library(dplyr)
library(stringr)
library(RMySQL)
useNIADic() # KoNLP?—?„œ ì§€?›?•˜?Š” NIA?‚¬? „


# ?˜¤ë¥˜ë‚¬?„ ê²½ìš° ë°˜ë³µ?œ DB?—°ê²°ì„ ë§‰ê¸° ?œ„?•´ ?•„?˜ 1ì¤? ê°™ì´ ?‹¤?–‰
#dbDisconnect(con)
# DB ?—°ê²? ë°? ?‚½?…
con <- dbConnect(MySQL(),
                 user = 'user',
                 password = 'KAU',
                 #host = "125.187.32.134",
                 host = "localhost",
                 dbname = 'capstone')

dbSendQuery(con, "ALTER TABLE primary_keywords convert to charset utf8;")
dbSendQuery(con, "SET NAMES utf8;")
dbSendQuery(con, "SET CHARACTER SET utf8;")
dbSendQuery(con, "SET character_set_connection=utf8;")

secList <- list('100', '101', '102', '103', '104', '105')

for (i in secList) {
  
  df_base <- dbGetQuery(
    con,
    paste0("SELECT section, date, title FROM primary_crawling WHERE section_num = ", i, " AND date = '2021.09.02';"))
  df_base <- as.data.frame(df_base)
  
  Encoding(df_base[,1]) <- 'UTF-8'
  Encoding(df_base[,3]) <- 'UTF-8'
  
  # ?Š¹?ˆ˜ë¬¸ì, ?Š¹? • ?‹¨?–´, ?ˆ«? ? œê±?
  df_base$section <- gsub("?†ë³?", "", df_base$section)
  df_base$section <- gsub(" ", "", df_base$section)
  df_base$title <- gsub("\\d+", "", df_base$title)
  df_base$title <- gsub("?˜¤?Š˜", "", df_base$title)
  df_base$title <- str_replace_all(df_base$title, "\\W", " ")
  
  # ëª…ì‚¬ì¶”ì¶œ
  nouns <- extractNoun(df_base$title)
  # ì¶”ì¶œ?•œ ëª…ì‚¬ listë¥? ë¬¸ì?—´ ë²¡í„°ë¡? ë³€?™˜, ?‹¨?–´ë³? ë¹ˆë„?‘œ ?ƒ?„±
  wordcount <- table(unlist(nouns))
  # ?°?´?„° ?”„? ˆ?„?œ¼ë¡? ë³€?™˜
  df_keyword <- as.data.frame(wordcount, stringsAsFactors = F)
  # ë³€?ˆ˜ëª? ?ˆ˜? •
  df_keyword <- rename(df_keyword, keyword=Var1, freqeuncy=Freq)
  # ?‘ ê¸€? ?´?ƒ ?‹¨?–´ë§? ì¶”ì¶œ
  df_keyword <- filter(df_keyword, nchar(keyword) >= 2)
  # ?ƒ?œ„ 5ê°? ì¶”ì¶œ
  top5 <- df_keyword %>%
    arrange(desc(freqeuncy)) %>%
    head(5)
  # df ì¶”ê?€
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
