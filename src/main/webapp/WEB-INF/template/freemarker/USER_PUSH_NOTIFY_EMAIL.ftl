<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="Generator" content="EditPlus®">
		<meta name="Author" content="">
		<meta name="Keywords" content="">
		<meta name="Description" content="">
		<title>Document</title>
		
		<style type="text/css">
		* {
		  margin: 0;
		  padding: 0;
		}
		body {
		  color: #555;
		  font-family: "微软雅黑","宋体";
		  font-size: 12px;
		}
		a {
		  color: #333;
		  text-decoration: none;
		}
		A {
		  color: #666;
		}
		.booth_home_zg_comet_ljgm {
		  height: auto;
		  overflow: hidden;
		  padding: 5px 0 0 5px;
		}
		.booth_home_zg_comet_rightimg {
		  background: none repeat scroll 0 0 #fff;
		  box-shadow: 1px 1px 1px #ddd;
		  float: left;
		  height: auto;
		  margin-bottom: 5px;
		  margin-right: 5px;
		  overflow: hidden;
		  width: 220px;
		}
		.booth_home_zg_comet_rightimg_sp01 {
		  display: block;
		  font-size: 12px;
		  height: 20px;
		  line-height: 20px;
		  margin: 0 15px;
		  overflow: hidden;
		  width: 204px;
		  text-overflow:ellipsis;
          white-space:nowrap;
          overflow:hidden;
		}
		.booth_home_zg_comet_rightimg_sp02 {
		  color: #f00;
		  font-family: "微软雅黑","宋体";
		  font-size: 20px;
		  font-weight: bold;
		  margin: 0 15px;
		}


		myt.header {
			height: 98px;
			margin: 0 auto;
			clear: both;
		}
		myt.header img{
			margin-top: 18px;
		}
		.myt-base {
			margin-left: auto;
			margin-right: auto;
			width: 680px;
		}
		.myt-content {
			background: #f1f1f1;
		}
		.myt-msg {
			font-size: 16px;
			padding: 5px;
			margin-bottom: 5px;
			background-color: #f1f1f1;
			color: #999999;
		}
		.myt-footer p{
			margin-top: 10px;
		}
		</style>
	</head>
	<body>
		<div class="myt-base">
			<div class="myt-header">
				<a href="http://www.meiyuetao.com/">
					<img src="http://img.meiyuetao.com/mytlogo.gif" border="0" >
				</a>
				<img src="http://img.meiyuetao.com/71A19D19D44C5C14772B9C6B0DDA8C71" border="0" 
						style="display:inline;float:right" usemap="#Map">
			</div>
			<div class="myt-msg">
				${pfix}<br>
				${sfix}
			</div>
			<div class="myt-content">
				<div class="booth_home_zg_comet_ljgm">
					<#list list as item>
			            <div class="booth_home_zg_comet_rightimg">
			                <a target="_blank" href="${item.commodityUrl}">
			                    <img height="210" width="210" title="${item.commodity.title}" src="http://img.meiyuetao.com/${item.commodity.smallPic}?imageView/2/w/210">
			                    <span class="booth_home_zg_comet_rightimg_sp01" title="${item.commodity.title}">${item.commodity.title}</span>
			                    <span class="booth_home_zg_comet_rightimg_sp02">
			                    	<span style="font-size: 12px; color: #999;">￥</span>
			                    	${item.commodity.price}
			                    </span>
			                </a>
			            </div>
			        </#list>
		        </div>
			</div>
			<div class="myt-footer">
				<div class="food" style="padding: 5px; background-color: #fff4f7;
	                border: 1px dashed #d6d6d6; border-bottom: none;">
	                <p style="text-align: right; font-size: 14px; color: #999999;">
	                	需要帮助？有建议？有反馈？请点击<a href="http://www.meiyuetao.com/Help/Index/?StaticId=MHelp.FAQ" style="color: #3f7f99;"><strong> 用户帮助及反馈 </strong></a>或拨打：400-898-6221</p>
	                <p style="text-align: right; font-size: 12px; color: #333333; margin-top: 15px;">
	                    想要了解更多关于什么是按月预定、美月淘及哎呦盒子的信息，请访问：<a href="http://www.meiyuetao.com/Help/Index/?StaticId=MHelp.FAQ" style="color: #3f7f99;"> 入门指南 </a>获得更多的了解</p>
	                <p style="text-align: right; font-size: 12px; color: #333333;">
	                    这是一封自动生成的邮件，请不要回复，因为此发件人不能接收邮件</p>
	                <p style="text-align: right; font-size: 12px; color: #333333;">
	                    如果您不想收到此类邮件， 请登陆<a href="http://www.meiyuetao.com" style="color: #3f7f99;">美月淘网站</a></p>
	                <p style="text-align: right; font-size: 12px; color: #333333;">
	                    我们不会出售或分享您的邮件地址给任何第三方</p>
	            </div>
			</div>
		</div>
		<map name="Map">
			<area shape="rect" coords="0,0,95,35" target="_blank" href="http://www.meiyuetao.com/Help/Index/?StaticId=MHelp.FreePost">
		  	<area shape="rect" coords="95,0,190,35" target="_blank" href="http://www.meiyuetao.com/Help/Index/?StaticId=MHelp.100Percent">
		  	<area shape="rect" coords="190,0,290,35" target="_blank" href="http://www.meiyuetao.com/Help/Index/?StaticId=MHelp.7DayReturn">
		</map>
	</body>
</html>