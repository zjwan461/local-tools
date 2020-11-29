window.addEventListener('pywebviewready', function () {
    var init = 0;
    var that = this;

    layui.use(['element', 'jquery', 'layer'], function () {
        var $ = layui.$;
        var element = layui.element;
        var layer = layui.layer;

        function finishLoading() {
            // alert("finish")
            $('.loading').fadeOut();//让loading效果消失，显示页面
            $('body').css('overflow', 'scroll');
            $('.video_box').fadeIn();
        }

        function startLoading() {
            $('.loading').fadeIn();//让loading效果消失，显示页面
            $('body').css('overflow', 'hidden');
            $('.video_box').fadeOut();
        }

        loadCacheTab();
        //监听Tab切换，以改变地址hash值
        element.on('tab(tab)', function () {
            let id = this.getAttribute('lay-id');
            // alert(id)
            // if (id == 'news') {
            //     loadNewsData();
            // }
            if (init == 0) {
                if (id == 'news') {
                    loadNewsData();
                    init++
                }
            }
            saveCacheTab(id)

        });

        document.getElementById("fre").onclick = function () {
            loadNewsData();
        };

        function loadCacheTab() {
            pywebview.api.load_cache().then(response => {
                if (response) {
                    let current_tab = response.current_tab;
                    // alert(current_tab)
                    element.tabChange('tab', current_tab)
                }
            })
        }

        function saveCacheTab(tab_id) {
            let cache = {"current_tab": tab_id.toString()}
            pywebview.api.save_cache(cache).then(response => {

            })
        }

        function loadNewsData() {
            // alert("click")
            startLoading();
            pywebview.api.load_news().then(response => {
                if (response.errno != 0) {
                    layer.msg(response.errmsg);
                    return false;
                }
                $("#news-list").html('')
                data = response.data;
                $.each(data.top, function (index, item) {
                    $("#news-list").append(`
                            <div class="layui-card">
                                <div class="layui-card-body">
                                  <strong style="font-size: large"><i class="layui-badge">热点</i><span class="url-to" title="浏览器中打开" target="_blank" href="` + item.display_url + `">` + item.abs + ` </span></strong>
                                  <div class="layui-text">` + item.site + `</div>
                                </div>
                            </div>
                            `)
                });

                $.each(data.news, function (index, item) {
                    $("#news-list").append(`
                            <div class="layui-card">
                                <div class="layui-card-body">
                                  <strong style="font-size: large"><span class="url-to" title="浏览器中打开" target="_blank" href="` + item.display_url + `">` + item.abs + ` </span></strong><br>
                                  ` + loadImages(item) + `
                                  <div class="layui-text">` + item.site + `</div>
                                </div>
                            </div>
                            `)
                });

                finishLoading();

                function loadImages(obj) {
                    let res = "";
                    if (obj && obj.imageurls.length > 0) {

                        $.each(obj.imageurls, function (index, item) {
                            res += `
                                    <img src="` + item.url + `" alt="" width="30%;">
                                `;
                        })
                    }
                    return res;
                }

                $(".url-to").hover(function () {
                    //style="cursor: pointer"
                    $(this).css('cursor', 'pointer')
                })
                $(".url-to").on('click', function () {
                    let url = $(this).attr('href');
                    // alert(url)
                    $(".layui-tab").hide();
                    // $(".layui-container").html('')
                    // $(".layui-container").css("background", "pink")
                    $(".layui-container").append(`
                            <div class="frame" style="height: 100%" >
                                <div style="padding: 20px 0">
                                    <button class="layui-btn back">返回</button>
                                </div>
                                <div style="height: 100%">
                                    <iframe src="` + url + `" frameborder="0" width="100%" height="100%"></iframe>
                                </div>
                            </div>
                        `)

                    $(".back").on('click', function () {
                        $(".layui-tab").show();
                        $(".frame").remove();
                    });
                });

            })
        }
    });
})