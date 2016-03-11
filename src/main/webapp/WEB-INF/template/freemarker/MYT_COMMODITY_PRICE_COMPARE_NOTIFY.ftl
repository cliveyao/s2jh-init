<#list resultMap?keys as mKey> 
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


    