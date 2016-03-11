/**
 * Custom module for you to write your own javascript functions
 */
var Page = function() {

    //private functions & variables

    var initMultiimage = function() {
        $("[data-multiimage]").each(function() {
            var $el = $(this);
            if ($el.attr("multiimage-done")) {
                return;
            }

            //构造id属性
            if ($el.attr("id") == undefined) {
                $el.attr("id", "multiimage_id_" + new Date().getTime());
            }
            var name = $el.attr("name");

            //图片显示默认高宽
            var options = {
                width : '150',
                height : '150'
            };

            //data参数设定高宽
            if ($el.attr("data-multiimage-width")) {
                options.width = $el.attr("data-multiimage-width");
            }
            if ($el.attr("data-multiimage-height")) {
                options.height = $el.attr("data-multiimage-height");
            }

            //取索引属性定义
            var indexProp = $el.attr("data-index-prop");
            Util.assertNotBlank(indexProp, "缺少顺序属性设定");
            var control = $el.closest("div.controls");
            //data-multiimage类型标识：btn=最后一个添加图片按钮; edit=显示编辑图片
            var thumbnail = $('<div class="thumbnail thumbnail-' + $el.attr("data-multiimage") + '" style="float:left; margin-right: 5px; width: ' + options.width + 'px"/>').appendTo(control);
            thumbnail.append($el);
            //取当前项是否已有主键
            var pkValue = $el.attr("data-pk");
            if (pkValue) {
                //现有图片元素处理

                //构造隐藏的主键表单元素
                var $pk = $('<input type="hidden" name="' + name.substring(0, name.indexOf("]")) + '].id" />');
                $pk.val(pkValue);
                thumbnail.append($pk);

                //构造隐藏的操作表单元素
                var $op = $('<input type="hidden" name="' + name.substring(0, name.indexOf("]")) + '].extraAttributes.operation" />');
                $op.val("update");
                thumbnail.append($op);

                //构造隐藏的顺序下标表单元素
                var $idx = $('<input type="hidden" name="' + name.substring(0, name.indexOf("]")) + '].' + indexProp + '" />');
                var index = Number($el.attr("data-index-val"));
                $idx.val(index);
                //取当前多个图片元素中最小排序号，用于新增图片时确定新图片的计算相对排序号值
                var minIndex = control.attr("min-index");
                if (minIndex == undefined) {
                    minIndex = 1000;
                }
                minIndex = Number(minIndex);
                if (index < minIndex) {
                    control.attr("min-index", index);
                }
                //属性记录当前已有图片个数，用于后续计算新增图片元素的数组下标起点值
                var pkCount = control.attr("pk-count");
                if (pkCount == undefined) {
                    pkCount = 0;
                }
                control.attr("pk-count", Number(pkCount) + 1);
                thumbnail.append($idx);
            } else {
                //最后添加图片操作按钮元素处理

                //相对排序号默认从1000, 阶梯100递减
                var $idx = $('<input type="hidden"  name="' + name.substring(0, name.indexOf("]")) + '].' + indexProp + '" />');
                var minIndex = control.attr("min-index");
                if (minIndex == undefined) {
                    minIndex = 1000;
                }
                minIndex = Number(minIndex) - 100;
                control.attr("min-index", minIndex);
                $idx.val(minIndex);
                thumbnail.append($idx);

                if ($el.attr("data-multiimage") == "btn") {
                    $el.attr("disabled", true);
                    $idx.attr("disabled", true);
                }
            }

            //拖拽变更顺序后重新计算各元素下标
            var resetArrayIndex = function() {
                var pkCount = control.attr("pk-count");
                if (pkCount == undefined) {
                    pkCount = 0;
                }
                control.find("> .thumbnail-edit").each(function() {
                    var $thumbnailedit = $(this);
                    //处理新增图片元素
                    if ($thumbnailedit.find("input[name$='.id']").size() == 0) {
                        $thumbnailedit.find("input").each(function() {
                            var $input = $(this);
                            var oldName = $input.attr("name");
                            if (oldName) {
                                $input.attr("name", oldName.substring(0, oldName.indexOf("[") + 1) + pkCount + oldName.substring(oldName.indexOf("]"), oldName.length));
                            }
                        })
                        pkCount++;
                    }
                })
            }

            var addDiv = $('<div class="div-add-img" style="line-height: ' + options.height + 'px; background-color: #EEEEEE; text-align: center;"/>');
            addDiv.append('<p style="margin:0px"><button class="btn btn-large" type="button">点击上传图片</button></p>');
            var caption = $('<div class="caption" style="height: 15px;padding-top:0px;cursor: crosshair">');
            var addLi = $('<a class="btn-add pull-right" style="cursor: pointer;" title="点击上传图片"><i class="fa fa-plus"></i></a>');
            var shareLi = $('<a class="btn-view" style="cursor: pointer;"  title="查看原始图片"><i class="fa fa-picture-o"></i></a>');
            var minusLi = $('<a class="btn-remove pull-right"  style="cursor: pointer;" title="点击移除图片"><i class="fa fa-minus"></i></a>');

            var imageSrc = $el.val();
            if (imageSrc == undefined || imageSrc == "") {
                //添加图片操作元素
                addDiv.appendTo(thumbnail);
                caption.appendTo(thumbnail);
                caption.append(addLi);
            } else {
                //现有图片元素
                if (IMAGE_URL_PREFIX) {
                    thumbnail.append('<img src="' + IMAGE_URL_PREFIX + imageSrc + '" style="cursor: pointer; width: ' + options.width + 'px; height: ' + options.height + 'px;" />');
                } else {
                    thumbnail.append('<img src="' + imageSrc + '" style="cursor: pointer; width: ' + options.width + 'px; height: ' + options.height + 'px;" />');
                }
                caption.appendTo(thumbnail);
                caption.append(shareLi);
                caption.append(minusLi);
            }

            control.css("min-height", (Number(options.height) + 50) + "px");
            control.append(control.find(".thumbnail-btn"));

            var picsEditor = KindEditor.editor({
                allowFileManager : false
            });

            control.sortable({
                items : ".thumbnail",
                stop : function(event, ui) {
                    var index = 1000;
                    var $ui = $(ui.item);
                    //交换顺序后重新计算各元素顺序号值
                    $ui.parent().find("input[name$='" + indexProp + "']").each(function(idx, item) {
                        $(this).val(index);
                        index -= 100;
                    });
                }
            });

            thumbnail.delegate("div.div-add-img, a.btn-add", 'click', function() {
                picsEditor.loadPlugin('multiimage', function() {
                    picsEditor.plugin.multiImageDialog({
                        showRemote : false,
                        clickFn : function(urlList) {
                            KindEditor.each(urlList, function(i, data) {
                                var $new = $('<input type="hidden" name="' + name + '" data-multiimage="edit"  data-index-prop="' + indexProp + '" />');
                                $new.val(data.md5);
                                thumbnail.before($new);
                                initMultiimage();
                            });
                            resetArrayIndex();
                            picsEditor.hideDialog();
                        }
                    });
                });
            });

            thumbnail.delegate("img", 'click', function() {
                picsEditor.loadPlugin('image', function() {
                    picsEditor.plugin.imageDialog({
                        showRemote : false,
                        clickFn : function(url, title, width, height, border, align) {
                            var imageSrc = url;
                            if (IMAGE_URL_PREFIX) {
                                imageSrc = url.split(IMAGE_URL_PREFIX)[1];
                            }
                            $el.val(imageSrc);
                            if (thumbnail.find("img").length == 0) {
                                addDiv.hide();
                                thumbnail.prepend('<img src="' + url + '" style="cursor: pointer; width: ' + options.width + '; height: ' + options.height + ';" />');
                                caption.empty();
                                caption.append(shareLi);
                                caption.append(minusLi);
                            } else {
                                thumbnail.find("img").attr({
                                    "src" : url
                                });
                            }
                            picsEditor.hideDialog();
                        }
                    })

                })
            });

            thumbnail.delegate("a.btn-remove", 'click', function() {
                var thumbnail = $(this).closest(".thumbnail");
                //如果有主键则隐藏标记删除元素，否则直接删除DOM元素
                if (thumbnail.find("input[name$='.id']").size() > 0) {
                    thumbnail.find("input[name$='.extraAttributes.operation']").val("remove");
                    thumbnail.hide();
                } else {
                    thumbnail.remove();
                    resetArrayIndex();
                }
            });

            thumbnail.delegate("a.btn-view", 'click', function() {
                window.open(thumbnail.find("img").attr("src"), "_blank");
            });

            $el.attr("multiimage-done", true);
        });
    }

    //public functions
    return {

        //main function
        initAjaxBeforeShow : function($container) {
            //initialize here something.
            if ($container == undefined) {
                $container = $("body");
            }

            //首先隐藏全局的记忆收藏图标按钮
            $("#btn-profile-param").hide();

            //$("form :checkbox,form :radio", $container).each(function() {
            //var $uniform = $(this);
            ////if ($uniform.closest(".ui-jqgrid").length == 0) {
            //$uniform.uniform();
            //}
            //});

            initMultiimage();

            //Bootstrap Switch构造
            $('.make-switch:not(.has-switch)')['bootstrapSwitch']();

            if (jQuery().select2) {
                $('select', $container).each(function() {
                    var $select2 = $(this);
                    //始终追加一个空白选项
                    if ($select2.find(' > option[value=""]').size() == 0) {
                        var $empty = $('<option value=""></option>');
                        $select2.prepend($empty);
                    }
                    //判断是否有明确已选中项目
                    //注意不能直接使用val判断由于没有空白值会默认选中返回第一项val值
                    if ($select2.find(" > option[selected]").size() == 0) {
                        $select2.find("> option[value='']").attr("selected", true);
                    }
                    //默认支持清除，除非设置data-allowClear=false
                    var allowClear = true;
                    if ($select2.attr("data-allowClear")) {
                        if ($select2.attr("data-allowClear") == 'false') {
                            allowClear = false;
                        }
                    }
                    //取元素的placeholder属性作为select2组件的placeholder
                    var placeholder = $select2.attr("placeholder");
                    if (placeholder == undefined) {
                        placeholder = "请选择...";
                    }
                    var options = {
                        placeholder : placeholder,
                        allowClear : allowClear,
                        matcher : function(term, text) {
                            //选项文本及拼音转换查询
                            var mod = Pinyin.getCamelChars(text) + "";
                            var tf1 = mod.toUpperCase().indexOf(term.toUpperCase()) == 0;
                            var tf2 = text.toUpperCase().indexOf(term.toUpperCase()) == 0;
                            return (tf1 || tf2);
                        }
                    };
                    //combobox下拉可输入类型处理
                    if ($select2.attr("data-select2-type") == "combobox") {
                        //构造输入框组件
                        var $input = $('<input type="text" name="' + $(this).attr("name") + '"/>').insertAfter($select2);
                        if ($select2.attr("class") != undefined) {
                            $input.attr("class", $select2.attr("class"));
                        }
                        //基于下拉框组件数据构造select2组件数据
                        var selected = $select2.find("option:selected").val();
                        options = $.extend({}, options, {
                            placeholder : "请选择或输入...",
                            allowClear : true,
                            query : function(query) {
                                var data = {
                                    results : []
                                };
                                $select2.find("option").each(function() {
                                    data.results.push({
                                        id : $(this).val(),
                                        text : $(this).text()
                                    });
                                });
                                query.callback(data);
                            },
                            initSelection : function(element, callback) {
                                if (selected != undefined) {
                                    var data = {
                                        id : selected,
                                        text : selected
                                    };
                                    callback(data);
                                }
                            },
                            createSearchChoice : function(term, data) {
                                if ($(data).filter(function() {
                                    return this.text.localeCompare(term) === 0;
                                }).length === 0) {
                                    return {
                                        id : term,
                                        text : term
                                    };
                                }
                            }
                        });
                        //初始化值设置
                        $input.select2(options);
                        if (selected != undefined) {
                            $input.select2('val', [ selected ]);
                        }
                        //移除原来的select元素
                        $select2.remove();
                    } else {
                        var dataCache = $select2.attr("data-cache");
                        if (dataCache) {
                            var dataCache = eval(dataCache);
                            for ( var i in dataCache) {
                                //alert(i + ":" + dataCache[i]);
                                $select2.append("<option value='" + i + "'>" + dataCache[i] + "</option>")
                            }
                        }

                        var dataUrl = $select2.attr("data-url");
                        if (dataUrl) {
                            var val = $select2.val();
                            var dataCache = Util.getCacheSelectOptionDatas(WEB_ROOT + dataUrl);
                            for ( var i in dataCache) {
                                //alert(i + ":" + dataCache[i]);
                                if (val && val == i) {
                                    continue;
                                }
                                $select2.append("<option value='" + i + "'>" + dataCache[i] + "</option>")
                            }
                        }

                        $select2.select2(options);
                    }

                    //为组件容器设置form-control使其自适应宽度
                    var $container = $select2.parent(".controls").children(".select2-container");
                    if (!$container.hasClass("form-control")) {
                        $container.addClass("form-control");
                    }
                });
            }

            //构造tag标签项模式的输入组件
            $('input.select2tags', $container).each(function() {
                var $select2tags = $(this);
                $select2tags.select2({
                    tags : $select2tags.attr("data-tags")
                });
            });

            $('[data-profile-param]:not([data-profile-param-done])', $container).each(function() {
                var $el = $(this);
                //标记当前元素已处理过
                $el.attr("data-profile-param-done", true);

                var code = $el.attr("data-profile-param");
                //判断当前元素所属容器是否已经处理过，主要用于radio类型元素出现多次避免重复绑定
                var $controls = $el.closest(".controls");
                var controlDoneFlag = "data-profile-param-done" + code;
                if ($controls.attr(controlDoneFlag)) {
                    return;
                }
                $controls.attr(controlDoneFlag, true);

                //初始化设置值: 只有id没有值即新增数据表单， 且当前元素没有默认值，才处理收藏设定参数
                var id = $el.closest("form").find("input[name='id']").val();
                var orgVal = $el.val();
                if (id.length == 0 && (orgVal == undefined || orgVal == '')) {
                    //从缓存取当前用户的配置参数
                    var initVal = Global.findUserProfileParams(code);
                    if (initVal) {
                        if ($el.is('[type="radio"]')) {
                            $controls.find('[type="radio"][value="' + initVal + '"]').attr("checked", true);
                        } else {
                            $el.val(initVal);
                            if ($el.is("select")) {
                                $el.select2();
                            }
                        }
                    }
                }

                //绑定保存数据处理逻辑
                var $btn = $("#btn-profile-param");
                $controls.add($el).mouseenter(function() {
                    //切换图标按钮显示隐藏
                    $btn.toggle();
                    //定位收藏图标按钮位置
                    $btn.position({
                        my : "right center",
                        at : "left center",
                        of : $controls
                    });
                    //基于当前鼠标所在定位元素重新绑定按钮点击事件
                    $btn.off();
                    $btn.click(function() {
                        var codes = [];
                        var postData = {};
                        //获取当前对应区域的所有记忆参数项，拼装post数据
                        //数据结构示例：codes=aaa,bbb,ccc&aaa=1&bbb=2&ccc=3
                        $controls.find("[data-profile-param]").each(function() {
                            var val;
                            var $this = $(this);
                            //radio类型取值处理
                            if ($this.is('[type="radio"]')) {
                                val = $controls.find(':checked').val();
                            } else {
                                val = $this.val();
                            }
                            var thisCode = $this.attr("data-profile-param");
                            codes.push(thisCode);
                            postData[thisCode] = val;
                        })
                        postData['codes'] = codes.join(",");
                        $btn.ajaxPostURL({
                            url : WEB_ROOT + "/profile/simple-param-val!doSave",
                            success : function() {
                                //服务器处理完毕后回调更新客户端缓存数据
                                $.each(codes, function(i, c) {
                                    Global.setUserProfileParams(c, postData[c]);
                                });
                                //隐藏记忆图标按钮
                                $btn.hide();
                            },
                            confirmMsg : false,
                            data : postData
                        });
                    });
                })
            })

            /**
             * 日期选取组件：'.date-picker'
             * @param data-timepicker 布尔值标识是否支持时分选取
             */
            $('.date-picker', $container).each(function() {
                var $datapicker = $(this);
                var $el = $datapicker.find(" > .form-control");
                //如果设置了readonly或disabled直接返回
                if ($el.attr("readonly") || $el.attr("disabled")) {
                    return;
                }
                //如果元素有data-timepicker=true则表示还支持时间时分选取
                var timeInput = $el.attr("data-timepicker");
                if (BooleanUtil.toBoolean(timeInput)) {
                    //年月日时分选取
                    $el.datetimepicker({
                        autoclose : true,
                        format : 'yyyy-mm-dd hh:ii:ss',
                        todayBtn : true,
                        language : 'zh-CN',
                        minuteStep : 10
                    });
                } else {
                    //年月日选取
                    $datapicker.datepicker({
                        language : 'zh-CN',
                        autoclose : true
                    });
                }
                //fix bug when inline picker is used in modal
                $('body').removeClass("modal-open");
            });

            /**
             * 日期区间段选取组件：'input.input-daterangepicker'
             */
            $('input.input-daterangepicker', $container).each(function() {
                var $daterangepicker = $(this);
                //参数叠加：$.fn.daterangepicker.defaults在global.js中全局初始化
                var options = $.extend(true, $.fn.daterangepicker.defaults, $daterangepicker.attr("data-daterangepicker"));
                $daterangepicker.daterangepicker(options, function(start, end) {
                    //选取完后设置当前输入元素获取焦点以便回车进行查询
                    $daterangepicker.focus();
                });
                //取消默认的焦点获取弹出选取组件，仅保留以点击事件弹出
                $daterangepicker.off("focus");
            });

            $('table[data-dynamic-table]', $container).each(function() {
                var $dynamicTable = $(this);
                var options = $dynamicTable.data("dynamicTableOptions");
                $(this).dynamictable(options);
            });

            /**
             * tooltips组件: .control-label[data-tooltips]
             * 目前主要用在表单元素提示信息显示
             * @param data-tooltipster-position 控制显示位置，默认top
             */
            $('.control-label[data-tooltips]', $container).each(function() {
                var $el = $(this);
                //基于tooltipster插件
                var $tips = $('<span class="glyphicon glyphicon-exclamation-sign tooltipster" title="' + $el.attr("data-tooltips") + '"></span>').appendTo($el);
                var position = "top";
                //日期类型默认在右侧显示避免和日期选取互相遮挡
                if ($el.find("[data-rule-date]").length > 0) {
                    position = "right";
                }
                //用户定义显示位置
                if ($el.attr("data-tooltipster-position")) {
                    position = $el.attr("data-tooltipster-position");
                }
                $tips.tooltipster({
                    contentAsHTML : true,
                    offsetY : 15,
                    theme : 'tooltipster-punk',
                    position : position
                })
            });

            //为包含maxlength属性的textarea添加基于jquery maxlength的最大输入提示效果
            $('textarea[maxlength]', $container).maxlength({
                limitReachedClass : "label label-danger",
                alwaysShow : true
            });

            //树形选取组件
            $('input[data-toggle="treeselect"]', $container).each(function() {
                var $el = $(this);
                $el.treeselect();
            })

            //下拉选取组件
            $('[data-toggle="dropdownselect"]', $container).each(function() {
                var $dropdown = $(this);
                //添加删除图标
                var $clear = $('<i class="fa fa-times"></i>').insertBefore($dropdown);
                //下拉或收起效果图标
                var $toggle = $('<i class="fa fa-angle-double-down btn-toggle"></i>').insertBefore($dropdown);
                var $elems = $dropdown.parent().children();
                $elems.wrapAll('<div class="input-icon right"></div>');

                //点击清除图标，把当前元素所属父元素下面所有元素置空
                $clear.click(function() {
                    $elems.val("");
                })

                $dropdown.attr("autocomplete", "off");

                //默认把弹出容器插入当前所属主标签面板，后续点击就直接显示
                var $parent = $dropdown.closest(".panel-content");
                var $container = $('<div class="container-dropdownselect container-callback" style="display : none;background-color: white;border: 1px solid #CCCCCC;"></div>');
                if ($parent.size() > 0) {
                    $container.appendTo($parent);
                } else {
                    $container.appendTo($("body"));
                }

                //设置最小宽度，避免数据显示拥挤错位
                if ($dropdown.attr("data-minWidth")) {
                    $container.css("min-width", $dropdown.attr("data-minWidth"))
                }

                //收起展开图标点击事件处理
                $dropdown.add($dropdown.parent().find("i.btn-toggle")).click(function() {

                    //基于当前元素位置信息设置弹出容器的定位
                    var parentOffsetLeft = 0;
                    var parentOffsetTop = 0;
                    if ($parent.size() > 0) {
                        parentOffsetLeft = $parent.offset().left;
                        parentOffsetTop = $parent.offset().top;
                    }
                    var offset = $dropdown.offset();
                    $container.css({
                        width : $dropdown.outerWidth(),
                        position : 'absolute',
                        left : (offset.left - parentOffsetLeft) + "px",
                        top : (offset.top - parentOffsetTop) + $dropdown.outerHeight() + "px"
                    });

                    //把元素定义的回调处理搬迁到容器数据对象中
                    $container.data("callback", $dropdown.data("data-dropdownselect-callback"));
                    $container.slideToggle("fast");

                    //点击切换图标样式
                    var $btnToggle = $dropdown.parent().find("i.btn-toggle");
                    if ($btnToggle.hasClass("fa-angle-double-down")) {
                        $btnToggle.removeClass("fa-angle-double-down");
                        $btnToggle.addClass("fa-angle-double-up");
                    } else {
                        $btnToggle.addClass("fa-angle-double-down");
                        $btnToggle.removeClass("fa-angle-double-up");
                    }

                    //如果容器为空，则初始化加载url页面内容；否则就是直接显示之前已加载界面
                    if ($container.is(":empty")) {
                        var url = $dropdown.attr("data-url");
                        if ($dropdown.attr("data-selected")) {
                            if (url.indexOf("?") > -1) {
                                url = url + "&selected=" + $dropdown.attr("data-selected");
                            } else {
                                url = url + "?selected=" + $dropdown.attr("data-selected");
                            }
                        }
                        $container.ajaxGetUrl(url);
                    }
                });

                //全局鼠标事件处理，如果点击弹出区域之外则隐藏弹出区域
                $(document).on("mousedown", function(e) {
                    var $el = $dropdown.parent("div");
                    if (!($el.is(e.target) || $el.find(e.target).length || $container.is(e.target) || $container.find(e.target).length)) {
                        $container.hide();
                    }
                })
            });

            $("[data-htmleditor='kindeditor']").each(function() {
                var $kindeditor = $(this);
                var height = $kindeditor.attr("data-height");
                if (height == undefined) {
                    height = "500px";
                }
                KindEditor.create($kindeditor, {
                    allowFileManager : false,
                    width : '100%',
                    height : height,
                    minWidth : '200px',
                    minHeight : '60px',
                    afterBlur : function() {
                        this.sync();
                    }
                });
            });

            $('.tabbable > .nav > li > a[href="#tab-auto"]').each(function() {
                var $link = $(this);
                var $tabbable = $link.closest(".tabbable");
                var idx = $tabbable.children(".nav").find('li:not(.tools)').index($link.parent("li"));

                var $tabPane = $tabbable.children(".tab-content").find("div.tab-pane").eq(idx);
                var tabid = "tab-" + new Date().getTime() + idx;
                $tabPane.attr("id", tabid);
                $link.attr("href", "#" + tabid);
            });

            $('.tabbable > .nav[data-active-index]').each(function() {
                var $nav = $(this);
                var idx = $nav.attr("data-active-index");
                if (idx == undefined || idx == '') {
                    return;
                }
                var curActiveIdx = $nav.find("li:not(.tools)").index($nav.find("li.active"));
                if (idx != curActiveIdx) {
                    $nav.find("li:not(.tools):eq(" + idx + ") > a").click();
                }
            });

            $('a.x-editable').each(function() {
                var $edit = $(this);
                var url = $edit.attr("data-url");
                if (url == undefined) {
                    url = $edit.closest("form").attr("action");
                }
                var pk = $edit.attr("data-pk");
                if (pk == undefined) {
                    pk = $edit.closest("form").find("input[name='id']").val();
                }
                var title = $edit.attr("data-original-title");
                if (title == undefined) {
                    title = '数据修改';
                }
                var placement = $edit.attr("data-placement");
                if (placement == undefined) {
                    placement = 'top';
                }
                Util.assertNotBlank(url);
                Util.assertNotBlank(pk);
                $edit.editable({
                    url : url,
                    pk : pk,
                    title : title,
                    placement : placement,
                    params : function(params) {
                        params.id = pk;
                        params[params.name] = params.value;
                        return params;
                    },
                    validate : function(value) {
                        var required = $edit.attr("data-required");
                        if (required == 'true') {
                            if ($.trim(value) == '') {
                                return '数据不能为空';
                            }
                        }
                    },
                    success : function() {
                        if ($edit.hasClass("editable-bpm-task-transfer")) {
                            $("#layout-nav .btn-close-active").click();
                            $(".ajaxify-tasks").ajaxGetUrl($(".ajaxify-tasks").attr("data-url"));
                        }
                    }
                });
            });

            $("[data-singleimage]").each(function() {
                var $el = $(this);
                if ($el.attr("singleimage-done")) {
                    return;
                }

                if ($el.attr("id") == undefined) {
                    $el.attr("id", "singleimage_id_" + new Date().getTime());
                }

                var options = {
                    width : '150px',
                    height : '150px'
                };

                if ($el.attr("data-singleimage-width")) {
                    options.width = $el.attr("data-singleimage-width");
                }
                if ($el.attr("data-singleimage-height")) {
                    options.height = $el.attr("data-singleimage-height");
                }

                var control = $el.closest("div.form-group").children("div");
                var thumbnail = $('<div class="thumbnail" style=" width: ' + options.width + '"/>').appendTo(control);

                var addDiv = $('<div class="div-add-img" style="line-height: ' + options.height + '; background-color: #EEEEEE; text-align: center;"/>');
                addDiv.append('<p><button class="btn btn-large" type="button">点击上传图片</button></p>');
                var caption = $('<div class="caption" style="height: 15px;padding-top:0px">');
                var addLi = $('<a class="btn-add pull-right" style="cursor: pointer;" title="点击上传图片"><i class="fa fa-plus"></i></a>');
                var shareLi = $('<a class="btn-view" style="cursor: pointer;"  title="查看原始图片"><i class="fa fa-picture-o"></i></a>');
                var minusLi = $('<a class="btn-remove pull-right"  style="cursor: pointer;" title="点击移除图片"><i class="fa fa-minus"></i></a>');

                var imageSrc = $el.val();
                if (imageSrc == undefined || imageSrc == "") {
                    addDiv.appendTo(thumbnail);
                    caption.appendTo(thumbnail);
                    caption.append(addLi);
                } else {
                    if (IMAGE_URL_PREFIX) {
                        thumbnail.append('<img src="' + IMAGE_URL_PREFIX + imageSrc + '" style="cursor: pointer; width: ' + options.width + '; height: ' + options.height + ';" />');
                    } else {
                        thumbnail.append('<img src="' + imageSrc + '" style="cursor: pointer; width: ' + options.width + '; height: ' + options.height + ';" />');
                    }
                    caption.appendTo(thumbnail);
                    caption.append(shareLi);
                    caption.append(minusLi);
                }

                var picsEditor = KindEditor.editor({
                    allowFileManager : false
                });

                thumbnail.delegate("div.div-add-img, a.btn-add , img", 'click', function() {
                    picsEditor.loadPlugin('image', function() {
                        picsEditor.plugin.imageDialog({
                            showRemote : false,
                            clickFn : function(url, title, width, height, border, align) {
                                var imageSrc = url;
                                if (IMAGE_URL_PREFIX) {
                                    imageSrc = url.split(IMAGE_URL_PREFIX)[1];
                                }
                                $el.val(imageSrc);
                                if (thumbnail.find("img").length == 0) {
                                    addDiv.hide();
                                    thumbnail.prepend('<img src="' + url + '" style="cursor: pointer; width: ' + options.width + '; height: ' + options.height + ';" />');
                                    caption.empty();
                                    caption.append(shareLi);
                                    caption.append(minusLi);
                                } else {
                                    thumbnail.find("img").attr({
                                        "src" : url
                                    });
                                }
                                picsEditor.hideDialog();
                            }
                        })

                    })
                });

                thumbnail.delegate("a.btn-remove", 'click', function() {
                    $el.val("");
                    thumbnail.find("img").remove();
                    if (thumbnail.find("div.div-add-img").length == 0) {
                        thumbnail.prepend(addDiv);
                    } else {
                        addDiv.show();
                    }
                    caption.empty();
                    caption.append(addLi);
                });

                thumbnail.delegate("a.btn-view", 'click', function() {
                    window.open(thumbnail.find("img").attr("src"), "_blank");
                });

                $el.attr("singleimage-done", true);
            });

            $('a.btn-fileinput-trigger', $container).each(function() {
                var $btn = $(this);
                var pk = $btn.attr("data-pk");
                var category = $btn.attr("data-category");
                var readonly = $btn.attr("data-readonly");
                if (pk && pk.trim() != "") {
                    var url = $btn.attr("data-url");
                    $btn.ajaxJsonUrl(Util.AddOrReplaceUrlParameter(url, "id", pk), function(response) {
                        var $table = $('<table role="presentation" class="table table-striped table-filelist clearfix"><tbody class="files"></tbody></table>').insertAfter($btn);
                        var $tbody = $table.find("tbody.files");
                        $tbody.append(tmpl("template-download", response));
                        if (BooleanUtil.toBoolean(readonly)) {
                            $tbody.find("td.td-op").remove();
                            $btn.remove();
                        }
                    });
                }
                if (!BooleanUtil.toBoolean(readonly)) {
                    var $hidden = $('<input type="hidden" name="_attachment_' + category + '"  value="" />').insertBefore($btn);
                }
            });

            //Handles scrollable contents using jQuery SlimScroll plugin.
            $('.scroller', $container).each(function() {
                var height;
                if ($(this).attr("data-height")) {
                    height = $(this).attr("data-height");
                } else {
                    height = $(this).css('height');
                }
                $(this).slimScroll({
                    size : '7px',
                    color : ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#a1b2bd'),
                    railColor : ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#333'),
                    position : 'right',
                    height : height,
                    alwaysVisible : ($(this).attr("data-always-visible") == "1" ? true : false),
                    railVisible : ($(this).attr("data-rail-visible") == "1" ? true : false),
                    wheelStep : 5,
                    disableFadeOut : true
                });
            });

            //Handle Hower Dropdowns
            $('[data-hover="dropdown"]', $container).dropdownHover();

            $('div.ajaxify', $container).each(function() {
                $(this).ajaxGetUrl($(this).attr("data-url"), $(this).data("success"));
                //$(this).bind("reload", function() {
                //$(this).ajaxGetUrl($(this).attr("data-url"),
                //$(this).data("success"));
                //})
            });
        },

        initAjaxAfterShow : function($container) {
            //initialize here something.

            if ($container == undefined) {
                $container = $("body");
            }

            //默认没有type属性的button是submit，导致不需要的表单的提交
            $('button:not([type])', $container).each(function() {
                $(this).attr("type", "button");
            });

            $('.form-body .row', $container).each(function() {
                var maxHeight = 0;
                var $rowcols = $(this).find(" > div > .form-group > div, > .form-group > div");

                $rowcols.each(function() {
                    var height = $(this).innerHeight();
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                });
                $rowcols.css('min-height', maxHeight);
            });

            $(".chart-plot", $container).each(function() {
                $(this).plot();
            });

            $(".full-calendar", $container).each(function() {
                $(this).fullCalendar($(this).data("fullCalendarOptions"));
            });

            $(".gmaps-baidu", $container).each(function() {
                var $el = $(this);
                var id = $el.attr("id");
                if (id == undefined) {
                    id = "map_baidu_id_" + new Date().getTime();
                    $el.attr("id", id);
                }

                //百度地图初始化
                var map = new BMap.Map(id);
                map.centerAndZoom("北京市", 12);

                map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
                map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
                map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件

                //创建地址解析器实例
                var myGeo = new BMap.Geocoder();

                $el.bind("mapLocate", function(event, location) {
                    myGeo.getPoint(location, function(point) {
                        if (point) {
                            //同步经纬度坐标
                            map.clearOverlays();//清除所有覆盖物
                            map.panTo(point);
                            var marker = new BMap.Marker(point); //创建标注
                            map.addOverlay(marker); //将标注添加到地图中
                            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                            return point;
                        }
                    }, "北京市");
                });

                var initLocation = $el.attr("data-init-location");
                if (initLocation && initLocation != "") {
                    setTimeout(function() {
                        $el.trigger("mapLocate", initLocation);
                    }, 2000)
                }

                //用户点击地图 同步 详细地址、搜索框、经纬度
                map.addEventListener("click", function(e) {
                    var point = e.point;
                    myGeo.getLocation(point, function(rs) {
                        var addComp = rs.addressComponents;//结构化地址描述
                        rs.fullAddress = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                        $el.trigger("mapClick", rs);
                    });
                });
            });

        },

        //some helper function
        doSomeStuff : function() {
            myFunc();
        }

    };

}();

/*******************************************************************************
 * Usage
 ******************************************************************************/
//Custom.init();
//Custom.doSomeStuff();
