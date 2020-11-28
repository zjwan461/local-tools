import webview
import api


def load_index():
    f = open("static/index.html")
    return f.read()


js_api = api.Api()
window = webview.create_window("小工具", js_api=js_api, html=load_index(), width=1000, height=600, confirm_close=True,
                               text_select=True)

if __name__ == '__main__':
    webview.start()
