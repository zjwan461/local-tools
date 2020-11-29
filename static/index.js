window.addEventListener('pywebviewready', function () {
    var init = 0;
    var that = this;

    layui.use(['element', 'jquery', 'layer'], function () {
        var $ = layui.$;
        var element = layui.element;
        var layer = layui.layer;

        function finishLoading() {
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
        //监听Tab切换
        element.on('tab(tab)', function () {
            let id = this.getAttribute('lay-id');
            if (id == '1') {
                loadNewsData();
                init++
            } else if (id == '2') {
                loadNewsData2();
                init++
            }
            saveCacheTab(id)

        });

        document.getElementById("fre").onclick = function () {
            loadNewsData();
        };

        document.getElementById("fre2").onclick = function () {
            loadNewsData2();
        };

        function loadCacheTab() {
            pywebview.api.load_cache().then(response => {
                if (response) {
                    let current_tab = response.current_tab;
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
            startLoading();
            pywebview.api.load_news().then(response => {
                finishLoading();
                if (response.errno != 0) {
                    layer.msg(response.errmsg);
                    return false;
                }
                $("#news-list").html('')
                let data = response.data;
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

        function loadNewsData2() {
            startLoading();
            pywebview.api.load_toutiao_news().then(response => {
                finishLoading();
                if (response && response.data) {
                    $("#news-list2").html('')
                    let data = response.data;
                    $.each(data, function (index, item) {
                        $("#news-list2").append(`
                            <div class="layui-card">
                                <div class="layui-card-body">
                                  <strong style="font-size: large"><span class="url-to" target="_blank" href="` + item.url + `">` + item.title + ` </span></strong><br>
                                  ` + loadImages(item) + `
                                  <div class="layui-text">` + item.media_info.name + `</div>
                                </div>
                            </div>
                            `)
                    })


                    function loadImages(obj) {
                        let res = "";
                        if (obj && obj.image_url) {
                            res += `
                                    <img src="` + obj.image_url + `" alt="" width="30%;">
                                `;
                        } else if (obj && obj.large_image_url) {
                            res += `
                                    <img src="` + obj.large_image_url + `" alt="" width="30%;">
                                `;
                        } else if (obj && obj.image_list.length > 0) {
                            $.each(obj.image_list, function (index, item) {
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
                }
            });
        }
    });
})