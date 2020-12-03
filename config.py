import json

f = open("storage/config.json", "r")
conf = f.read()
dic = json.loads(conf)
f.close()


def get_db_config():
    return DbConfig(dic.get("db"))


def get_log_config():
    return LogConfig(dic.get("log"))


class DbConfig:

    def __init__(self, kwargs: dict):
        self.url = kwargs.get("url")
        self.username = kwargs.get("username")
        self.password = kwargs.get("password")
        self.database = kwargs.get("database")

    def get_url(self):
        return self.url

    def get_username(self):
        return self.username

    def get_password(self):
        return self.password

    def get_database(self):
        return self.database


class LogConfig:

    def __init__(self, kwargs: dict):
        self.path = kwargs.get("path")

    def get_path(self):
        return self.path


class WeatherConfig:

    def __init__(self, kwargs: dict):
        self.url = kwargs.get("url")
        self.request_type = kwargs.get("request_type")
        self.city_code_type = kwargs.get("city_code_file").get("type")
        self.city_code_address = kwargs.get("city_code_file").get("address")

    def get_url(self):
        return self.url

    def get_request_type(self):
        return self.request_type

    def get_city_code_type(self):
        return self.city_code_type

    def get_city_code_address(self):
        return self.city_code_address
