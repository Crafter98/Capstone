import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.dialects.mysql import LONGTEXT
from bs4 import BeautifulSoup
import requests
import pandas as pd
import re
import sys
import pprint

def flatten(l):
    flatList = []
    for elem in l:
        if type(elem) == list:
            for e in elem:
                flatList.append(e)
        else:
            flatList.append(elem)
    return flatList

def sentence(l):
    string = ''
    for elem in l:
        if type(elem) == list:
            for e in elem:
                string = string + ' ' + str(e)
        else:
            string = string + ' ' + str(elem)
    return string

engine = create_engine("mysql+mysqldb://user:KAU@localhost:3306/capstone", encoding='utf-8')
# engine = create_engine("mysql+mysqldb://user:KAU@125.187.32.134:3306/capstone", encoding='utf-8')
conn = engine.connect()

# 1차 키워드 날짜 설정해서 가져오기
sql = "SELECT * FROM primary_keywords WHERE date = '2021.10.01' ORDER BY section;"  #### WHERE절 안의 날짜는 어떻게 자동화할 것인가
result = engine.execute(sql).fetchall()

# 제목에 키워드가 있는 뉴스의 링크를 가져와서 댓글 크롤링 진행, 저장
for data in result:
    keyword = data['keyword']
    date = data['date']
    section = data['section']

    sql2 = "SELECT url FROM primary_crawling WHERE date = '" + date + "' AND title LIKE '%%" + keyword + "%%' AND section LIKE '" + section + "%%';"
    urls = engine.execute(sql2).fetchall()

    List = []
    allComments = []
    idx = 1
    # 한 키워드와 관련된 모든 뉴스 기사의 댓글 크롤링
    for u in urls:
        url = str(u['url'])
        print(url)

        oid = url.split("oid=")[1].split("&")[0]  # 422
        aid = url.split("aid=")[1]  # 0000430957
        page = 1
        header = {
            "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            "referer": url,
        }

        while True:
            c_url = "https://apis.naver.com/commentBox/cbox/web_neo_list_jsonp.json?ticket=news&templateId=default_society&pool=cbox5&_callback=jQuery1707138182064460843_1523512042464&lang=ko&country=&objectId=news" + oid + "%2C" + aid + "&categoryId=&pageSize=20&indexSize=10&groupId=&listType=OBJECT&pageType=more&page=" + str(
                page) + "&refresh=false&sort=FAVORITE"
            # 파싱하는 단계
            r = requests.get(c_url, headers=header)
            cont = BeautifulSoup(r.content, "html.parser")
            total_comm = str(cont).split('comment":')[1].split(",")[0]

            match = re.findall('"contents":([^\*]*),"userIdNo"', str(cont))
            # 댓글을 리스트에 중첩
            List.append(match)
            # 한번에 댓글이 20개씩 보이기 때문에 한 페이지씩 몽땅 댓글을 긁어 옵니다.
            if int(total_comm) <= ((page) * 20):
                break
            else:
                page += 1

        # allComments = sentence(List)
        allComments = flatten(List)

    comment_list = []
    for comments in allComments:
        comments_info = {
            "keyword": keyword,
            "comments": comments,
            "date": date,
            "section": section,
            "idx": idx
        }

        comment_list.append(comments_info)
        idx = idx + 1

    if len(comment_list) == 0:
        comment_list = [{
            "keyword": keyword,
            "comments": "",
            "date": date,
            "section": section,
            "idx": idx
        }]

    df = pd.DataFrame(comment_list)
    df.columns = ['keyword', 'comments', 'date', 'section', 'idx']
    df.to_sql(name='temp', con=engine, if_exists='append', index = False)

    print(keyword, "save")
