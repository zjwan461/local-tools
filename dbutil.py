import pymysql
import json

f = open(file="storage/config.json", mode="r")
conf = f.read()
db_dic = json.loads(conf).get("db")


def get_connection():
    connection = pymysql.Connect(db_dic.get("url"), db_dic.get("username"), db_dic.get("password"),
                                 db_dic.get("database"))
    return connection
