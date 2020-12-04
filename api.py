import os
import requests
import time
import json
import dbutil
from zhconv import convert
from logutil import Logger
import config

logger = Logger("Api.py")


class CityObj:
    def __init__(self, id: int, pid: int, city_code, city_name, post_code, area_code, c_time):
        self.id = id
        self.pid = pid
        self.city_code = city_code
        self.city_name = city_name
        self.post_code = post_code
        self.area_code = area_code
        self.c_time = c_time

    def set_children(self, children: list):
        self.children = children

    def get_children(self):
        return self.children

    def get_id(self):
        return self.id

    def get_pid(self):
        return self.pid

    def get_city_code(self):
        return self.city_code

    def get_city_name(self):
        return self.city_name

    def get_post_code(self):
        return self.post_code

    def get_area_code(self):
        return self.area_code

    def get_c_time(self):
        return self.c_time


class Api:

    def show_tips(self):
        return "today is a good day"

    def load_news(self):
        # from=news_webapp&pd=webapp&os=iphone&mid=BEC9AC3B1875C9A57C7AA57D01F92522%3AFG%3D1&ver=6&category_id=101&action=1&display_time=1606580403318&wf=0
        data = {
            "from": "news_webapp",
            "pd": "webapp",
            "os": "iphone",
            "mid": "BEC9AC3B1875C9A57C7AA57D01F92522%3AFG%3D1",
            "ver": "6",
            "category_id": "101",
            "action": "1",
            "wf": "0",
            # "display_time": "1606581461342"
        }

        now = time.time().__str__().replace(".", "")[0: 13]
        data.setdefault("display_time", now)

        try:
            response = requests.post("https://news.baidu.com/sn/api/feed_feedlist", data=data)
            logger.info("response from baidu " + json.dumps(response.json()))
            return response.json()
        except Exception as e:
            logger.error(e)
            raise e

    def load_toutiao_news(self):
        data = {
            "tag": "__all__",
            "ac": "wap",
            "count": 20,
            "format": "json_raw",
            "as": "A1257FFC978987B",
            "cp": "5FC74928D7DBDE1",
            # "min_behot_time": "0",
            "_signature": "ayqyygAANPDGPy5yaodURWsqst",
            # "i": ""
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
            "Referer": "https://m.toutiao.com/?W2atIF=1"
        }
        now = time.time().__str__().replace(".", "")[0: 10]
        data.setdefault("min_behot_time", now)
        data.setdefault("i", now)
        try:
            response = requests.get("https://m.toutiao.com/list/", params=data, headers=headers)
            logger.info(json.dumps(response.json()))
            return response.json()
        except Exception as e:
            logger.error(e)
            raise e

    def load_cache(self):
        try:
            f = open("storage/cache/cache.json", "r")
            cache_str = f.read()
            return json.loads(cache_str)
        except Exception as e:
            logger.error(e)
            raise e

    def save_cache(self, cache):
        try:
            f = open("storage/cache/cache.json", "w")
            f.write(json.dumps(cache))
        except Exception as e:
            logger.error(e)
            raise e

    def ts_trans(self, param):
        op = param.get("option")
        source = param.get("first")
        connection = dbutil.get_connection()
        cursor = connection.cursor()
        try:
            if op == '0':
                cursor.execute("select * from tb_st_data where simple = %s", source)
                rs = cursor.fetchone()
                result = rs[2]
                if not rs:
                    cursor.execute("select * from tb_st_data where tradition = %s", source)
                    rs = cursor.fetchone()
                    result = rs[1]
                if not result:
                    result = 'can not found '
            elif op == '1':
                cursor.execute("select * from tb_st_data where simple = %s", source)
                rs = cursor.fetchone()
                result = rs[2]
                if not result:
                    result = 'can not found '
            else:
                cursor.execute("select * from tb_st_data where tradition = %s", source)
                rs = cursor.fetchone()
                result = rs[1]
                if not result:
                    result = 'can not found '
            return result
        except Exception as e:
            logger.error(e)
            raise e
        finally:
            cursor.close()
            connection.close()

    def ts_trans2(self, param):
        op = param.get("option")
        source = param.get("first")
        try:
            if op == '0':
                result = convert(source, 'zh-tw')
                if source == result:
                    result = convert(source, 'zh-cn')
            elif op == '1':
                result = convert(source, 'zh-tw')
            else:
                result = convert(source, 'zh-cn')
            return result
        except Exception as e:
            logger.error(e)
            raise e

    def get_post_data(self, param: dict):
        conn = dbutil.get_connection()
        cursor = conn.cursor()
        try:
            sql = "select province, city , area,post_code , area_code from tb_post_code where 1 = 1 "
            if param:
                if param.get("province"):
                    sql += "and province like '" + param.get("province") + "%'"
                if param.get("city"):
                    sql += "and city like '" + param.get("city") + "%'"
                if param.get("area"):
                    sql += "and area like '" + param.get("area") + "%'"
                if param.get("post_code"):
                    sql += "and post_code = '" + param.get("post_code") + "'"
                if param.get("area_code"):
                    sql += "and area_code = '" + param.get("area_code") + "'"

            logger.info("select post code data: " + sql)
            cursor.execute(sql)
            rs = cursor.fetchall()
            return rs
        except Exception as e:
            logger.error(e)
            raise e
        finally:
            cursor.close()
            conn.close()

    def get_car_test_data(self, *num):
        conn = dbutil.get_connection()
        cursor = conn.cursor()
        param = 10
        if num and num[0]:
            param = num[0]
        try:
            sql = '''
                select @num:=@num+1 as row_num, a.* from 
                (
                select question,answer,item1,item2,item3,item4, explains,url from tb_car_test order by rand() limit %s
                ) a, (select @num:=0) r
            '''
            logger.info("select car test data: " + sql + ", params is " + str(param))
            cursor.execute(sql, int(param))
            rs = cursor.fetchall()
            return rs
        except Exception as e:
            logger.error(e)
            raise e

    def get_weather_data_cache(self, province, city, county):
        file_path = "storage/cache/" + province + city + county + "_weather.cache"
        if os.path.exists(file_path):
            f = open(file_path, "r")
            weather_cache = json.loads(f.read())
            for key in weather_cache.keys():
                if (time.time() - float(key)) < 60 * 15:
                    return weather_cache.get(key)
                else:
                    return None
        else:
            return None

    def get_weather_data(self, **kwargs):
        cache_data = self.get_weather_data_cache(kwargs.get("province"), kwargs.get("city"), kwargs.get("county"))
        if cache_data:
            return cache_data
        weather_conf = config.get_weather_config()
        typ = weather_conf.get_city_code_type()
        address = weather_conf.get_city_code_address()
        url = weather_conf.get_url()
        result = []
        if typ == 'file':
            f = open(address, "r", encoding="UTF-8")
            city_code_data = json.loads(f.read())
            result = self.__trans__(city_code_data)
        elif typ == 'http':
            pass

        city_code = self.__search__(result, **kwargs)
        if city_code:
            response = requests.get(url + str(city_code))
            if response.status_code == 200:
                f = open("storage/cache/" + kwargs.get("province") + kwargs.get("city") + kwargs.get(
                    "county") + "_weather.cache", "w")
                content = {time.time(): response.json()}
                f.write(json.dumps(content))
        else:
            response = " can not found city code for you position " + json.dumps(kwargs)
        return response

    def __search__(self, trans_list: list, **kwargs):
        province = kwargs.get("province")
        city = kwargs.get("city")
        county = kwargs.get("county")
        city_code = None
        for item in trans_list:
            if item.get_city_name() == province:
                for item2 in item.get_children():
                    if item2.get_city_name() == city:
                        city_code = item2.get_city_code()
                        for item3 in item2.get_children():
                            if item3.get_city_name() == county:
                                city_code = item3.get_city_code()
                                break
        return city_code

    def __trans__(self, city_code_data: list):
        arr = []
        for item in city_code_data:
            if item.get("pid") == 0:
                cb = CityObj(id=item.get("id"), pid=item.get("pid"), city_code=item.get("city_code"),
                             city_name=item.get("city_name"), post_code=item.get("post_code"),
                             area_code=item.get("area_code"), c_time=item.get("ctime"))
                cb.set_children(self.__trans2__(item.get("id"), city_code_data))
                arr.append(cb)
        return arr

    def __trans2__(self, pid: int, city_code_data: list):
        arr = []
        for item in city_code_data:
            if item.get("pid") == pid:
                cb = CityObj(id=item.get("id"), pid=item.get("pid"), city_code=item.get("city_code"),
                             city_name=item.get("city_name"), post_code=item.get("post_code"),
                             area_code=item.get("area_code"), c_time=item.get("ctime"))
                cb.set_children(self.__trans2__(item.get("id"), city_code_data))
                arr.append(cb)
        return arr


if __name__ == '__main__':
    api = Api()
    api.get_weather_data(province="安徽", city="安庆", county="太湖县")
    # print()
