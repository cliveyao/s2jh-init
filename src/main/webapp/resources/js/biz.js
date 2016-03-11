/**
 * Custom module for you to write your own javascript functions
 */
// 必须放在外面，否则图片控件不好使
var IMAGE_URL_PREFIX = "http://img.meiyuetao.com/";
var Biz = function() {
    // private functions & variables
    // public functions
    return {
        init : function() {
        },
        md5CodeImgViewFormatter : function(cellValue, options, rowdata) {
            var src = null;
            if (cellValue) {
                src = IMAGE_URL_PREFIX + cellValue;
            } else {
                src = WEB_ROOT + '/assets/img/bg-white.png';
            }
            return "<img class=\"img_thumbnail\"  src=\"" + src + "\" width=\"100%\" >";
        }
    };
}();
