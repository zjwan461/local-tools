import webview
import api
from flask import Flask, render_template
from logutil import Logger

server = Flask(__name__, static_folder="static", template_folder="template")
logger = Logger("main")


@server.route("/")
def index():
    return render_template("index.html")


@server.errorhandler(Exception)
def error_handle(e):
    logger.error(e)
    return ','.join(e.args)


@server.errorhandler(404)
def page_not_found(e):
    logger.error(e)
    return str.__str__(e.description)


js_api = api.Api()
window = webview.create_window("小工具", server, js_api=js_api, width=1000, height=600, confirm_close=True,
                               text_select=True)

if __name__ == '__main__':
    webview.start(http_server=True)
