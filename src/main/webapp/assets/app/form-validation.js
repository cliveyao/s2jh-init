/**
 * Custom module for you to write your own javascript functions
 */
var FormValidation = function() {

    // private functions & variables

    // public functions
    return {

        init : function() {

            /**
             * 基于表单元素name和value结构的json数据更新表单元素值
             * 默认为强制覆盖，除非可选参数forceOverwrite设定为false
             */
            $.fn.setFormDatas = function(data, forceOverwrite) {
                var $container = $(this);
                for ( var key in data) {
                    var el = "input[name='" + key + "'],select[name='" + key + "'],textarea[name='" + key + "']";
                    var $el = $container.find(el);
                    if (forceOverwrite == false) {
                        if ($.trim($el.val()) != '') {
                            continue;
                        }
                    }
                    var val = data[key];
                    $el.val(val);
                    //基于select2组件对select特殊处理
                    if ($el.is("select")) {
                        $el.select2();
                    }
                }
            },

            /**
             * 基于数据库数据校验数据的唯一性
             */
            jQuery.validator.addMethod("unique", function(value, element) {
                var form = $(element).closest("form");
                var url = form.attr("action").split("!")[0] + "!checkUnique?element=" + $(element).attr("name");
                var id = form.find("input[name='id']");
                if (id.size() > 0) {
                    url = url + "&id=" + id.val();
                }
                return $.validator.methods.remote.call(this, value, element, url)
            }, "数据已存在");

            /**
             * 校验输入值需要满足时间格式
             */
            jQuery.validator.addMethod("timestamp", function(value, element) {
                if (value == "") {
                    return this.optional(element);
                }
                var regex = /^(?:[0-9]{4})-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
                if (!regex.test(value)) {
                    return false;
                }
                return true;
            }, "请输入合法的日期时间格式（如2011-08-15 13:40:00）");

            /**
             * 校验输入值满足年月格式
             */
            jQuery.validator.addMethod("yearMonth", function(value, element) {
                if (value == "") {
                    return this.optional(element);
                }
                var regex = /^(?:[0-9]{4})(?:(?:0[1-9])|(?:1[0-2]))$/;
                if (!regex.test(value)) {
                    return false;
                }
                return true;
            }, "请输入合法的年月格式（如201201）");

            jQuery.validator.addMethod("startWith", function(value, element, param) {
                if (this.optional(element)) {
                    return true;
                }
                if (param.length > value.length) {
                    return false;
                }
                if (value.substr(0, param.length) == param) {
                    return true;
                } else {
                    return false;
                }
            }, "请输入以{0}开头字符串");

            /**
             * 校验当前输入日期值应该小于目标元素日期值， 如果目标元素没有输入值，校验认为通过 主要用于两个日期区间段输入校验彼此日期先后合理性
             */
            jQuery.validator.addMethod("dateLT", function(value, element, param) {
                if (value == "") {
                    return this.optional(element);
                }

                var endDate = $(param).val();
                if (endDate == "") {
                    return true;
                }

                var startDate = eval("new Date(" + value.replace(/[\-\s:]/g, ",") + ")");
                endDate = eval("new Date(" + endDate.replace(/[\-\s:]/g, ",") + ")");

                if (startDate > endDate) {
                    return false;
                } else {

                    return true;
                }
            }, "输入的日期数据必须小于结束日期");

            /**
             * 校验当前输入日期值应该大于目标元素日期值， 如果目标元素没有输入值，校验认为通过 主要用于两个日期区间段输入校验彼此日期先后合理性
             */
            jQuery.validator.addMethod("dateGT", function(value, element, param) {
                if (value == "") {
                    return this.optional(element);
                }

                var startDate = $(param).val();
                if (startDate == "") {
                    return true;
                }

                var endDate = eval("new Date(" + value.replace(/[\-\s:]/g, ",") + ")");
                startDate = eval("new Date(" + startDate.replace(/[\-\s:]/g, ",") + ")");

                if (startDate > endDate) {

                    return false;
                } else {

                    return true;
                }
            }, "输入的日期数据必须大于开始日期");

            var idCardNoUtil = {

                /* 省,直辖市代码表 */
                provinceAndCitys : {
                    11 : "北京",
                    12 : "天津",
                    13 : "河北",
                    14 : "山西",
                    15 : "内蒙古",
                    21 : "辽宁",
                    22 : "吉林",
                    23 : "黑龙江",
                    31 : "上海",
                    32 : "江苏",
                    33 : "浙江",
                    34 : "安徽",
                    35 : "福建",
                    36 : "江西",
                    37 : "山东",
                    41 : "河南",
                    42 : "湖北",
                    43 : "湖南",
                    44 : "广东",
                    45 : "广西",
                    46 : "海南",
                    50 : "重庆",
                    51 : "四川",
                    52 : "贵州",
                    53 : "云南",
                    54 : "西藏",
                    61 : "陕西",
                    62 : "甘肃",
                    63 : "青海",
                    64 : "宁夏",
                    65 : "新疆",
                    71 : "台湾",
                    81 : "香港",
                    82 : "澳门",
                    99 : "其他"
                },

                /* 每位加权因子 */
                powers : [ "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2" ],

                /* 第18位校检码 */
                parityBit : [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ],

                /* 性别 */
                genders : {
                    male : "男",
                    female : "女"
                },

                /* 校验地址码 */
                checkAddressCode : function(addressCode) {
                    var check = /^[1-9]\d{5}$/.test(addressCode);
                    if (!check)
                        return false;
                    if (idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
                        return true;
                    } else {
                        return false;
                    }
                },

                /* 校验日期码 */
                checkBirthDayCode : function(birDayCode) {
                    var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
                    if (!check)
                        return false;
                    var yyyy = parseInt(birDayCode.substring(0, 4), 10);
                    var mm = parseInt(birDayCode.substring(4, 6), 10);
                    var dd = parseInt(birDayCode.substring(6), 10);
                    var xdata = new Date(yyyy, mm - 1, dd);
                    if (xdata > new Date()) {
                        return false;// 生日不能大于当前日期
                    } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
                        return true;
                    } else {
                        return false;
                    }
                },

                /* 计算校检码 */
                getParityBit : function(idCardNo) {
                    var id17 = idCardNo.substring(0, 17);
                    /* 加权 */
                    var power = 0;
                    for (var i = 0; i < 17; i++) {
                        power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i]);
                    }
                    /* 取模 */
                    var mod = power % 11;
                    return idCardNoUtil.parityBit[mod];
                },

                /* 验证校检码 */
                checkParityBit : function(idCardNo) {
                    var parityBit = idCardNo.charAt(17).toUpperCase();
                    if (idCardNoUtil.getParityBit(idCardNo) == parityBit) {
                        return true;
                    } else {
                        return false;
                    }
                },

                /* 校验15位或18位的身份证号码 */
                checkIdCardNo : function(idCardNo) {
                    // 99开头的不校验
                    if (idCardNo.startWith("99")) {
                        return true;
                    }
                    // 15位和18位身份证号码的基本校验
                    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
                    if (!check)
                        return false;
                    // 判断长度为15位或18位
                    if (idCardNo.length == 15) {
                        return idCardNoUtil.check15IdCardNo(idCardNo);
                    } else if (idCardNo.length == 18) {
                        return idCardNoUtil.check18IdCardNo(idCardNo);
                    } else {
                        return false;
                    }
                },

                // 校验15位的身份证号码
                check15IdCardNo : function(idCardNo) {
                    // 15位身份证号码的基本校验
                    var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
                    if (!check)
                        return false;
                    // 校验地址码
                    var addressCode = idCardNo.substring(0, 6);
                    check = idCardNoUtil.checkAddressCode(addressCode);
                    if (!check)
                        return false;
                    var birDayCode = '19' + idCardNo.substring(6, 12);
                    // 校验日期码
                    return idCardNoUtil.checkBirthDayCode(birDayCode);
                },

                // 校验18位的身份证号码
                check18IdCardNo : function(idCardNo) {
                    // 18位身份证号码的基本格式校验
                    var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
                    if (!check)
                        return false;
                    // 校验地址码
                    var addressCode = idCardNo.substring(0, 6);
                    check = idCardNoUtil.checkAddressCode(addressCode);
                    if (!check)
                        return false;
                    // 校验日期码
                    var birDayCode = idCardNo.substring(6, 14);
                    check = idCardNoUtil.checkBirthDayCode(birDayCode);
                    if (!check)
                        return false;
                    // 验证校检码
                    // return idCardNoUtil.checkParityBit(idCardNo);
                    return check;
                },

                formateDateCN : function(day) {
                    if (idCardNoUtil.checkBirthDayCode(day)) {
                        var yyyy = day.substring(0, 4);
                        var mm = day.substring(4, 6);
                        var dd = day.substring(6);
                        // alert(yyyy + '-' + mm +'-' + dd);
                        return yyyy + '-' + mm + '-' + dd;
                    }
                    return "";
                },

                // 获取信息
                getIdCardInfo : function(idCardNo) {
                    var idCardInfo = {
                        gender : "", // 性别
                        birthday : "" // 出生日期(yyyy-mm-dd)
                    };
                    if (idCardNo.length == 15) {
                        var aday = '19' + idCardNo.substring(6, 12);
                        idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
                        if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
                            idCardInfo.gender = idCardNoUtil.genders.female;
                        } else {
                            idCardInfo.gender = idCardNoUtil.genders.male;
                        }
                    } else if (idCardNo.length == 18) {
                        var aday = idCardNo.substring(6, 14);
                        idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
                        if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
                            idCardInfo.gender = idCardNoUtil.genders.female;
                        } else {
                            idCardInfo.gender = idCardNoUtil.genders.male;
                        }

                    }
                    return idCardInfo;
                },

                // 18位转15位
                getId15 : function(idCardNo) {
                    if (idCardNo.length == 15) {
                        return idCardNo;
                    } else if (idCardNo.length == 18) {
                        return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
                    } else {
                        return null;
                    }
                },

                // 15位转18位
                getId18 : function(idCardNo) {
                    if (idCardNo.length == 15) {
                        var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
                        var parityBit = idCardNoUtil.getParityBit(id17);
                        return id17 + parityBit;
                    } else if (idCardNo.length == 18) {
                        return idCardNo;
                    } else {
                        return null;
                    }
                }
            };

            /**
             * 身份证号码验证
             * 目前去掉了尾数码校验，如果需要启用可在本文件搜索idCardNoUtil.checkParityBit(idCardNo);
             * 取消注释即可
             */
            jQuery.validator.addMethod("idCardNo", function(value, element, param) {
                return this.optional(element) || idCardNoUtil.checkIdCardNo(value);
            }, "请输入有效的身份证件号");

            // 联系电话(手机/电话皆可)验证
            jQuery.validator.addMethod("phone", function(value, element) {
                var phone = /^\d|-$/;
                return this.optional(element) || (phone.test(value));
            }, "请输入有效的电话号码：数字或'-'");

            // 邮政编码验证
            jQuery.validator.addMethod("zipCode", function(value, element) {
                var tel = /^[0-9]{6}$/;
                return this.optional(element) || (tel.test(value));
            }, "请输入有效的6位数字邮政编码");

            // 如果带小数，则必须以.5或.0结尾
            jQuery.validator.addMethod("numberEndWithPointFive", function(value, element) {
                var reg = /^(0|[1-9]\d*)([.][05])?$/;
                return this.optional(element) || (reg.test(value));
            }, "必须以.0或.5作为小数结尾");

            //扩展标准的equalTo校验，基于元素name属性匹配进行equalTo校验
            jQuery.validator.addMethod("equalToByName", function(value, element, param) {
                var target = $(element).closest("form").find("input[name='" + param + "']");
                if (this.settings.onfocusout) {
                    target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                        $(element).valid();
                    });
                }
                return value === target.val();
            }, "请输入前后相等数据");

            //data-rule-requiredByName=“abc”，如果abc元素值不为空，则当前元素也不能为空
            jQuery.validator.addMethod("requiredByName", function(value, element, param) {
                var target = $(element).closest("form").find("input[name='" + param + "']");
                if (target.val().length > 0) {
                    if (value == undefined || value.length == 0) {
                        return false;
                    }
                }
                return true;
            }, "此数据由于依赖关系必须填写");

            //自定义正则表达式校验
            $.validator.addMethod("regex", function(value, element, regexp) {
                var re = new RegExp(regexp);
                return this.optional(element) || re.test(value);
            }, "数据校验未通过");
        },

        // main function
        initAjax : function($container) {
            // initialize here something.

            //当前表单元素所在容器对象，以便缩小元素处理范围
            if ($container == undefined) {
                $container = $("body");
            }

            $("form.form-validation", $container).each(function() {

                var $form = $(this);

                //表格关联表单重置按钮事件：清空查询条件，以初始url查询加载表格
                var dataGridSearch = $form.attr("data-grid-search");
                //表单reset按钮点击事件
                $form.find('[type="reset"]').click(function() {
                    if (dataGridSearch) {//短暂延迟等待reset处理完毕后以重置数据触发表单提交查询
                        setTimeout(function() {
                            //$.uniform.update();
                            $form.find("select").each(function() {
                                $(this).select2("val", $(this).val());
                            });
                            $form.submit();
                        }, 100);
                        return;
                    }
                })

                //动态添加全局的校验错误提示消息区域
                var $errorAlert = $('<div class="alert alert-danger display-hide" style="display: none;"/>');
                $errorAlert.append('<button class="close" data-close="alert" type="button"></button>');
                $errorAlert.append('表单数据有误，请检查修正.');
                $errorAlert.prependTo($form);

                var options = $.extend(true, {
                    //框架实现从服务器端基于Entity定义动态生成客户端校验规则，详见：PersistableController#buildValidateRules
                    //首选取data属性作为表单异步校验url，如果没有则基于form的action参数修改组装
                    editrulesurl : $form.attr("data-editrulesurl")
                }, $form.data("formOptions") || {});
                if (options.editrulesurl == undefined && $form.attr("method").toUpperCase() == "POST") {
                    var action = $form.attr("action");
                    options.editrulesurl = action.substring(0, action.indexOf("!")) + "!buildValidateRules";
                }

                //表单每个元素如果有required属性，则对应动态生成红色必填的提示标记
                var $els = $form.find(":input[type='text'], :input[type='password'], :input[type='radio'], :input[type='checkbox'], :input[type='file'],:input[type='hidden'], select , textarea");
                $els.each(function() {
                    var $el = $(this);
                    if ($el.attr("required")) {
                        var $formGroup = $el.closest(".form-group");
                        if ($formGroup.find("label.control-label > span.required").length == 0) {
                            $formGroup.find("label.control-label").append('<span class="required">*</span>');
                        }
                    }
                });

                //框架默认对表单元素修改进行追踪记录，以便在页面关闭或返回，基于脏数据标记提示用户表单数据有变更是否放弃修改离开
                if ($form.attr("method") == 'post' && !$form.hasClass("form-track-disabled")) {
                    $els.change(function() {
                        $form.attr("form-data-modified", 'true');
                    });
                    $form.find("textarea").keyup(function() {
                        $form.attr("form-data-modified", 'true');
                    });
                }

                $form.find(":text").each(function() {
                    var $el = $(this);
                    //输入框焦点丢失后对输入内容做自动trim处理
                    $el.blur(function() {
                        $el.val($.trim($el.val()));
                    })
                    //如果元素有data-spell-to，则自动把当前内容转换拼音设置到对应元素值
                    var spellTo = $el.attr('data-spell-to');
                    if (Pinyin && spellTo) {
                        $el.change(function() {
                            var val = $el.val();
                            if (val != '') {
                                var $spellTo = $form.find('input[name="' + spellTo + '"]');
                                $spellTo.val(Pinyin.getCamelChars(val));
                            }
                        })
                    }
                });

                //自动初始化表单第一个元素焦点
                var $first = $form.find(".focus").first();
                if ($first.size() == 0) {
                    $first = $form.find(":text:enabled").first();
                }
                $first.focus();

                //表单校验
                $form.validate({
                    errorElement : 'span', //default input error message container
                    errorClass : 'error-block', // default input error message class
                    focusInvalid : true, // do not focus the last invalid input
                    ignore : "",

                    errorPlacement : function(error, element) { // render error placement for each input type
                        if (element.parent(".input-group").size() > 0) {
                            error.insertAfter(element.parent(".input-group"));
                        } else if (element.attr("data-error-container")) {
                            error.appendTo(element.attr("data-error-container"));
                        } else if (element.parents('.radio-list').size() > 0) {
                            error.insertAfter(element.parents('.radio-list'));
                        } else if (element.parent('.radio-inline').size() > 0) {
                            error.appendTo(element.parent('.radio-inline').parent());
                        } else if (element.parents('.checkbox-list').size() > 0) {
                            error.insertAfter(element.parents('.checkbox-list'));
                        } else if (element.parent('.checkbox-inline').size() > 0) {
                            error.appendTo(element.parent('.checkbox-inline').parent());
                        } else {
                            error.insertAfter(element); // for other inputs, just perform default behavior
                        }
                    },

                    invalidHandler : function(event, validator) { //display error alert on form submit   
                        $errorAlert.show();
                        App.scrollTo($errorAlert, -200);
                    },

                    highlight : function(element) { // hightlight error inputs
                        $(element).closest('.form-group').addClass('has-error');
                        $(element).closest('td').addClass('has-error');
                    },

                    unhighlight : function(element) { // revert the change done by hightlight
                        $(element).closest('td').removeClass('has-error');
                        $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
                    },

                    success : function(label) {
                        label.closest('td').removeClass('has-error');
                        label.closest('.form-group').removeClass('has-error'); // set success class to the control group
                        label.remove();
                    },
                    submitHandler : function(form) {
                        var validator = this;
                        $errorAlert.hide();
                        //如果触发按钮具有data-form-action属性，则用此值修改表单action值作为post提交的url
                        var submitButton = $(this.submitButton);
                        if (submitButton.attr("data-form-action")) {
                            $form.attr("action", submitButton.attr("data-form-action"));
                        }

                        //如果按钮有data-confirm，则confirm提示确认
                        if (submitButton.attr("data-confirm")) {
                            if (!confirm(submitButton.attr("data-confirm"))) {
                                return false;
                            }
                        }

                        //如果参数有submitHandler则直接调用后返回
                        if (options.submitHandler) {
                            options.submitHandler.call(this, form);
                            return false;
                        }

                        //处理表单提交触发表格查询
                        if (dataGridSearch) {
                            var $grid = $(dataGridSearch);
                            //对应grid组件的url参数值
                            var url = $grid.data("gridOptions").url;
                            //把当前表单内容序列化追加更新到grid的url参数
                            if (url.indexOf("?") > -1) {
                                url = url + "&" + $form.serialize();
                            } else {
                                url = url + "?" + $form.serialize();
                            }
                            var data = {
                                datatype : "json",
                                url : url
                            };

                            //把需要记录的查询参数信息以bindSearchFormData名称结构json放到grid参数对象
                            var bindSearchFormData = {};
                            $form.find(".grid-param-data").each(function() {
                                var $el = $(this);
                                bindSearchFormData[$el.attr("name")] = $el.val();
                            })
                            data.bindSearchFormData = bindSearchFormData;

                            //如果没有则进行表格初始化，如果已初始化则触发reload查询
                            if (!$grid.hasClass("ui-jqgrid-btable")) {
                                Grid.initGrid($grid, data);
                            } else {
                                $grid.jqGrid('setGridParam', data).trigger("reloadGrid");
                            }
                            return;
                        }

                        //准备post提交，遮罩表单
                        App.blockUI($form);
                        var submitButton = $(this.submitButton);

                        //表单包含子表格元素，则取子表格脏数据附加到整个表单post的数据中
                        var postData = {};
                        $('table[data-grid="items"]', $form).each(function() {
                            var $grid = $(this);
                            postData = $.extend(true, postData, $grid.jqGrid("getDirtyRowdatas"));
                        });

                        //用户confirm操作后如果确认ok会设置按钮的_serverValidationConfirmed_为true
                        //然后触发按钮点击，然后会基于此值判断把已确认参数追加到表单提交参数对象中
                        if (submitButton.attr("_serverValidationConfirmed_")) {
                            postData["_serverValidationConfirmed_"] = true;
                            submitButton.removeAttr("_serverValidationConfirmed_");
                        }

                        //ajaxSubmit方式提交表单数据
                        $form.ajaxSubmit({
                            dataType : "json",
                            method : "post",
                            data : postData,
                            success : function(response) {
                                App.unblockUI($form);
                                //重置Struts token控制参数
                                $form.find("input[name='token']").val(new Date().getTime());

                                //服务器端校验反馈需要用户进行confirm确认
                                if (response.type == "confirm") {
                                    bootbox.dialog({
                                        //由于组件没有定义close回调事件，因此把close按钮屏蔽掉
                                        closeButton : false,
                                        message : response.userdata.join("<br/>"),
                                        title : response.message + " 请确认是否继续提交表单？",
                                        buttons : {
                                            danger : {
                                                label : "取消",
                                                callback : function() {
                                                    //移除标识属性以便后续提交触发confirm校验
                                                    submitButton.removeAttr("_serverValidationConfirmed_");
                                                }
                                            },
                                            main : {
                                                label : "确认",
                                                className : "blue",
                                                callback : function() {
                                                    //标识设置用户已确认，然后再次出发提交按钮点击发起二次提交表单请求
                                                    submitButton.attr("_serverValidationConfirmed_", true);
                                                    submitButton.click();
                                                }
                                            }
                                        }
                                    });
                                    return;
                                }

                                if (response.type == "success" || response.type == "warning") {
                                    //全局提示信息显示
                                    Global.notify(response.type, response.message);
                                    //重置表单数据已修改标识
                                    $form.attr("form-data-modified", 'false');
                                    //如果有回调定义则调用
                                    if (options.successCallback) {
                                        options.successCallback.call(form, response, submitButton);
                                    } else {
                                        //回调刷新jqGrid组件
                                        var dataGridReload = submitButton.attr("data-grid-reload");
                                        if (dataGridReload) {
                                            $(dataGridReload).jqGrid('setGridParam', {
                                                datatype : "json"
                                            }).trigger("reloadGrid");
                                        }

                                        //AJAX重新加载指定DIV区域
                                        var ajaxifyReload = submitButton.attr("data-ajaxify-reload");
                                        if (ajaxifyReload) {
                                            if (ajaxifyReload == '_active-panel') {
                                                var $target = submitButton.closest(".panel-content");
                                                $target.ajaxGetUrl($target.attr("data-url"));
                                            } else if (ajaxifyReload == '_closest-ajax-container') {
                                                var $target = submitButton.closest(".ajax-get-container");
                                                $target.ajaxGetUrl($target.attr("data-url"));
                                            } else if (ajaxifyReload == '.ajaxify-tasks') {
                                                $(ajaxifyReload).each(function() {
                                                    $(this).ajaxGetUrl($(this).attr("data-url"));
                                                })
                                                Global.autoCloseContainer(submitButton, response);
                                            } else {
                                                $(ajaxifyReload).each(function() {
                                                    $(this).ajaxGetUrl($(this).attr("data-url"));
                                                })
                                            }
                                        } else {
                                            //根据全局的规则关闭表单按钮所在容器元素
                                            Global.autoCloseContainer(submitButton, response);
                                        }
                                    }
                                } else if (response.type == "failure" || response.type == "error") {
                                    if (options.failureCallback) {
                                        options.failureCallback.call(form, response);
                                    } else {
                                        Global.notify("error", response.message);
                                    }
                                } else {
                                    Global.notify("error", "表单处理异常，请联系管理员");
                                }
                            },
                            error : function(xhr, e, status) {
                                App.unblockUI($form);
                                //重置Struts token控制参数
                                $form.find("input[name='token']").val(new Date().getTime());
                                var response = jQuery.parseJSON(xhr.responseText);
                                if (response.type == "error") {
                                    Global.notify("error", response.message);
                                    if (options.errorCallback) {
                                        options.errorCallback.call(form, response);
                                    }
                                } else {
                                    Global.notify("error", "表单处理异常，请联系管理员");
                                }
                            }
                        })

                        return false;
                    }
                });

                //所有表单元素添加默认样式
                $form.find("input[type='text'],input[type='password'],select,textarea").each(function() {
                    if (!$(this).hasClass("form-control")) {
                        $(this).addClass("form-control");
                    }
                });

                //为表单元素添加tooltipster提示说明
                $form.find("input[type='text'],input[type='password'],select,textarea,hidden").each(function() {
                    var $el = $(this);
                    if ($el.attr("data-tooltips")) {
                        var $tips = $('<span class="glyphicon glyphicon-exclamation-sign tooltipster"  title="' + $el.attr("data-tooltips") + '"></span>');
                        $tips.tooltipster({
                            contentAsHTML : true,
                            offsetY : 5,
                            theme : 'tooltipster-punk'
                        });
                        $el.closest(".form-group").find(".control-label:first").append($tips);
                    }
                });

                //动态添加服务器端生成的验证规则
                if (options.editrulesurl && options.editrulesurl != "false") {
                    $form.ajaxJsonUrl(options.editrulesurl, function(json) {
                        for ( var key in json) {
                            //服务器会返回整个实体对象的校验规则，如果表单没有对应元素，则忽略当前属性
                            var $el = $form.find("[name='" + key + "']");
                            if ($el.size() == 0) {
                                continue;
                            }
                            var rules = json[key];
                            //服务器端基于注解属性生成tooltips，把tooltips内容构建为页面元素提示信息
                            if (rules.tooltips) {
                                var $tips = $('<span class="glyphicon glyphicon-exclamation-sign tooltipster"  title="' + rules.tooltips + '"></span>');
                                $tips.tooltipster({
                                    contentAsHTML : true,
                                    offsetY : 5,
                                    theme : 'tooltipster-punk'
                                });
                                //移除此属性，避免干扰jquery validation校验属性
                                delete rules.tooltips;
                                $el.closest(".form-group").find(".control-label:first").append($tips);
                            }

                            //只读处理
                            if (rules.readonly) {
                                var $id = $form.find("input[name='id']");
                                if ($el.attr("readonly") == undefined && $id && $id.val() != '') {
                                    $el.attr("readonly", true);
                                }
                                delete rules.readonly;
                            }

                            if (rules.required) {
                                $el.closest(".form-group").find(".control-label:first").append('<span class="required">*</span>');
                            }
                            for ( var rule in rules) {
                                //判断服务器生成的校验规则是否是jquery validation支持的有效方法
                                //如果不是则抛出错误提示并移除属性避免导致jquery validation运行失败
                                if (!$.validator.methods[rule]) {
                                    Global.notify("error", "未定义的表单校验规则：" + rule);
                                    delete rules[rule];
                                }
                            }
                            $el.rules("add", rules);
                        }
                    });
                }

                //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
                $('.select2me', $form).change(function() {
                    $form.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
                });

                //Enter to TAB
                //JoelPurra.PlusAsTab.setOptions({
                //key : 13
                //});
                //$form.plusAsTab();

                //屏蔽浏览器默认的回车提交处理模式
                if ($form.attr("method") != undefined && $form.attr("method").toUpperCase() == 'POST') {
                    $form.keypress(function(event) {
                        var ta = event.target;
                        if (ta.tagName === 'TEXTAREA') {
                            return true;
                        }
                        return event.which != 13;
                    });
                }

                //绑定事件回调，在此回调方法中定义一系列表单元素事件处理
                if (options && options.bindEvents) {
                    options.bindEvents.call($form, {});
                }

                //表单点击提交按钮触发逻辑
                $form.on('click', ':submit', function(event) {
                    //检查所有子表编辑对象，如果有未保存的inline edit行项则提示用户先save表格再提交表单
                    $('table[data-grid="items"]', $form).each(function() {
                        var $grid = $(this);
                        if ($grid.jqGrid("isEditingMode", true)) {
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        }
                    });

                    //完成默认的jquery validation默认校验之后，可定义preValidate方法用于一些复杂的组合的表单校验
                    //如果返回不为false认为校验通过
                    if (options && options.preValidate) {
                        var validate = options.preValidate.call($form);
                        if (validate != undefined && validate == false) {
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        }
                    }

                    return true;
                })

                //如果表单有form-search-init则默认触发提交表单以便默认查询数据
                if ($form.hasClass("form-search-init")) {
                    $form.submit();
                }
            });
        },

        // some helper function
        doSomeStuff : function() {
            myFunc();
        }

    };

}();