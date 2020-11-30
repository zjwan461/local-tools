import requests
import time
import json
import dbutil


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
        response = requests.post("https://news.baidu.com/sn/api/feed_feedlist", data=data)
        print(json.dumps(response.json()))
        return response.json()

    def load_toutiao_news(self):
        data = {
            "tag": "__all__",
            "ac": "wap",
            "count": 20,
            "format": "json_raw",
            "as": "A1A5FFCC538AB5B",
            "cp": "5FC37A8BA5FB4E1",
            # "min_behot_time": "1606658898",
            "_signature": "GPYXZgAARznhDf9pA0CbQBj2F3",
            "i": "1606646151"
        }

        now = time.time().__str__().replace(".", "")[0: 10]
        data.setdefault("min_behot_time", now)
        response = requests.get("https://m.toutiao.com/list/", params=data)
        print(json.dumps(response.json()))
        return response.json()

    def load_cache(self):
        f = open("storage/cache.json", "r")
        cache_str = f.read()
        return json.loads(cache_str)

    def save_cache(self, cache):
        f = open("storage/cache.json", "w")
        f.write(json.dumps(cache))

    def ts_trans(self, param):
        op = param.get("option")
        source = param.get("first")
        connection = dbutil.get_connection()
        cursor = connection.cursor()
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
        cursor.close()
        connection.close()
        return result


if __name__ == '__main__':
    res = Api().ts_trans(param={"option": "1", "first": "苏"})
    print(res)
