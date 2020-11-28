import requests
import time
import json


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
        print(response.json())
        return response.json()

    def load_cache(self):
        f = open("storage/cache.json", "r")
        cache_str = f.read()
        return json.loads(cache_str)

    def save_cache(self, cache):
        f = open("storage/cache.json", "w")
        f.write(json.dumps(cache))


if __name__ == '__main__':
    # print(time.time().__str__().replace(".", "")[0: 13])
    Api().load_news()
