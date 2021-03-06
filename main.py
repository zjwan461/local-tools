import webview
import api
from flask import Flask, render_template

server = Flask(__name__, static_folder="static", template_folder="template")


@server.route("/")
def index():
    return render_template("index.html")


js_api = api.Api()
window = webview.create_window("小工具", server, js_api=js_api, width=1200, height=650, confirm_close=True,
                               text_select=True)

if __name__ == '__main__':
    webview.start(http_server=True)
