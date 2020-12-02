import pymysql
import config

dbConfig = config.get_db_config()


def get_connection():
    connection = pymysql.Connect(dbConfig.get_url(), dbConfig.get_username(), dbConfig.get_password(),
                                 dbConfig.get_database())
    return connection
