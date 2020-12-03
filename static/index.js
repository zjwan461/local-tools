window.addEventListener('pywebviewready', function () {
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
            if (id == '1' && $("#news-list").children().length == 0) {
                loadNewsData();
            } else if (id == '2' && $("#news-list2").children().length == 0) {
                loadNewsData2();
            } else if (id == '3') {
                finishLoading()
            } else if (id == '4' && $("#post-content").children().length == 0) {
                loadPostCode({})
            } else if (id == '5') {
                finishLoading()
            }
            saveCacheTab(id);

        });

        $("#ran-gen5").on('click', function () {
            loadCarTestData(50);
        });

        $("#ran-gen10").on('click', function () {
            loadCarTestData(100);
        });

        $("#ran-gen").on('click', function () {
            let num = $("#car-test-num").val();
            if (!num || num <= 0) {
                layer.msg("输入的题数必须大于0", {icon: 5});
                return false;
            }
            loadCarTestData(num);
        });

        function loadCarTestData(num) {
            startLoading();
            $("#car-test-content").children().remove();
            pywebview.api.get_car_test_data(num).then(response => {
                // alert(typeof response)
                finishLoading();
                $.each(response, function (index, item) {
                    // alert(index)
                    $("#car-test-content").append(`
                        <div class="layui-card">
                            <div class="layui-card-body">
                                ` +
                        item[0] + "," + item[1] + "<br>" + genOptions(item) + genImg(item) + `<button class="show-answer layui-btn layui-btn-xs layui-btn-warm">查看解析</button>` + genAnalysis(item)
                        + `
                            </div>
                        </div>
                    `)
                });

                $(".show-answer").on('click', function () {
                    $(this).next().removeClass('layui-hide')
                });

            }).catch(err => {
                finishLoading();
                layer.msg("you know, shit happens; error : " + JSON.stringify(err), {icon: 5});
            })
        }

        function genAnalysis(obj) {
            let result = `<div class="layui-hide">
                    正确答案是：` + obj [2] + `<br>
                    <strong>解析：</strong><div class="layui-text">` + obj[7] + `</div>
                </div>
            `;
            return result;

        }

        function genImg(obj) {
            let result = "";
            if (obj[8]) {
                result = `<img src='` + obj[8] + `' /><br>`
            }

            return result;
        }

        function genOptions(obj) {
            result = "";
            // return obj[3] + "&nbsp;&nbsp; 2," + obj[4] + "&nbsp;&nbsp;3," + obj[5] + "&nbsp;&nbsp;4," + item[6]
            num = 1;
            $.each(obj, function (index, item) {
                if (index >= 3 && index < 7 && item) {
                    result += "(" + num + "), " + item + "<br>";
                    num++;
                }
            });
            return result;
        }

        function loadPostCode(param) {
            startLoading();
            $("#post-content").children().remove()
            pywebview.api.get_post_data(param).then(response => {
                if (response) {
                    $.each(response, function (index, item) {
                        let row = '<tr>';
                        let tmp = '';
                        $.each(item, function (idx, i) {
                            tmp += '<td>' + i + '</td>';
                        })
                        row = row + tmp + '</tr>';
                        $("#post-content").append(row)
                    })
                } else {
                    let row = `<p style="text-align='center' class='layui-text' "> no data found </p>`;
                    $("#post-content").parent().parent().append(row);
                }
                finishLoading();
            }).catch(err => {
                finishLoading();
                layer.msg("you know, shit happens; error : " + JSON.stringify(err), {icon: 5});
            })
        }

        $("#search").on('click', function () {
            let request_obj = {
                'province': $("#province").val(),
                'city': $("#city").val(),
                'area': $("#area").val(),
                'post_code': $("#post_code").val(),
                "area_code": $("#area_code").val()
            }
            loadPostCode(request_obj)
        })

        $("#reset").on('click', function () {
            loadPostCode({})
        })

        document.getElementById("fre").onclick = function () {
            loadNewsData();
        };

        document.getElementById("fre2").onclick = function () {
            loadNewsData2();
        };

        $("#query").on('click', function () {
            let option = $("#option").val();
            let first = $("#first").val();
            if (!first) {
                layer.msg("未填写必填栏位", {icon: 5});
                $("#first").focus();
                return false;
            }

            let request_obj = {"option": option, "first": first};
            // alert(JSON.stringify(request_obj))
            pywebview.api.ts_trans2(request_obj).then(response => {
                // alert("response")
                if (response) {
                    $("#second").val(response)
                }
            }).catch(err => {
                layer.msg("you know, shit happens; error : " + JSON.stringify(err), {icon: 5})
            })

        });

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
            }).catch(err => {
                layer.msg("you know, shit happens; error : " + JSON.stringify(err), {icon: 5})
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

            }).catch(err => {
                finishLoading();
                layer.msg("you know, shit happens; error : " + JSON.stringify(err), {icon: 5})
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
            }).catch(err => {
                finishLoading();
                layer.msg("you know, shit happens; error : " + JSON.stringify(err), {icon: 5})
            });
        }
    });
})