/**
 * Custom module for you to write your own javascript functions
 */
var Util = function() {

    // private functions & variables

    // public functions
    return {

        //将所有树形节点递归遍历转换为平行JSON结构数据
        traverseTreeToKeyValue : function(data, kv) {
            if (kv == undefined) {
                kv = {};
            }
            $.each(data, function(i, item) {
                kv[item.id] = item.name;
                if (typeof (item.children) === 'object') {
                    Util.traverseTreeToKeyValue(item.children, kv);
                }
            });
            return kv;
        },

        /**
         * 基于缓存获取数据
         * 用此方式注意确保服务器端只返回必要的数据，而不是直接返回大量序列化数据以占用太多浏览器内存
         * @param url AJAX请求数据的URL
         * @param target 基于JQuery data缓存数据容器对象，默认为body
         */
        getCacheDatas : function(url, target, ajaxOptions) {
            if (target == undefined || target == null) {
                target = $("body");
            }
            //如果当前容器对象没有缓存数据，则初始化
            if (target.data("CacheUrlDatas") == undefined) {
                target.data("CacheUrlDatas", {});
            }
            //提前url对应的缓存数据
            var cached = target.data("CacheUrlDatas")[url];
            //如果没有缓存数据则以同步方式ajax初始化加载
            if (cached == undefined) {
                $.ajax($.extend({
                    async : false,
                    type : "GET",
                    url : url,
                    dataType : 'json',
                    success : function(data) {
                        cached = data;
                        //将服务器返回的json数据缓存记录到容器对象缓存数据集合中
                        target.data("CacheUrlDatas")[url] = cached;
                    }
                }, ajaxOptions || {}));
            }
            return cached;
        },

        /**
         * 基于缓存获取select下拉框组件需要的key-value结构数据
         * 基本原理同getCacheDatas，区别在于只缓存key-value结构数据，避免不必要的数据缓存占用内存
         */
        getCacheSelectOptionDatas : function(url, target) {
            if (target == undefined) {
                target = $("body");
            }
            if (target.data("CacheSelectOptionDatas") == undefined) {
                target.data("CacheSelectOptionDatas", {});
            }
            var cached = target.data("CacheSelectOptionDatas")[url];
            if (cached == undefined) {
                $.ajax({
                    async : false,
                    type : "GET",
                    url : url,
                    dataType : 'json',
                    success : function(data) {
                        var items = data;
                        //如果是分页结构则取分页数组数据
                        if (data.content) {
                            items = data.content;
                        }
                        //默认追加一个空白选项
                        cached = {
                            "" : ""
                        };
                        $.each(items, function(i, item) {
                            cached[item.id] = item.display;
                        })
                        target.data("CacheSelectOptionDatas")[url] = cached;
                    }
                });
            }
            return cached;
        },

        /**
         * 基于缓存获取枚举对象数据
         */
        getCacheEnumsByType : function(enumType, target) {
            if (target == undefined) {
                target = $("body");
            }
            if (target.data("CacheEnumDatas") == undefined) {
                $.ajax({
                    async : false,
                    type : "GET",
                    url : WEB_ROOT + '/pub/data!enums.json',
                    dataType : 'json',
                    success : function(data) {
                        //把所有枚举数据一次加载到缓存对象中，后续按照key获取枚举集合缓存数据
                        for ( var type in data) {
                            var enumData = data[type];
                            var mergedData = {
                                "" : ""
                            };
                            for ( var key in enumData) {
                                mergedData[key] = enumData[key];
                            }
                            data[type] = mergedData;
                        }
                        target.data("CacheEnumDatas", data);
                    }
                });
            }
            //检查确保提供的枚举值是否有效
            var cached = target.data("CacheEnumDatas")[enumType];
            if (cached == undefined) {
                alert("错误的枚举数据类型：" + enumType);
                cached = {};
            }
            return cached;
        },

        /**
         * 基于缓存获取数据字典对象数据
         * @param dataType 数据字典的类型代码
         */
        getCacheDictDatasByType : function(dataType, target) {
            if (target == undefined) {
                target = $("body");
            }
            //一次性加载所有数据字典数据到缓存
            var cacheDictDatas = target.data("CacheDictDatas");
            if (cacheDictDatas == undefined) {
                $.ajax({
                    async : false,
                    type : "GET",
                    url : WEB_ROOT + '/pub/data!dictDatas.json',
                    dataType : 'json',
                    success : function(data) {
                        cacheDictDatas = data;
                        target.data("CacheDictDatas", cacheDictDatas);
                    }
                });
            }
            //基于类型代码提前对应缓存数据
            var cached = target.data("CacheDictDatas")[dataType];
            if (cached == undefined) {
                //基于类型代码循环挑选进行分组数据准备
                var datas = {};
                //检测提供的分组代码是否有效
                var invalid = true;
                $.each(cacheDictDatas, function(i, item) {
                    if (item.parentPrimaryKey == dataType) {
                        invalid = false;
                        datas[item.primaryKey] = item.primaryValue;
                    }
                });
                cached = datas;
                target.data("CacheDictDatas")[dataType] = cached;
                if (invalid) {
                    alert("错误的数据字典类型：" + dataType);
                }
            }
            return cached;
        },

        /**
         * 前端的断言帮助方法
         */
        assert : function(condition, message) {
            if (!condition) {
                alert(message);
            }
        },

        /**
         * 前端的断言帮助方法：不为null且空白
         */
        assertNotBlank : function(val, message) {
            if (val == undefined || $.trim(val) == '') {
                Util.assert(false, message);
                return;
            }
        },

        /**
         * 前端的debug帮助方法
         */
        debug : function(msg) {
            if (window.console) {
                console.debug(msg);
            } else {
                alert(msg);
            }
        },

        /**
         * 计算字符串的HASH值
         */
        hashCode : function(str) {
            var hash = 0;
            if (str.length == 0)
                return hash;
            for (i = 0; i < str.length; i++) {
                var charCode = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + charCode;
                hash = hash & hash; // Convert to 32bit integer
            }
            if (hash < 0) {
                hash = -hash;
            }
            return hash;
        },

        /**
         * 为URL追加或替换参数，url中包含参数就替换其值，没有则追加参数
         * @return 返回处理后的url值
         */
        AddOrReplaceUrlParameter : function(url, paramname, paramvalue) {
            var index = url.indexOf("?");
            if (index == -1) {
                url = url + "?" + paramname + "=" + paramvalue;
            } else {
                var s1 = url.split("?");
                var params = s1[1].split("&");
                var pn = "";
                var flag = false;
                for (i = 0; i < params.length; i++) {
                    pn = params[i].split("=")[0];
                    if (pn == paramname) {
                        params[i] = paramname + "=" + paramvalue;
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    url = url + "&" + paramname + "=" + paramvalue;
                } else {
                    url = s1[0] + "?";
                    for (i = 0; i < params.length; i++) {
                        if (i > 0) {
                            url = url + "&";
                        }
                        url = url + params[i];
                    }
                }
            }
            return url;
        },

        /**
         * 截取start开始字符串和end结束字符串之间的字符串
         * @return 返回处理后的字符串
         */
        subStringBetween : function(source, start, end) {
            var oReg = new RegExp(start + ".*?" + end, "img");
            var oRegStart = new RegExp(start, "g");
            var oRegEnd = new RegExp(end, "g");
            return source.match(oReg).join("=").replace(oRegStart, "").replace(oRegEnd, "").split("=");
        },

        split : function(obj) {
            return obj.split(",");
        },

        /**
         * 判断数组中是否包含指定元素
         */
        isArrayContainElement : function(array, element) {
            var i = array.length;
            while (i--) {
                if (array[i] === element) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 获取dom元素不包含子元素，只提取文本内容部分
         */
        getTextWithoutChildren : function(obj) {
            return $(obj)[0].childNodes[0].nodeValue.trim();
        },

        /**
         * 获取当前元素所在form中name对应的表单元素
         */
        findClosestFormInputByName : function(el, name) {
            return $(el).closest("form").find("[name='" + name + "']");
        },

        /**
         * 如果el指定元素为空白则赋val值，如果已经有值则忽略
         */
        setInputValIfBlank : function(el, val) {
            if ($.trim($(el).val()) == '') {
                $(el).val(val);
            }
        },

        /**
         * 判断元素是否处于不可编辑状态
         */
        unEditable : function(el) {
            var $el = $(el);
            return $el.attr("readonly") || $el.attr("disabled");
        },

        /**
         * 判断字符串是否以指定字符串开头
         */
        startWith : function(str, start) {
            var reg = new RegExp("^" + start);
            return reg.test(str);
        },

        /**
         * 判断字符串是否以指定字符串结尾
         */
        endWith : function(str, end) {
            var reg = new RegExp(end + "$");
            return reg.test(str);
        },

        /**
         * JSON对象拼装转换为便于打印显示的字符串
         */
        objectToString : function(obj) {
            if (obj == undefined) {
                return "undefined";
            }
            var str = "";
            $.each(obj, function(k, v) {
                str += (k + ':' + v + ";\n");
            })
            return str;
        },

        /**
         * 解析元素值为float数字对象值，如果为空白或非数字则返回0
         */
        parseFloatValDefaultZero : function(el) {
            if ($.trim($(el).val()) == '') {
                return 0;
            } else {
                var amount = parseFloat($.trim($(el).val()));
                if (isNaN(amount)) {
                    return 0;
                } else {
                    return amount;
                }
            }
        },

        /**
         * 判断当前视窗不是小尺寸窗口
         */
        notSmallViewport : function() {
            var windowWidth = $(window).width();
            return windowWidth >= 768;
        },

        init : function() {

            $.fn.cacheData = function(url, ajaxOptions) {
                var $el = $(this);
                var $target = $("body");
                //如果当前容器对象没有缓存数据，则初始化
                if ($target.data("CacheUrlDatas") == undefined) {
                    $target.data("CacheUrlDatas", {});
                }
                //提前url对应的缓存数据
                var cached = $target.data("CacheUrlDatas")[url];
                //如果没有缓存数据则以同步方式ajax初始化加载
                if (cached == undefined) {
                    var $block = $el.closest("div");
                    $.ajax($.extend({
                        async : false,
                        type : "GET",
                        url : url,
                        dataType : 'json',
                        success : function(data) {
                            cached = data;
                            //将服务器返回的json数据缓存记录到容器对象缓存数据集合中
                            $target.data("CacheUrlDatas")[url] = cached;
                        }
                    }, ajaxOptions || {}));
                }
                return cached;
            }

            /**
             * 图表组件构造原型方法定义
             */
            $.fn.plot = function(opts) {
                var $el = $(this);
                if ($el.attr("chart-plot-done")) {
                    return;
                }
                $el.attr("chart-plot-done", true);

                $el.css('min-height', '100px');

                var plotOptions = $.extend({}, $el.data("plotOptions") || {}, opts || {})

                var items = plotOptions.data;
                var options = plotOptions.options;

                $.each(items, function(i, item) {
                    if (typeof item.data === 'function') {
                        item.data = item.data.call($el);
                    }
                });
                options = $.extend(true, {
                    pointhover : true,
                    series : {
                        lines : {
                            show : true,
                            lineWidth : 2,
                            fill : true,
                            fillColor : {
                                colors : [ {
                                    opacity : 0.05
                                }, {
                                    opacity : 0.01
                                } ]
                            }
                        },
                        points : {
                            show : true
                        },
                        shadowSize : 2
                    },
                    grid : {
                        hoverable : true,
                        clickable : true,
                        tickColor : "#eee",
                        borderWidth : 0
                    },
                    colors : [ "#d12610", "#37b7f3", "#52e136" ],
                    xaxis : {
                        timezone : "browser",
                        monthNames : [ "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月" ]
                    }
                }, options);
                $.plot($el, items, options);

                //鼠标旋停支持，显示提示信息
                if (plotOptions.pointhover) {
                    var $plothoverTooltip = $("#plothoverTooltip");
                    if ($plothoverTooltip.size() == 0) {
                        $plothoverTooltip = $("<div id='plothoverTooltip'></div>").css({
                            position : 'absolute',
                            display : 'none',
                            border : '1px solid #333',
                            padding : '4px',
                            color : '#fff',
                            'border-radius' : '3px',
                            'background-color' : '#333',
                            opacity : 0.80,
                            'min-width' : '50px',
                            'text-align' : 'center'
                        }).appendTo("body");
                    }

                    $el.bind("plothover", function(event, pos, item) {
                        if (item) {
                            var y = item.datapoint[1];
                            $plothoverTooltip.html(y).css({
                                top : item.pageY,
                                left : item.pageX + 15
                            }).fadeIn(200);
                        } else {
                            $plothoverTooltip.hide();
                        }
                    });
                }

            },

            /**
             * 条码扫描支持组件构造原型方法定义
             */
            $.fn.barcodeScanSupport = function(opts) {
                var $el = $(this);
                if ($el.attr("barcode-scan-support-done")) {
                    return this;
                }
                $el.attr("barcode-scan-support-done", true);

                var id = $el.attr("id");
                //生成随机id属性，用于外部扫描接口扫描值回传回调元素定位
                if (id == undefined) {
                    id = "barcode_" + new Date().getTime();
                    $el.attr("id", id);
                }

                if ($el.attr("placeholder") == undefined) {
                    $el.attr("placeholder", "支持条码扫描输入;可手工输入按回车键模拟");
                }
                if ($el.attr("title") == undefined) {
                    $el.attr("title", $el.attr("placeholder"));
                }

                $el.focus(function(event) {
                    //获取到焦点选择全部文本，以便连续扫描录入
                    $el.select();
                }).click(function(event) {
                    //点击事件，检测如果浏览器支持扫描设备则启动外部扫描设备
                    if (window.wst) {
                        window.wst.startupBarcodeScan(id);
                    }
                }).keydown(function(event) {
                    if (opts && opts.onEnter) {
                        //回车事件，调用用户指定的回车处理方法
                        if (event.keyCode === 13) {
                            opts.onEnter.call($el);
                        }
                    }
                }).bind('barcode', function(event, data) {
                    //绑定自定义barcode事件，此事件由外部扫描接口回调并传入扫描到的条码值
                    $el.val(data);
                    var e = jQuery.Event("keydown");//模拟一个键盘事件 
                    e.keyCode = 13;//keyCode=13是回车 
                    $el.trigger(e);//模拟页码框按下回车 
                    $el.select();
                });
            },

            /**
             * 基于zTree封装下拉树形结构数据选取组件构造原型方法定义
             * @param data-url AJAX请求URL地址，返回zTree结构的JSON数据
             * @param data-position 基于jQuery UI position的位置参数
             */
            $.fn.treeselect = function(opts) {
                var $elem = $(this);
                if ($elem.attr("treeselect-done")) {
                    return this;
                }
                $elem.attr("treeselect-done", true);

                //如果元素处于不可编辑状态则直接返回
                if (Util.unEditable($elem)) {
                    return this;
                }

                opts = $.extend({
                    url : $elem.attr("data-url"),
                    position : $elem.attr("data-position")
                }, $elem.data("treeOptions") || {}, opts);

                //生成id属性以便与tree组件交互
                var id = "treeselect_" + new Date().getTime();
                $elem.attr("id", id);
                var $treeDisplayScope = $elem.closest(".panel-content");

                //构造下拉容器及图标按钮
                var $toggle = $('<i class="fa fa-angle-double-down btn-toggle"></i>').insertBefore($elem);
                var $elems = $elem.parent().children();
                $elems.wrapAll('<div class="input-icon right"></div>');
                var $dropdownZtreeContainer = $('<div style="z-index: 990; display: none; position: absolute; background-color: #FFFFFF; border: 1px solid #DDDDDD"></div>');
                $dropdownZtreeContainer.appendTo($treeDisplayScope);

                //树形选取工具条
                var toolbar = [];
                toolbar.push('<div role="navigation" class="navbar navbar-default" style="border: 0px; margin:0px">');
                toolbar.push('<div class="collapse navbar-collapse navbar-ex1-collapse" style="padding: 0">');
                toolbar.push('<form role="search" class="navbar-form navbar-left">');
                toolbar.push('<div class="form-group" style="border-bottom: 0px">');
                toolbar.push('<input type="text" name="keyword" class="form-control input-small">');
                toolbar.push('</div>');
                toolbar.push('<button class="btn blue" type="submit">查询</button>');
                toolbar.push('</form>');
                toolbar.push('<ul class="nav navbar-nav navbar-right">');
                toolbar.push('<li><a href="javascript:;" class="btn-open-all" style="padding-left: 0">展开</li>');
                toolbar.push('<li><a href="javascript:;" class="btn-close-all" style="padding-left: 0">收拢</a></li>');
                toolbar.push('<li><a href="javascript:;" class="btn-clear" style="padding-left: 0;padding-right: 20px">清除</a></li>');
                toolbar.push('</ul>');
                toolbar.push('</div>');
                toolbar.push('</div>');
                var $toolbar = $(toolbar.join("")).appendTo($dropdownZtreeContainer);

                var $treeContainer = $('<div style="max-height: 300px;overflow: auto"></div>').appendTo($dropdownZtreeContainer);

                //ztree元素
                var $ztree = $('<ul class="ztree"></ul>').appendTo($treeContainer);
                $ztree.attr("id", "ztree_" + id);
                $ztree.attr("id-for", id);
                $ztree.attr("data-url", opts.url);

                //默认的节点点击事件回调方法
                //基本规则：显示元素name值为XXX.display，并对应提供逐渐主键设置元素XXX.id
                var treeNodeClickDefaultCallback = function(treeNode) {
                    //取当前.display显示元素，以及对应的隐藏.id元素
                    var elName = $elem.attr("name");
                    var idName = elName.replace(".display", ".id");
                    var rowdata = {};
                    if (treeNode) {
                        //“-”开头标识根节点，则把元素置空
                        rowdata[elName] = Util.startWith(treeNode.id, "-") ? "" : treeNode.name;
                        rowdata[idName] = Util.startWith(treeNode.id, "-") ? "" : treeNode.id;
                    } else {
                        //如果treeNode为空则置空处理
                        rowdata[elName] = "";
                        rowdata[idName] = "";
                    }
                    //如果元素所属表格组件，则尝试自动回调赋值
                    var $grid = $elem.closest('.ui-jqgrid-btable');
                    if ($grid.size() > 0) {
                        //检测自动匹配的id元素在grid中是否有定义
                        var cmExists = false;
                        var cm = $grid.jqGrid('getGridParam', 'colModel');
                        for (var i = 0; i < cm.length; i++) {
                            var c = cm[i];
                            if (c.name == idName || c.index == idName) {
                                cmExists = true;
                                break;
                            }
                        }
                        if (!cmExists) {
                            alert("页面配置错误： " + elName + " 对应的id属性 " + idName + " 未定义");
                            return;
                        }
                        $grid.jqGrid("setEditingRowdata", rowdata);
                    } else {
                        //表单类型自动处理
                        if ($elem.closest('.form-group').size() > 0) {
                            var $form = $elem.closest("form");
                            $form.setFormDatas(rowdata, true);
                        }
                    }
                    //元素获取焦点，便于回车处理
                    $elem.focus();
                }

                $elem.click(function() {
                    var cached = $elem.attr("treeselect-cached-done");
                    if (cached == undefined) {
                        //点击触发AJAX数据加载并缓存
                        $elem.attr("treeselect-cached-done", true);
                        //加载状态设置
                        $elem.attr("disabled", true);
                        $elem.addClass("spinner");
                        //AJAX同步加载数据
                        var data = $elem.cacheData(opts.url);
                        //基于AJAX返回数据构造树形组件
                        $.fn.zTree.init($ztree, {
                            callback : {
                                onClick : function(event, treeId, treeNode) {
                                    //如果参数提供了点击回调则调用指定回调方法，没有则调用默认处理函数
                                    if (opts.callback && opts.callback.onSingleClick) {
                                        var ret = opts.callback.onSingleClick.call(this, event, treeId, treeNode);
                                        //如果用户方法返回false则保留组件显示，否则隐藏
                                        if (ret == undefined || ret == true) {
                                            $dropdownZtreeContainer.hide();
                                            $toggle.removeClass("fa-angle-double-up");
                                            $toggle.addClass("fa-angle-double-down");
                                        }
                                    } else {
                                        //调用默认处理函数
                                        treeNodeClickDefaultCallback(treeNode);
                                        //默认隐藏选取区域
                                        $dropdownZtreeContainer.hide();
                                        $toggle.removeClass("fa-angle-double-up");
                                        $toggle.addClass("fa-angle-double-down");
                                    }
                                    $elem.trigger("treeselect.nodeSelect", [ treeNode ]);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                        }, data);
                        $elem.removeAttr("disabled");
                        $elem.removeClass("spinner");
                    }

                    var zTree = $.fn.zTree.getZTreeObj($ztree.attr("id"));
                    //清空之前选取节点
                    zTree.cancelSelectedNode();
                    //基于当前元素值找到并选中节点
                    if ($.trim($elem.val()) != '') {
                        var nodeList = zTree.getNodesByParamFuzzy("name", $elem.val());
                        for (var i = 0, l = nodeList.length; i < l; i++) {
                            var node = nodeList[i];
                            zTree.selectNode(node);
                        }
                    }
                    $dropdownZtreeContainer.children(".ztree").hide();
                    $ztree.show();
                    //最小显示宽度设置
                    var width = $elem.outerWidth();
                    if (width < 330) {
                        width = 330;
                    }
                    $dropdownZtreeContainer.css({
                        width : width + "px"
                    }).slideDown("fast");

                    //jquery ui position定位组件显示位置
                    $dropdownZtreeContainer.position($.extend(true, {
                        my : "right top",
                        at : "right bottom",
                        of : $elem.parent("div")
                    }, opts.position))

                    //上下指示箭头切换处理
                    $toggle.removeClass("fa-angle-double-down");
                    $toggle.addClass("fa-angle-double-up");
                }).keydown(function(event) {
                    if (event.keyCode === 13) {
                        return true;
                    }
                    return false;
                });

                //上下指示箭头切换处理
                $toggle.click(function(event) {
                    if ($(this).hasClass("fa-angle-double-down")) {
                        $elem.click();
                    } else {
                        $toggle.removeClass("fa-angle-double-up");
                        $toggle.addClass("fa-angle-double-down");
                        $dropdownZtreeContainer.hide();
                    }
                    event.stopPropagation();
                    event.preventDefault();
                });

                //工具条查询功能
                $toolbar.find("form").submit(function(event) {
                    var word = $toolbar.find("input[name='keyword']").val();
                    var zTree = $.fn.zTree.getZTreeObj($ztree.attr("id"));
                    zTree.cancelSelectedNode();
                    var nodeList = zTree.getNodesByParamFuzzy("name", word);
                    for (var i = 0, l = nodeList.length; i < l; i++) {
                        var node = nodeList[i];
                        zTree.selectNode(node, true);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });

                //展开树形所有节点
                $toolbar.find(".btn-open-all").click(function(event) {
                    var zTree = $.fn.zTree.getZTreeObj($ztree.attr("id"));
                    zTree.expandAll(true);
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });

                //收起树形所有节点
                $toolbar.find(".btn-close-all").click(function(event) {
                    var zTree = $.fn.zTree.getZTreeObj($ztree.attr("id"));
                    zTree.expandAll(false);
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });

                //隐藏选取组件及清空元素值
                $toolbar.find(".btn-clear").click(function(event) {
                    if (opts.callback && opts.callback.onClear) {
                        opts.callback.onClear.call(this, event);
                    } else {
                        treeNodeClickDefaultCallback();
                    }
                    $dropdownZtreeContainer.hide();
                    $toggle.removeClass("fa-angle-double-up");
                    $toggle.addClass("fa-angle-double-down");
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });

                //组件之外点击事件隐藏组件
                $(document).on("mousedown", function(e) {
                    var $container = $dropdownZtreeContainer;
                    var $el = $elem;
                    //不太精确的滚动条判断，如果是滚动条则不隐藏
                    var tagName = e.target.tagName;
                    if (tagName == 'HTML') {
                        return;
                    }
                    if (!($el.is(e.target) || $el.find(e.target).length || $container.is(e.target) || $container.find(e.target).length)) {
                        $container.hide();
                    }
                });
            },

            /**
             * 以url异步请求html网页，一般用于div加载局部页面
             */
            $.fn.ajaxGetUrl = function(url, success, data) {
                Util.assertNotBlank(url, "ajaxGetUrl调用的url参数不能为空");
                //把记忆收藏按钮隐藏
                $("#btn-profile-param").hide();
                var $content = $(this);
                $content.addClass("ajax-get-container");
                //设置当前div属性记录加载的url
                $content.attr("data-url", url);
                $content.css("min-height", "100px");
                App.blockUI($content);
                $.ajax({
                    type : "GET",
                    cache : false,
                    url : url,
                    data : data,
                    dataType : "html",
                    success : function(res) {
                        $content.empty();
                        //div内部插入一个div，用于先隐藏加载页面内容并处理完毕后再一次性显示
                        var $div = $("<div class='ajax-page-inner'/>").appendTo($content);
                        $div.hide();
                        //把响应内容写入隐藏div
                        $div.html(res);
                        if (success) {
                            success.call($content, res);
                        }
                        //console.profile('Profile AJAX GET URL:' + url);
                        //调用全局的显示之前的页面处理方法
                        Page.initAjaxBeforeShow($div);
                        $div.show();
                        //初始化家族页面的表单验证
                        FormValidation.initAjax($div);
                        //调用全局的显示之后的页面处理方法
                        Page.initAjaxAfterShow($div);
                        //全局初始化页面的表格组件
                        Grid.initAjax($div);
                        //console.profileEnd();
                        App.unblockUI($content);
                    },
                    error : function(xhr, ajaxOptions, thrownError) {
                        $content.html('<h4>页面内容加载失败</h4>' + xhr.responseText);
                        App.unblockUI($content);
                    },
                    statusCode : {
                        403 : function() {
                            Global.notify("error", "URL: " + url, "未授权访问");
                        },
                        404 : function() {
                            Global.notify("error", "页面未找到：" + url + "，请联系管理员", "请求资源未找到");
                        }
                    }
                });
                return $content;
            };

            /**
             * 基于URL异步加载AJAX请求
             */
            $.fn.ajaxJsonUrl = function(url, success, data) {
                Util.assertNotBlank(url, "ajaxJsonUrl调用的url参数不能为空");
                var $content = $(this);
                App.blockUI($content);
                $.ajax({
                    traditional : true,
                    type : "GET",
                    cache : false,
                    url : url,
                    dataType : "json",
                    data : data,
                    success : function(response) {
                        if (response.type == "error" || response.type == "warning" || response.type == "failure") {
                            Global.notify("error", response.message);
                        } else {
                            if (success) {
                                success.call($content, response);
                            }
                            json = response;
                        }
                        App.unblockUI($content);
                    },
                    error : function(xhr, ajaxOptions, thrownError) {
                        Global.notify("error", "数据请求异常，请联系管理员", "系统错误");
                        App.unblockUI($content);
                    },
                    statusCode : {
                        403 : function() {
                            Global.notify("error", "URL: " + url, "未授权访问");
                        },
                        404 : function() {
                            Global.notify("error", "请尝试刷新页面试试，如果问题依然请联系管理员", "请求资源未找到");
                        }
                    }
                });
            };

            /**
             * 基于URL同步加载AJAX请求
             */
            $.fn.ajaxJsonSync = function(url, data, success) {
                Util.assertNotBlank(url, "ajaxJsonSync 调用的url参数不能为空");
                var $content = $(this);
                App.blockUI($content);
                var json = null;
                $.ajax({
                    traditional : true,
                    type : "GET",
                    cache : false,
                    async : false,
                    url : url,
                    data : data,
                    contentType : "application/json",
                    dataType : "json",
                    success : function(response) {
                        if (response.type == "error" || response.type == "warning" || response.type == "failure") {
                            Global.notify("error", response.message);
                        } else {
                            if (success) {
                                success.call($content, response);
                            }
                            json = response;
                        }
                        App.unblockUI($content);
                    },
                    error : function(xhr, ajaxOptions, thrownError) {
                        Global.notify("error", "数据请求异常，请联系管理员", "系统错误");
                        App.unblockUI($content);
                    },
                    statusCode : {
                        403 : function() {
                            Global.notify("error", "URL: " + url, "未授权访问");
                        },
                        404 : function() {
                            Global.notify("error", "请尝试刷新页面试试，如果问题依然请联系管理员", "请求资源未找到");
                        }
                    }
                });
                return json;
            };

            /**
             * 基于URL发起POST请求
             * @param options 参数对象
             * options: {
             *    url: required，请求URL,
             *    data: POST的data数据对象
             *    confirmMsg: confirm确认提示信息，false表示没有提示,
             *    success: 响应返回success标识JSON数据后，回调处理,
             *    failure: 失败回调函数
             *  }
             */
            $.fn.ajaxPostURL = function(options) {
                var url = options.url;
                Util.assertNotBlank(url);
                var success = options.success;
                var confirmMsg = options.confirmMsg;
                if (confirmMsg == undefined) {
                    confirmMsg = '确认提交数据？';
                }
                if (confirmMsg) {
                    if (!confirm(confirmMsg)) {
                        return false;
                    }
                }
                var options = $.extend({
                    data : {}
                }, options);
                var $el = $(this);
                App.blockUI($el);
                $.post(encodeURI(url), options.data, function(response, textStatus) {
                    App.unblockUI($el);
                    if (!response.type) {
                        Global.notify("error", response, "系统处理异常");
                        return;
                    }
                    if (response.type == "success" || response.type == "warning") {
                        Global.notify(response.type, response.message);
                        if (success) {
                            success.call($el, response);
                        }
                    } else {
                        if (response.userdata) {
                            var msgDetails = [];
                            for ( var i in response.userdata) {
                                msgDetails.push(response.userdata[i])
                            }
                            Global.notify("error", msgDetails.join("<br>"), response.message);
                        } else {
                            Global.notify("error", response.message);
                        }
                        if (options.failure) {
                            options.failure.call($el, response);
                        }
                    }
                }, "json");
            };

            /**
             * 基于form元素发起POST请求
             * @param options 参数对象
             * options: {
             *    confirmMsg: confirm确认提示信息，false表示没有提示,
             *    success: 响应返回success标识JSON数据后，回调处理,
             *    failure: 失败回调函数
             *  }
             */
            $.fn.ajaxPostForm = function(options) {
                var success = options.success;
                var failure = options.failure;
                var confirmMsg = options.confirmMsg;
                if (confirmMsg) {
                    if (!confirm(confirmMsg)) {
                        return false;
                    }
                }
                var options = $.extend({
                    data : {}
                }, options);
                var $el = $(this);
                App.blockUI($el);
                $el.ajaxSubmit({
                    dataType : "json",
                    method : "post",
                    success : function(response) {
                        App.unblockUI($el);
                        if (response.type == "success") {
                            if (success) {
                                success.call($el, response);
                            }
                        } else if (response.type == "failure" || response.type == "error") {
                            Global.notify("error", response.type, response.message);
                            if (failure) {
                                failure.call($el, response);
                            }
                        } else {
                            Global.notify("error", response, "表单处理异常，请联系管理员");
                            if (failure) {
                                failure.call($el, response);
                            }
                        }
                    },
                    error : function(xhr, e, status) {
                        App.unblockUI($el);
                        var response = jQuery.parseJSON(xhr.responseText);
                        if (response.type == "error") {
                            bootbox.alert(response.message);
                        } else {
                            Global.notify("error", response, "表单处理异常，请联系管理员");
                        }
                        if (failure) {
                            failure.call($el, response);
                        }
                    }
                })
            };

            $.fn.popupDialog = function(options) {
                var $link = $(this);
                var url = $link.attr("href");
                if (url == undefined) {
                    url = $link.attr("data-url");
                }
                var title = $link.attr("title");
                if (title == undefined) {
                    title = "对话框";
                }

                var size = $link.attr("modal-size");
                if (size == undefined) {
                    size = 'modal-full';
                } else if (size == 'auto') {
                    size = "";
                } else {
                    size = 'modal-' + size;
                }

                var options = $.extend({
                    url : url,
                    postData : {},
                    title : title,
                    size : size
                }, options);

                Util.assertNotBlank(options.url);
                var dialogId = "dialog_level_" + $("modal:visible").size();
                var $dialog = $('#' + dialogId);
                if ($dialog.length == 0) {
                    var html = [];
                    html.push('<div id="' + dialogId + '" class="modal fade" tabindex="-1" role="basic" aria-hidden="true" >');
                    html.push('<div class="modal-dialog ' + options.size + '">');
                    html.push('<div class="modal-content">');
                    html.push('<div class="modal-header">');
                    html.push('<button type="button" class="close"  data-dismiss="modal" aria-hidden="true"></button>');
                    html.push('<button type="button" class="close btn-reload" style="margin-left:10px;margin-right:10px;margin-top:-3px!important;height:16px;width:13px;background-image: url(\''
                            + WEB_ROOT + '/assets/img/portlet-reload-icon.png\')!important;"></button>');
                    html.push('<h4 class="modal-title">' + options.title + '</h4>');
                    html.push('</div>');
                    html.push('<div class="modal-body">');
                    html.push('</div>');
                    html.push('<div class="modal-footer hide">');
                    html.push('<button type="button" class="btn default" data-dismiss="modal">关闭窗口</button>');
                    html.push('</div>');
                    html.push('</div>');
                    html.push('</div>');
                    html.push('</div>');

                    var $container = $link.closest(".panel-content");
                    if ($container == undefined) {
                        $container = $('.page-container:first');
                    }

                    var $dialog = $(html.join("")).appendTo($('body'));
                    $dialog.find(" > .modal-dialog > .modal-content > .modal-body").ajaxGetUrl(options.url, false, options.postData);
                    $dialog.modal();
                    $dialog.find(" > .modal-dialog > .modal-content > .modal-header > .btn-reload").click(function() {
                        $dialog.find(" > .modal-dialog > .modal-content > .modal-body").ajaxGetUrl(options.url, false, options.postData);
                    })
                } else {
                    $dialog.find(" > .modal-dialog > .modal-content > .modal-body").ajaxGetUrl(options.url, false, options.postData);
                    $dialog.modal("show");
                }

                if (options.callback) {
                    $dialog.data("callback", options.callback);
                }
            }
        }
    };

}();

/**
 * 布尔处理辅助对象
 */
var BooleanUtil = function() {
    return {
        toBoolean : function(str) {
            if (str) {
                var obj = $.type(str);
                if (obj === "string"
                        && (str == 'true' || str == '1' || str == 'y' || str == 'yes' || str == 'readonly' || str == 'checked' || str == 'enabled' || str == 'enable' || str == 'selected')) {
                    return true;
                } else if (obj === "number" && (str == 1)) {
                    return true;
                }
            }
            return false;
        }
    }
}();

/**
 * 算术处理辅助对象
 */
var MathUtil = function() {

    // private functions & variables

    // public functions
    return {

        //乘法函数，用来得到精确的乘法结果
        //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
        //调用：accMul(arg1,arg2)
        //返回值：arg1乘以arg2的精确结果
        mul : function(arg1, arg2) {
            if (arg1 == undefined) {
                arg1 = 0;
            }
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length
            } catch (e) {
            }
            try {
                m += s2.split(".")[1].length
            } catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        },

        //除法函数，用来得到精确的除法结果
        //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
        //调用：accDiv(arg1,arg2)
        //返回值：arg1除以arg2的精确结果
        div : function(arg1, arg2, fix) {
            if (fix == undefined) {
                fix = 2;
            }
            var t1 = 0, t2 = 0, r1, r2;
            try {
                t1 = arg1.toString().split(".")[1].length
            } catch (e) {
            }
            try {
                t2 = arg2.toString().split(".")[1].length
            } catch (e) {
            }
            with (Math) {
                r1 = Number(arg1.toString().replace(".", ""))
                r2 = Number(arg2.toString().replace(".", ""))
                return MathUtil.mul((r1 / r2), pow(10, t2 - t1)).toFixed(fix);
            }
        },

        //加法
        add : function(arg1, arg2) {
            if (arg1 == undefined) {
                arg1 = 0;
            }
            if (arg2 == undefined) {
                arg2 = 0;
            }
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length
            } catch (e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch (e) {
                r2 = 0
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2))
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return MathUtil.div((arg1 + arg2), m);
        },

        //加法
        sub : function(arg1, arg2) {
            return MathUtil.add(arg1, -Number(arg2));
        }
    };

}();

function scanBarcodeCallback(id, code) {
    $("#" + id).trigger("barcode", [ code ]);
}

/*******************************************************************************
 * Usage
 ******************************************************************************/
// Custom.init();
// Custom.doSomeStuff();
