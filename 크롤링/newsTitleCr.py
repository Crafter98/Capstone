import requests
import pandas as pd
import pymysql
from sqlalchemy import create_engine

pymysql.install_as_MySQLdb()
import MySQLdb

from bs4 import BeautifulSoup
import re
import datetime


headers = {
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"}


# BeautifulSoup 객체 생성
def get_soup_obj(url):
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    return soup

def dateChange(temp):
    today = datetime.datetime.now()
    num = re.sub(r'[^0-9]', '', date)
    unit = temp[-1:]
    if unit == '분':
        today = today + datetime.timedelta(minutes = -int(num))
    elif unit == '간':
        today = today + datetime.timedelta(hours = -int(num))
    elif unit == '일':
        today = today + datetime.timedelta(days = -int(num))

    return datetime.datetime.strftime(today,'%Y.%m.%d')

# DB 연결파트
############## engine 아래에 있는거로 해보고 혹시 안되면 말해줘! ##############
engine = create_engine("mysql+mysqldb://user:KAU@localhost:3306/capstone", encoding='utf-8')
# engine = create_engine("mysql+mysqldb://user:KAU@125.187.32.134:3306/capstone", encoding='utf-8')
conn = engine.connect()


# 뉴스의 기본 정보 가져오기
# 날짜별로 크롤링
############## 여기 for문에서 날짜 범위 설정하기 ##############
for a in range(20211001, 20211002):
    print(a)

    # 뉴스 섹션 (ex. 100 -> 경제)
    for sid in ['100', '101', '102', '103', '104', '105']:
        news_list = []
        idx = 1

        for i in range(1, 201):
            p = i
            sec_url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=" + sid + "&listType=title" + "&date=" + str(a) + "&page=" + str(i)
            # print("section url : ", sec_url)
            soup = get_soup_obj(sec_url)


            ####### 중복 피하려고 끝 페이지 구하는 파트 #######
            page = soup.find('div', {'class': 'paging'})
            page_a_list = page.findAll('a')
            last_page = str(page_a_list[len(page_a_list) - 1])

            if '다음' in last_page:
                pass
            elif '이전' in last_page:
                p = i - 1
            else:
                p = int(last_page[-4 - len(str(i)) : -4]) # 마지막 페이지 구함
            ####### 중복 피하려고 끝 페이지 구하는 파트 #######


            try:
                li_list = soup.find('div', class_="list_body newsflash_body").find_all("li")
            except AttributeError as err:
                print(err)
            else:
                for li in li_list:
                    try:
                        news_section = soup.find(class_="list_header newsflash_header2")
                        section = news_section.find('h3').get_text()
                        url = li.find('a')['href']
                        title = li.find('a').get_text()
                        date = li.find(class_='date').get_text()
                    except AttributeError as err:
                        print(err)
                    else:
                        date = date.split(" ")[0][:-1]
                        if len(date) != 10:
                            date = dateChange(date)
                        news_info = {
                            "news_section": section,
                            "news_url": url,
                            "news_date": date,
                            "title" :title,
                            "section num" :sid,
                            "idx" : idx
                        }
                        news_list.append(news_info)
                        idx += 1

            ####### 끝 페이지 도착하면 반복문 끝내고 DB 저장 #######
            if p < i:
                break

        ####### DB 저장 파트 #######
        df = pd.DataFrame(news_list)
        df.columns = ['section', 'url', 'date', 'title', 'section_num', 'idx']
        df.to_sql(name='primary_crawling', con=engine, if_exists='append', index = False)
        print(' ' + sid + ' ' + 'save')
