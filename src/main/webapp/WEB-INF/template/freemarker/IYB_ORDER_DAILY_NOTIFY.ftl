<#list resultMap?keys as mKey> 
	<input type="button" value="展开/隐藏" id="btn${mKey_index}" class="btn" onclick="hid(${mKey_index})" >
	
				<font color="red"><big>${mKey}</big></font><big>--共 ${resultMap[mKey]?size} 条记录--时间：${fireTime}</big>
				 <table id="table${mKey_index}" class="table table-condensed table-bordered table-edit table-striped">
					<tr>
						<#assign titleMap = resultMap[mKey][0] > 
						<th align="center"></td>
						<#list titleMap? keys as tKey> 
								<th align="center">${tKey}</td>
						</#list>
					 </tr>
					<#assign items = resultMap[mKey]>   
					<#list items as item> 
					<tr>
						<td>${item_index+1}</td> 
						<#list item?keys as gKey> 
								
								<#if item[gKey]?? >
								<td align="center">${item[gKey]}</td>
								<#else>
								<td align="center">""</td>
								</#if>	
							</#list>
					</tr>
					</#list>
				</table><br>
</#list>


    <#list resultMapHourly ? keys as mKey> 
	<input type="button" value="展开/隐藏" id="btnh${mKey_index}" class="btn" onclick="hidh(${mKey_index})" >
	
				<font color="red"><big>${mKey}</big></font><big>--共 ${resultMapHourly [mKey]?size} 条记录</big>
				 <table   id="tableh${mKey_index}" class="table table-condensed table-bordered table-edit table-striped">
					<tr>
						<#assign titleMap = resultMapHourly [mKey][0] > 
						<th align="center"></td>
						<#list titleMap? keys as tKey> 
								<th align="center">${tKey}</td>
						</#list>
					 </tr>
					<#assign items = resultMapHourly [mKey]>   
					<#list items as item> 
					<tr>
						<td>${item_index+1}</td> 
						<#list item?keys as gKey> 
								<#if item[gKey]?? >
								<td align="center">${item[gKey]}</td>
								<#else>
								<td align="center">""</td>
								</#if>
										
						</#list>
					</tr>
					</#list>
				</table><br>
</#list>
