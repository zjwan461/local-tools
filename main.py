import webview
import api
from flask import Flask, url_for, render_template

server = Flask(__name__, static_folder="static", template_folder="template")


@server.route("/")
def index():
    return render_template("index.html")


# def load_index():
#     f = open("static/index.html")
#     return f.read()


js_api = api.Api()
window = webview.create_window("小工具", server, js_api=js_api, width=1000, height=600, confirm_close=True,
                               text_select=True)

if __name__ == '__main__':
    webview.start(http_server=True)
