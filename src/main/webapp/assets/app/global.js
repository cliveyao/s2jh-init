/**
 * Custom module for you to write your own javascript functions
 */
var Global = function() {

    // private functions & variables

    var userProfileParamsCache;

    // public functions
    return {

        // main function
        init : function() {
            // initialize here something.

            //global settings 

            //设置弹出box的缺省语言参数
            if (bootbox) {
                bootbox.setDefaults({
                    "locale" : "zh_CN"
                });
            }

            //设置日期区间选取组件的默认参数
            $.fn.daterangepicker.defaults = {
                opens : (App.isRTL() ? 'left' : 'right'),
                startDate : moment().subtract('days', 29),
                endDate : moment(),
                //minDate : '01/01/2012',
                //maxDate : '12/31/2014',
                dateLimit : {
                    days : 365
                },
                showDropdowns : true,
                showWeekNumbers : true,
                timePicker : false,
                timePickerIncrement : 1,
                timePicker12Hour : true,
                ranges : {
                    '今天' : [ moment(), moment() ],
                    '昨天' : [ moment().subtract('days', 1), moment().subtract('days', 1) ],
                    '最近一周' : [ moment().subtract('days', 6), moment() ],
                    '未来一周' : [ moment(), moment().add('days', 6) ],
                    '最近一月' : [ moment().subtract('days', 29), moment() ],
                    '未来一月' : [ moment(), moment().add('days', 29) ],
                    '最近一季度' : [ moment().subtract('days', 89), moment() ],
                    '本月' : [ moment().startOf('month'), moment().endOf('month') ],
                    '上月' : [ moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month') ]
                },
                buttonClasses : [ 'btn' ],
                applyClass : 'green',
                cancelClass : 'default',
                format : 'YYYY-MM-DD',
                separator : ' ～ ',
                locale : {
                    applyLabel : '确定',
                    fromLabel : '从',
                    toLabel : '到',
                    customRangeLabel : '自由选取',
                    daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                    monthNames : [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
                    firstDay : 1
                }
            };

            //检测浏览器是否为移动设备类型
            (function(a) {
                (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
                        .test(a)
                        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
                                .test(a.substr(0, 4))
            })(navigator.userAgent || navigator.vendor || window.opera);

            //x-editable插件默认控制参数
            if ($.fn.editable) {
                //$.fn.editable.defaults.mode = 'inline';
                $.fn.editable.defaults.inputclass = 'form-control';
            }

            $(window).resize(function() {
                //窗口大小变更后更新表格组件宽度
                if ($.fn.jqGrid) {
                    Grid.refreshWidth();
                }
            });

            //toastr消息提醒参数初始化设置
            toastr.options = {
                tapToDismiss : false,
                closeButton : true,
                positionClass : 'toast-bottom-right',
                extendedTimeOut : 600000
            };

            //解锁表单提交事件处理
            $("#form-unlock").submit(function(e) {
                e.preventDefault();
                //提交密码验证，通过后隐藏解锁界面
                $(this).ajaxPostForm({
                    success : function() {
                        $("body").data('backstretch').destroy();
                        $("#page-lock").hide();
                        $(".page-container,.header,.footer").fadeIn(2000);
                        $(this).find("input[name='password']").val("");
                        $("#btn-dashboard").click();
                    },
                    confirmMsg : false
                });
                return false;
            })

            //注销登录按钮处理
            $('#a-logout').click(function() {
                bootbox.confirm("确认注销登录吗？", function(result) {
                    if (result) {
                        window.location.href = 'j_spring_security_logout';
                    }
                });
            });

            //修改密码点击事件
            $('#trigger_passwd').click(function(e) {
                //弹出修改密码对话框
                $(this).popupDialog({
                    size : 'auto'
                });
                e.preventDefault();
                return false;
            });

            //菜单快速过滤导航
            var menuLinks = $('.page-sidebar .menu-root li > a.ajaxify');
            //对每个菜单元素转换设置拼音属性值
            $.each(menuLinks, function() {
                var $link = $(this);
                $link.attr("data-py", makePy($link.text()));
            })
            $('.sidebar-search input[name="search"]').autocomplete({
                autoFocus : true,
                source : function(request, response) {
                    return response(menuLinks.map(function() {
                        //输入和拼音统一转换为小写进行比对
                        var term = request.term.toLowerCase();
                        var $link = $(this);
                        var name = $link.text();
                        var py = $link.attr("data-py").toLowerCase();
                        //基于输入的中文或拼音进行判断匹配显示选项
                        if (py.indexOf(term) > -1 || name.indexOf(term) > -1) {
                            return {
                                label : $.trim(name),
                                link : $link,
                                href : $link.attr("href")
                            };
                        }
                    }));
                },
                minLength : 1,
                select : function(event, ui) {
                    var item = ui.item;
                    $(this).parent().find(".submit").data("link", item.link);
                    item.link.click();
                    return true;
                }
            }).focus(function() {
                $(this).select();
            }).val("").focus();
            //右侧查询小图标点击事件处理
            $('.sidebar-search input[name="search"]').parent().find(".submit").click(function() {
                var $link = $(this).data("link");
                if ($link) {
                    $link.click();
                }
                return false;
            });

            //把MMOBILE菜单下各子菜单项目克隆到右上角移动功能快速入口下拉列表区域
            var mobileLinks = $('.page-sidebar .menu-root a[data-code="MMOBILE"]').parent().find('ul li > a.ajaxify');
            var $dropdownMenuMobile = $("#dropdown-menu-mobile");
            $.each(mobileLinks, function() {
                var $link = $(this);
                $dropdownMenuMobile.find("> .divider-menus").after($link.closest("li").clone(true));
            })

            //浏览器Back支持+左侧导航菜单项AJAX加载处理
            $.address.change(function(event) {
                App.scrollTop();
                //搜索匹配链接项
                var $a = $('.page-sidebar li > a.ajaxify[rel="address:' + event.value + '"]');

                if ($a.size() > 0) {
                    //假如搜索到则添加或激活对应面板项
                    Global.addOrActivePanel($a);

                    //重置相关菜单项的激活样式
                    var $ali = $(".page-sidebar-menu").find("li");
                    $ali.removeClass("active");
                    //$ali.removeClass("open");
                    //$ali.find(" > a > span.arrow").removeClass("open");

                    //当前菜单项的激活显示以及递归展开其父级导航节点
                    var $li = $a.parent("li");
                    $li.addClass("active");
                    var $ul = $li.closest("ul.sub-menu");
                    while ($ul.size() > 0) {
                        $ul.show();
                        var $pli = $ul.parent("li");
                        $pli.addClass("open");
                        $pli.find(" > a > span.arrow").addClass("open");
                        $ul = $pli.closest("ul.sub-menu");
                    }
                } else if (event.value == "/" || event.value == "/dashboard") {
                    //对于根路径或dashboard路径请求特殊处理
                    //如果dashboard区域没有加载过则先加载，然后显示
                    var $layoutNav = $("#layout-nav");
                    var $layoutNavContentContainer = $layoutNav.next(".tab-content");
                    var $tab_content_dashboard = $("#tab_content_dashboard");
                    if ($tab_content_dashboard.is(":empty")) {
                        $("#tab_content_dashboard").ajaxGetUrl("layout!dashboard");
                    }
                    $tab_content_dashboard.show();
                    $layoutNavContentContainer.find("> div").not($tab_content_dashboard).hide();
                    $layoutNav.find("> li:not(.btn-group)").remove();
                    $layoutNav.append('<li><i class="fa fa-home"></i> <a href="javascript:;">Dashboard</a></li>');
                } else if (event.value == "/lock") {
                    //对于lock锁定请求特殊处理
                    //背景切换动画效果
                    $.backstretch([ "assets/img/bg/1.jpg", "assets/img/bg/2.jpg", "assets/img/bg/3.jpg", "assets/img/bg/4.jpg" ], {
                        fade : 1000,
                        duration : 8000
                    });
                    //隐藏主区域内容，显示锁定区域内容
                    $(".page-container,.header,.footer").hide();
                    $("#form-unlock").find(":text").focus().val("");
                    $("#page-lock").show();
                    $("#form-unlock").find("input").first().focus();
                    //向服务器发送请求告知当前会话已经被锁定，安全过滤过滤器会拒绝业务请求
                    $("body").ajaxPostURL({
                        url : WEB_ROOT + "/layout!lock",
                        confirmMsg : false
                    });
                } else {
                    //如果不是菜单项或上述其他特殊项，则是按钮动态点击添加的内容项处理
                    var $a = $("a[rel='address:" + event.value + "']");
                    $a.attr("href", WEB_ROOT + event.value);
                    Global.addOrActivePanel($a, WEB_ROOT + event.value);
                }
            });

            //主面板标签的刷新事件
            $('div#portlet-layout > .portlet-title-layout > .tools > .reload').click(function(e) {
                Util.debug(e.target + ":" + e.type);
                var $tabs = $("div#portlet-layout").find(" > .portlet-body > .portlet-tabs");
                var $a = $tabs.find("> .nav > li.active > a");
                var $content = $tabs.find($a.attr("href"));
                var url = $a.attr("data-url");
                $content.ajaxGetUrl(url);
            });

            //双击portlet的标题区域展开或收缩显示
            jQuery('body').on('dblclick', '.portlet-title', function(e) {
                $(this).find(".tools .collapse,.tools .expand").click();
            });

            //全局表单界面取消按钮事件处理
            jQuery('body').on('click', '.btn-cancel', function(e) {
                var $closeable = $(this).closest(".tab-closable");
                if ($closeable.length > 0) {
                    $closeable.parent(".tab-content").parent().find(" > .nav li.active .close").click();
                } else {
                    var $layoutNav = $("#layout-nav");
                    var $layoutNavDropdownMenu = $layoutNav.find(" > .btn-group > ul.dropdown-menu");
                    $layoutNavDropdownMenu.find("> li.active > a > .badge").click();
                }
            });

            //全局导航条区域右侧的“关闭当前面板项”图标按钮事件
            jQuery('body').on('click', '#layout-nav >  li > .btn-close-active', function(e) {
                var $layoutNav = $("#layout-nav");
                var url = $layoutNav.next(".tab-content").find(".panel-content:visible").attr("data-url");
                var $layoutNavDropdownMenu = $layoutNav.find(" > .btn-group > ul.dropdown-menu");
                $layoutNavDropdownMenu.find("a[href='" + url + "']").find(".badge").click();
            });

            //全局导航条区域右侧的“Dashboard”图标按钮事件
            jQuery('body').on('click', '#layout-nav >  li > .btn-dashboard', function(e) {
                $.address.value("/dashboard");
            });

            //Tab组件reload按钮刷新事件
            jQuery('body').on('click', 'ul.nav > li.tools > .reload', function(e) {
                Util.debug(e.target + ":" + e.type);
                e.preventDefault();
                var $nav = $(this).closest(".nav");
                var $a = $nav.find("li.active > a");
                var $content = $nav.closest(".tabbable").find($a.attr("href"));
                if ($a.attr("data-url")) {
                    //当前标签有data-url说明是ajax方式，则刷新当前标签
                    var url = $a.attr("data-url");
                    $content.ajaxGetUrl(url, function() {
                        //触发子级标签默认项点击加载
                        $content.find(".tabbable:first > .nav > li.active > a").click();
                    });
                } else {
                    //如果没有则说明是静态tab，则尝试刷新包含的所有grid组件
                    if (jQuery().jqGrid) {
                        $content.find("table.ui-jqgrid-btable").each(function() {
                            var $grid = $(this);
                            $grid.trigger("clearToolbar");
                            var url = $grid.attr("data-url");
                            $grid.jqGrid('setGridParam', {
                                datatype : "json",
                                url : url
                            }).trigger("reloadGrid");
                        });
                    }
                }
            });

            //Portlet组件reload按钮刷新事件
            jQuery('body').on('click', '.portlet-title > .tools > .reload', function(e) {
                Util.debug(e.target + ":" + e.type);
                e.preventDefault();
                var $ajaxify = $(this).closest(".ajaxify");
                if ($ajaxify.attr("data-url")) {
                    var url = $ajaxify.attr("data-url");
                    $ajaxify.ajaxGetUrl(url);
                }
            });

            /**
             * 扩展bootstrap的tab组件支持ajax类型处理
             * @param href 三种参数模式：#abc 基本的bootstrap tab定位模式; #auto 自动基于内容区域div顺序匹配定位; url链接形式则表示点击AJAX异步加载
             * @param data-tab-disabled  主要用在添加数据时控制只有第一个标签项可用其余禁用，在第一个标签项保存后自动刷新整个Tab其余标签项可用。
             */
            // this line will remove the Previous event.
            $(document).off('click.tab.data-api');
            // This will add customized event
            $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
                Util.debug(e.target + ":" + e.type);
                e.preventDefault();
                var $a = $(this);
                //如果设置为disabled则不做处理
                if ($a.hasClass("disabled") || $a.attr("data-tab-disabled") == 'true') {
                    return false;
                }

                var href = $a.attr("href");
                //判断href是否以#号开始，如果是则为静态tab，否则进行ajax加载处理
                var reg = new RegExp("^#");
                if ($a.attr("data-url") == undefined && !reg.test(href)) {
                    //把href属性设置到data-url搬迁到data-url属性，下次则不会再次ajax加载
                    $a.attr("data-url", href);
                    //基于url hash计算tab内容区域id值
                    var contentId = "tab_content_" + Util.hashCode(href);
                    //把ajax的href属性调整为bootstrap支持的#contentId形式
                    $a.attr("href", "#" + contentId);
                    //如果组件没有内容容器区域则动态创建
                    var $contents = $a.closest("div.tabbable,div.portlet-tabs").find(" > div.tab-content");
                    if ($contents.length == 0) {
                        $contents = $('<div class="tab-content">').appendTo($a.closest("div.tabbable"));
                    }
                    //如果没有对应的内容元素，则动态创建
                    var $content = $contents.find("div#" + contentId);
                    if ($content.length == 0) {
                        $content = $('<div id="' + contentId + '" class="tab-pane active">').appendTo($contents);
                    }
                    //ajax加载页面
                    if ($content.is(":empty")) {
                        $content.ajaxGetUrl(href, function() {
                            $content.append('<div style="clear:both"></div>');
                            //触发子级标签默认项点击加载
                            $content.find(".tabbable:first > .nav > li.active > a").click();
                        });
                    }
                }
                $(this).tab('show');

                $(this).attr("click-idx", new Date().getTime());

                //更新表格组件宽度
                Grid.refreshWidth();
            });

            //左侧收起或展开菜单面板的小图标点击事件
            $('.page-sidebar, .header').on('click', '.sidebar-toggler', function(e) {
                //更新表格组件宽度
                Grid.refreshWidth();
            });

            //链接点击弹出模态对话框
            jQuery('body').on('click', 'a[data-toggle="modal-ajaxify"],a[target="modal-ajaxify"]', function(e) {
                Util.debug(e.target + ":" + e.type);
                e.preventDefault();
                $(this).popupDialog();
            });

            //全局的fileupload组件参数设置和初始化
            //其中附件上传和下载项显示以响应内容+模板渲染方式输出，详见layout-start.jsp中的template-upload和template-download模板定义
            // Initialize the jQuery File Upload widget:
            $('#fileupload').fileupload({
                // Uncomment the following to send cross-domain cookies:
                //xhrFields: {withCredentials: true},
                autoUpload : false,
                dataType : 'json',
                url : WEB_ROOT + "/sys/attachment-file!uploadMulti"
            });
            //全局的附件上传UI元素
            var $fileupload = $('#fileupload');
            var $fileinputTriggerElement = null;
            //附件上传按钮点击事件
            jQuery('body').on('click', 'a.btn-fileinput-trigger', function(e) {
                $fileinputTriggerElement = $(this);
                //附件分类属性参数处理
                var category = $fileinputTriggerElement.attr('data-category');
                if (category) {
                    $fileupload.find("input[name='attachmentName']").val("_attachment_" + category);
                }
                //清空附件列表区域
                $fileupload.find("tbody.files").empty();
            });
            //附件对话框的“添加”按钮点击事件
            jQuery('#fileupload-dialog').on('click', '.modal-footer .btn-add', function(e) {
                //触发元素对应的文件列表显示元素，如果没有则动态创建插入当前触发元素之后
                var $table = $fileinputTriggerElement.parent().find("table.table-filelist");
                if ($table.size() == 0) {
                    $table = $('<table role="presentation" class="table table-striped table-filelist clearfix"><tbody class="files"></tbody></table>').insertAfter($fileinputTriggerElement);
                }
                var $tbody = $table.find("tbody.files");
                //把上传对话框中的上传行项克隆到元素文件列表显示区域
                $('#fileupload').find("tbody.files tr.template-download").each(function() {
                    $tbody.append($(this).clone(true));
                });
                //关闭窗口
                $('#fileupload-dialog').find('.modal-footer [data-dismiss="modal"]').click();
            });

            //链接点击触发加载面板项
            jQuery('body').on('click', 'a[data-toggle="panel"],button[data-toggle="panel"]', function(e) {
                Util.debug(e.target + ":" + e.type);
                e.preventDefault();
                var $a = $(this);
                Global.addOrActivePanel($a);
            });

            //链接点击触发动态加载Tab标签项
            jQuery('body').on('click', 'a[data-toggle="dynamic-tab"]', function(e) {
                Util.debug(e.target + ":" + e.type);
                e.preventDefault();
                var $a = $(this);
                var $nav = $a.closest(".tabbable").find(" > .nav");
                var title = $a.attr("data-title");
                if (title == undefined) {
                    title = $a.text();
                }
                Global.addOrActiveTab($nav, {
                    title : title,
                    url : $a.attr("data-url")
                });
            });

            //链接或按钮点击直接触发post请求
            jQuery('body').on('click', '.btn-post-url', function(e) {
                Util.debug(e.target + ":" + e.type);
                e.preventDefault();
                var $btn = $(this);
                var url = null;
                if ($btn.is("button")) {
                    url = $btn.attr("data-url");
                } else if ($btn.is("a")) {
                    url = $btn.attr("href");
                }
                var success = $btn.data("success");
                if (success == undefined) {
                    success = function(response) {
                        //处理完成后回调刷新指定区域
                        var ajaxifyReload = $btn.attr("data-ajaxify-reload");
                        if (ajaxifyReload != 'false') {
                            $(ajaxifyReload).each(function() {
                                $(this).ajaxGetUrl($(this).attr("data-url"));
                            })
                        }
                        //或者自动关闭容器处理
                        var closeContainer = $btn.attr("data-close-container");
                        if (closeContainer != 'false') {
                            Global.autoCloseContainer($btn, response);
                        }
                    }
                }
                $btn.ajaxPostURL({
                    url : url,
                    success : success,
                    confirmMsg : $btn.attr("data-confirm")
                });
            });

            //点击表格行项联动触发对应行项复选框的选取状态更新
            jQuery('body').on('click', 'tbody.select-table-checkbox', function(e) {
                var $el = $(this).find(".table-checkbox :checkbox");
                if (!($el.is(e.target) || $el.find(e.target).length)) {
                    $el.attr("checked", !$el.is(":checked"));
                }
            });
        },

        //处理登录用户个性化配置参数缓存
        findUserProfileParams : function(key) {
            if (userProfileParamsCache == undefined || userProfileParamsCache == null) {
                userProfileParamsCache = $("body").cacheData(WEB_ROOT + "/profile/simple-param-val!params.json");
            }
            return userProfileParamsCache[key];
        },
        setUserProfileParams : function(key, val) {
            if (userProfileParamsCache == undefined || userProfileParamsCache == null) {
                userProfileParamsCache = $("body").cacheData(WEB_ROOT + "/profile/simple-param-val!params.json");
            }
            userProfileParamsCache[key] = val;
        },

        //基于当前元素按照规则自动关闭所属容器元素
        autoCloseContainer : function(target, response) {
            var $target = $(target);
            if ($target.attr("data-prevent-close") == undefined || $target.attr("data-prevent-close") == 'false') {
                var $tabbableSecondary = $target.closest(".tabbable-secondary");
                //如果没有二级所属标签
                if ($tabbableSecondary.length == 0) {
                    var $modal = $target.closest(".modal");
                    if ($modal.size() > 0) {
                        //判断如果当前是modal窗口，则隐藏当前窗口
                        $modal.modal("hide");
                    } else {
                        var $closeable = $target.closest(".tab-closable");
                        if ($closeable.length > 0) {
                            //如果当前属于可关闭tab内，则触发对应tab容器的close关闭按钮事件
                            $closeable.parent(".tab-content").parent().find(" > .nav li.active .close").click();
                        } else {
                            //再往上判断是否属于panel容器
                            var $panel = $target.closest(".panel-content");
                            var url = $panel.attr("data-url");
                            //对于工作流任务请求特殊处理：直接关闭当前panel
                            if (url.indexOf('bpm-task!show') > -1) {
                                $("#layout-nav .btn-close-active").click();
                            } else {
                                //刷新panel区域
                                $panel.ajaxGetUrl(url);
                            }
                        }
                    }
                } else {
                    //只有一个或没有二级标签，则直接关闭当前主活动标签
                    if ($tabbableSecondary.find(" > ul.nav > li").not(".tools").size() < 2) {
                        var $closeable = $target.closest(".tab-closable");
                        if ($closeable.length > 0) {
                            $closeable.parent(".tab-content").parent().find(" > .nav li.active .close").click();
                        } else {
                            $("#layout-nav .btn-close-active").click();
                        }
                    } else {
                        //有多个二级标签判断如果create操作则刷新一级活动父标签，update操作刷新当前二级活动标签
                        var id = $target.closest("form").find("input[name='id']").val();
                        if (id && id != '') {
                            $tabbableSecondary.find(" > ul.nav > li.tools > .reload").click();
                        } else {
                            var $tabbablePrimary = $target.closest(".tabbable-primary");
                            var $a = $tabbablePrimary.find(" > ul.nav > li.active > a");
                            var url = Util.AddOrReplaceUrlParameter($a.attr("data-url"), "id", response.userdata.id);
                            $a.attr("data-url", url);
                            $tabbablePrimary.find(" > ul.nav > li.tools > .reload").click();
                        }
                    }
                }
            }
        },

        // 全局的notify提示消息显示
        notify : function(type, message, title) {
            if (type == "error") {
                //如果是error类型，则设置timeOut使鼠标划过后消息一直停留
                toastr.options.timeOut = 10000; // 10秒后自动消失
                toastr.options.extendedTimeOut = 3600000; // 鼠标滑过消失时间延长为 1小时
                toastr.options.positionClass = "toast-bottom-center";
            } else {
                toastr.options.timeOut = 5000;
                toastr.options.positionClass = "toast-bottom-right";
            }
            if (title == undefined) {
                title = "";
            }
            toastr[type](message, title);
        },

        //基于触发元素添加或激活对应面板项
        addOrActivePanel : function($a, url) {
            var txt = "欢迎访问";
            if ($a.size() > 0) {
                url = $a.attr("href");
                if (url == undefined) {
                    url = $a.attr("data-url");
                }
                txt = $a.text();
            }
            var $layoutNav = $("#layout-nav");
            var $layoutNavContentContainer = $layoutNav.next(".tab-content");

            //如果对应内容元素没有则动态添加，已有则显示
            var $tabContent = $layoutNavContentContainer.find("> div[data-url='" + url + "']");
            if ($tabContent.length == 0) {
                $tabContent = $('<div data-url="' + url + '" class="panel-content"></div>').appendTo($layoutNavContentContainer);
                $tabContent.ajaxGetUrl(url);
            } else {
                $tabContent.show();
            }
            //把其余容器元素切换隐藏
            $layoutNavContentContainer.find("> div").not($tabContent).hide();

            //处理访问历史项目列表显示和点击事件
            var $layoutNavDropdownMenu = $layoutNav.find(" > .btn-group > ul.dropdown-menu");
            var $menuItem = $layoutNavDropdownMenu.find("> li > a[href='" + url + "']");
            if ($menuItem.length == 0) {
                //如果没有在下拉列表项则动态添加
                $menuItem = $('<a href="' + url + '">' + txt + '<span class="badge badge-default">X</span></a>').appendTo($layoutNavDropdownMenu).wrap('<li/>');

                //点击关闭事件处理
                $menuItem.find('.badge').click(function(evt) {
                    evt.preventDefault();

                    //检查所辖表单是否有未保存数据，如果有则让用户confirm确认是否离开页面
                    var stay = false;
                    $tabContent.find("form[method='post']:not(.form-track-disabled)[form-data-modified='true']").each(function() {
                        var $form = $(this);
                        if (!confirm("当前表单有修改数据未保存，确认离开当前表单吗？")) {
                            stay = true;
                            return false;
                        }
                    });
                    if (!stay) {
                        //如果确认删除当前项，则移除相关元素
                        $menuItem.parent("li").remove();
                        $tabContent.remove();

                        //基于计数器模式计算关闭当前元素后该切换显示那个最近显示项
                        var max = 1;
                        $layoutNavDropdownMenu.find("> li").each(function() {
                            var count = $(this).attr("count");
                            if (count) {
                                if (Number(count) > max) {
                                    max = Number(count);
                                }
                            }
                        });
                        //如果找到最后显示项则触发此项点击事件显示，否则没有则直接触发dashboard点击显示
                        var $pre = $layoutNavDropdownMenu.find("> li[count='" + max + "'] > a");
                        if ($pre.length > 0) {
                            $pre.click();
                        } else {
                            $("#layout-nav >  li > .btn-dashboard").click();
                        }
                    }
                });

                //下拉项点击事件直接调用触发对应链接的点击事件
                $menuItem.click(function(evt) {
                    evt.preventDefault();
                    //alert($a.attr("id"));
                    $a.click();
                });

                //基于左侧对应匹配的菜单项计算并刷新显示路径信息
                var menuItem = $(".page-sidebar-menu").find("a[href='" + url + "']");
                var path = '<li><a href="' + url + '" title="刷新当前页面">' + txt + '</a></li>';
                if (menuItem.length > 0) {
                    var parentSubMenu = menuItem.parent("li").parent(".sub-menu");
                    while (parentSubMenu.length > 0) {
                        var txt = parentSubMenu.prev("a").children("span.title").text();
                        path = '<li class="hidden-inline-xs"><a href="#" title="TODO">' + txt + '</a> <i class="fa fa-angle-right"></i></li>' + path;
                        parentSubMenu = parentSubMenu.parent("li").parent(".sub-menu");
                    }
                }
                path = '<li><a href="#dashboard" class="btn-dashboard"><i class="fa fa-home"></i></a></li> ' + path;
                $menuItem.data("path", path);
            }

            //点击之后取计数器最大值累加，使最后点击元素的计数器值始终最大
            var max = 1;
            $layoutNavDropdownMenu.find("> li").each(function() {
                $(this).removeClass("active");
                var count = $(this).attr("count");
                if (count) {
                    if (Number(count) > max) {
                        max = Number(count);
                    }
                }
            });
            $menuItem.parent("li").addClass("active");
            $menuItem.parent("li").attr("count", max + 1);

            $layoutNav.find("> li:not(.btn-group)").remove();
            $layoutNav.append($menuItem.data('path'));

            //对路径链接元素点击触发内容区域刷新加载
            $layoutNav.find("> li:not(.btn-group) > a[href='" + url + "']").click(function(evt) {
                evt.preventDefault();
                $tabContent.ajaxGetUrl(url);
            });
        },

        //基于触发元素添加或激活对应Tab项
        addOrActiveTab : function($nav, options) {
            var $tabs = $nav.parent("div");
            //基于url参数计算hashcode作为tab的id标识信息，以处理重复点击情况
            var tabId = "tab_" + Util.hashCode(options.url);
            var $tab = $('#' + tabId);
            //如果对应id元素没有则动态创建，如果已有则显示
            if ($('#' + tabId).length == 0) {
                var $li = $('<li><a id="' + tabId + '" data-toggle="tab" href="' + options.url + '">' + options.title
                        + ' <button class="close" type="button" style="margin-left:8px"></button></a></li>');
                $nav.append($li);
                $('#' + tabId).click();
                var $content = $nav.parent().find($li.find("a").attr("href"));
                $content.addClass("tab-closable");
                $li.find(".close").click(function() {
                    //检查所辖表单是否有未保存数据
                    var stay = false;
                    $content.find("form[method='post']:not(.form-track-disabled)[form-data-modified='true']").each(function() {
                        var $form = $(this);
                        if (!confirm("当前表单有修改数据未保存，确认离开当前表单吗？")) {
                            stay = true;
                            return false;
                        }
                    });
                    if (!stay) {
                        $content.remove();
                        $li.remove();
                        //查找最后点击的Tab选中
                        var idx = 0;
                        var $links = $nav.find("li:not(.tools) > a");
                        $links.each(function() {
                            var clickIdx = $(this).attr("click-idx");
                            if (clickIdx && Number(clickIdx) > idx) {
                                idx = Number(clickIdx);
                            }
                        });
                        if (idx == 0) {
                            $links.first().click();
                        } else {
                            $links.filter("[click-idx='" + idx + "']").click();
                        }
                    }
                })
            } else {
                $('#' + tabId).tab("show");
            }
        }
    };
}();

/*******************************************************************************
 * Usage
 ******************************************************************************/
// Custom.init();
// Custom.doSomeStuff();
