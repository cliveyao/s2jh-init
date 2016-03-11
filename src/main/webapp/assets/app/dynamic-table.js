(function($) {
    $.widget("ui.dynamictable", {

        options : {
            temp : ".dynamic-table-row-template", // 模板层class
            minRows : 1, // 具体行的最小数量 （初始始化时有个隐藏的模板行，在具体算的时候需要+1）
            maxRows : 50, // 具体行的最大数量（初始始化时有个隐藏的模板行，在具体算的时候需要+1）
            initAdd : true, // 初始化点击Add按钮添加行项
            afterAdd : false
        },

        _create : function() {
            var self = this;
            var $con = this.element;
            options = this.options;
            var $temp = $con.find(options.temp); // 模板行
            this.tempHtml = $temp.html();
            $temp.remove();

            var $thNum = $('<th style="width: 70px; text-align:center;"/>').prependTo($con.find(" thead tr "));
            var $num = $('<span class="dynamic-table-num">序号</span>').appendTo($thNum);
            var $add = $('<a class="btn btn-sm yellow btn-table-add-line" href="javascript:;" style="display:none;margin-bottom: 4px"><i class="fa fa-plus"></i> 添加</a>').appendTo($thNum);

            $con.mouseover(function(e) {
                $thNum.css("padding", "0px");
                $num.hide();
                $add.show();
            }).mouseout(function(e) {
                $thNum.css("padding", "8px");
                $num.show();
                $add.hide();
            });

            $con.on("mouseover", " tbody > tr", function(e) {
                var $tr = $(this);
                $tr.find(".span-row-seq").hide();
                $tr.find(".fa-times").parent("a").show();
            }).on("mouseout", " tbody > tr", function(e) {
                var $tr = $(this);
                $tr.find(".span-row-seq").show();
                $tr.find(".fa-times").parent("a").hide();
            })

            $con.on("click", 'a.btn-table-add-line', function(e) {
                e.preventDefault();
                self.addLine($con.find(" tbody tr:first "), "before");
            });

            $con.on("click", 'a.btn-table-remove-line', function(e) {
                e.preventDefault();
                if ($con.find("tbody tr:visible").length == options.minRows) {
                    alert("最少要有" + options.minRows + "行！");
                    return false;
                }
                var currentTR = $(this).closest("tr");
                var operation = currentTR.find("input[name$='.operation']").val();
                if (operation == 'update') {
                    currentTR.find("input[name$='.operation']").val("remove");
                    currentTR.hide();

                    currentTR.find(":text,select").not(":hidden").each(function() {
                        // alert($(this).attr("name"));
                        $(this).attr("disabled", true);
                    });
                } else {
                    currentTR.remove();
                }

                self.resetIndex();
            });

            var existTRs = $con.find("tbody > tr:not(.dynamic-table-row-template)");
            if (existTRs.length > 0) {
                existTRs.each(function(i) {
                    var $tr = $(this);
                    $tr.attr("row-index-fixed", i);
                    $tr.find("input,select").each(function() {
                        $(this).removeAttr("id");
                    });

                    var tdSeq = $('<td style="text-align: center;" class="row-seq"><span class="span-row-seq"></span></td>').prependTo($tr);
                    var addDel = $('<a class="btn btn-sm default btn-table-remove-line" href="javascript:;" style="display:none"><i class="fa fa-times"></i></a>').appendTo(tdSeq);

                    if ($.isFunction(options.afterAdd)) {
                        options.afterAdd.call($con, $tr);
                    }
                });
                setTimeout(function() {
                    self.resetIndex();
                }, 500);
            } else {
                if (options.initAdd) {
                    self.addLine();
                }
            }
            return $(this);
        },

        addLine : function(refTR, type) {
            $con = this.element;
            if ($con.find("tbody tr:visible").length == options.maxRows) {
                alert("最多只能添加" + options.maxRows + "行！");
                return false;
            }
            var tr = $("<tr>" + this.tempHtml + "</tr>");
            if (refTR) {
                if (type == "before") {
                    refTR.before(tr);
                } else {
                    refTR.after(tr);
                }
            } else {
                $con.find("tbody").append(tr);
            }

            tr.find("input,select,textarea").each(function() {
                $(this).removeAttr("id");
                if ($(this).attr("class") == undefined) {
                    $(this).attr("class", "form-control");
                }
            });

            var tdSeq = $('<td style="text-align: center;" class="row-seq"><span class="span-row-seq"></span></td>').prependTo(tr);
            var addDel = $('<a class="btn btn-sm default btn-table-remove-line" href="javascript:;" style="display:none"><i class="fa fa-times"></i></a>').appendTo(tdSeq);

            this.resetIndex();
            if ($.isFunction(options.afterAdd)) {
                options.afterAdd.call($con, tr);
            }

            Page.initAjaxBeforeShow(tr);
        },

        resetIndex : function() {
            $con = this.element;

            idx = 0;
            $con.find("tbody tr[row-index-fixed]").each(function() {
                idx++;
            });

            $con.find("tbody tr").not("[row-index-fixed]").each(function() {
                $(this).find("input,select").each(function() {
                    if ($(this).attr("name")) {
                        var oldName = $(this).attr("name");
                        if (oldName) {
                            $(this).attr("name", oldName.substring(0, oldName.indexOf("[") + 1) + idx + oldName.substring(oldName.indexOf("]"), oldName.length));
                        }
                    }
                    $(this).removeAttr("id");
                });
                idx++;
            });

            idx = 0;
            $con.find("tbody tr:visible").each(function() {
                $(this).find("td.row-seq > .span-row-seq").html(idx + 1);
                idx++;
            });

            $(this).closest("form").attr("form-data-modified", 'true');
        },

        getVisiableRow : function() {
            return this.element.find("tr:visible");
        },

        destroy : function() {
            //
        }
    });
})(jQuery);
