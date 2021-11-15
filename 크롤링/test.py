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

engine = create_engine("mysql+mysqldb://user:KAU@125.187.32.134:3306/capstone", encoding='utf-8')
conn = engine.connect()

sql = "update temp2 set reactWord = 'qwerty' where reactWord = 'ㅇㅇ' "
engine.execute(sql)
# with engine.begin() as conn:
#   conn.execute(sql)

# comments_info = {
#     "keyword": keyword,
#     "comments": comments,
#     "date": date,
#     "section": section,
#     "idx": idx,
#     "react": 0
# }
#
# comment_list.append(comments_info)
#
# df = pd.DataFrame(comment_list)
# df.columns = ['keyword', 'comments', 'date', 'section', 'idx', 'react', 'reactWord']
# df.to_sql(name='secondary_crawling', con=engine, if_exists='append', index = False)

https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=100&listType=title&date=20211104&page=1
