
<table width="680" cellpadding="0" cellspacing="0">
            <tbody><tr>
                <td>
                    <img src="http://img.iyoubox.com/GetFileByCode.aspx?code=E8043381F87CD3057E1F73394F03BAD4" border="0" usemap="#Map">
                </td>
            </tr>
            <tr>
                <td>
                    <table style="margin-top: 5px;" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td style="height: 19px; overflow: hidden; background: url(http://img.iyoubox.com/GetFileByCode/14984E607455F033FE56C30BF01125F5) no-repeat">
                            </td>
                        </tr>
                        <tr>
                            <td style="background: url(http://img.iyoubox.com/GetFileByCode/D88F61341715990677B10F3D12DDD1DB) repeat-y left center;
                                padding: 5px 24px; width: 680px;">
                                <p class="fontstyle_1" style="font-size: 16px; line-height: 29px; color: #333333;
                                    margin: 0 10px; font-weight: bold;">
                                    亲爱的 ${customerProfile.display} ：</p>
                                <p class="fontstyle_2" style="text-indent: 2em; font-size: 16px; line-height: 29px;
                                    color: #333333; margin: 0 10px;">
                                    您好！</p>
                                <p class="fontstyle_2" style="text-indent: 2em; font-size: 16px; line-height: 29px;
                                    color: #333333; margin: 0 10px;">
                                        <span>感谢您在美月淘购物! 我们很高兴地通知您, 您订购的商品已经发货。
								</span></p><p class="fontstyle_2" style="text-indent: 2em; font-size: 16px; line-height: 29px;
                                    color: #333333; margin: 0 10px;">
                                    物流公司: ${saleDelivery.logistics.abbr}</p>
									<p class="fontstyle_2" style="text-indent: 2em; font-size: 16px; line-height: 29px;
                                    color: #333333; margin: 0 10px;">物流单号:${saleDelivery.logisticsNo}</p>
                                <p class="fontstyle_2" style="margin: 0 10px; margin-left: 380px; margin-top: 20px;
                                    text-indent: 2em; font-size: 16px; line-height: 29px; color: #333333;">
                                    美月淘-哎呦盒子团队敬上</p>
                                <p class="fontstyle_2" style="margin: 0 10px; margin-left: 380px; text-indent: 2em;
                                    font-size: 16px; line-height: 29px; color: #333333;">
                                    ${todayDate?string("yyyy年MM月dd日")}</p>
                                <div>
                                        <table width="620" border="0" cellpadding="0" cellspacing="0" class="goods_yuding" style="margin-top: 0px;">
                                            <tbody><tr>
                                                <td width="150" height="25" align="left" valign="middle" bgcolor="#f7f7f7">配送详情
                                                </td>
												 <td width="300" height="25" align="right" valign="middle" bgcolor="#f7f7f7">
                                                    &nbsp;
                                                </td>
												 <td width="170" height="25" align="right" valign="middle" bgcolor="#f7f7f7">
                                                 </td>
                                               
                                            </tr>
											<#list saleDeliveryDetails as item>
                                            <tr>
                                                <td >
												    <div style="overflow: hidden; height: auto; margin: 5px; ">
													  <a href="http://www.meiyuetao.com/product/"+${item.commodity.id?c}+".html">
                                                                    <img style="border: 1px solid #fe638e;overflow: hidden;height: 90px;" width="102" height="90" src="http://img.iyoubox.com/GetFileByCode/${item.commodity.smallPic}">
                                                                </a>
													</div>
												</td>
												<td > 
													<p style=" text-align: center; color: #666; font-size: 14px; overflow: hidden;
                                                                    text-indent: 0;"> <a href="http://www.meiyuetao.com/product/"+${item.commodity.id?c}+".html">
                                                                    ${item.commodity.title}</a></p>
                                                </td>
												<td >
													 <p style=" text-align: center; color: #666; font-size: 14px; overflow: hidden;
                                                                    text-indent: 0;">
                                                                    数量：${item.quantity}</p>
                                                </td>
												
											 </tr>
											 </#list>
                                        </tbody></table>

                                </div>
                                <div class="fontstyle_4" style="background-color: #fff8df; margin-top: 45px; width: 627px;
                                    margin: 45px auto 0 0; clear: both; padding: 0 5px; line-height: 30px; color: #333333;
                                    font-size: 12px;">
                                    注意：您可以在<span style="color: #40b6f7; font-weight: bold;"> <a href="http://www.meiyuetao.com/MYT_Order/Index">
                                        我的订单</a> </span>中查看订单详情。</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: url(http://img.iyoubox.com/GetFileByCode/A266F944DB0102EBCD602741CFB1C011) no-repeat left center;
                                width: 680px; height: 17px;">
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="food" style="width: 641px; padding: 5px; margin: 10px 24px 0 15px; background-color: #fff4f7;
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
                </td>
            </tr>
        </tbody></table>
<map name="Map">
  <area shape="rect" coords="591,26,627,61" target="_blank" href="http://e.weibo.com/u/2529585731">
  <area shape="rect" coords="627,26,664,61" target="_blank" href="http://t.qq.com/meiyuetaoV">
</map>
