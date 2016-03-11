<html>
<body>
 <table>
	<tr>
		<td>凭证编号:</td>
		<td  width="200">${purchaseReceipt.voucher}</td>
		<td>供货商:</td>
		<td></td>
	</tr> 
	<tr> 
		
		<td>收货时间:</td>
		<td>${purchaseReceipt.createdDate?string("yyyy-MM-dd HH:mm:ss")}</td>
	</tr>
</table>
<span>------------------------------------------------------------------------------------------------------------------------------------------</span>
<table >
	<tr>
		<td  width="500" >收货商品:</td>
		<td  width="200">收货仓库：</td> 
		<td>单位：</td>
		<td>数量：</td> 
		<td>入库成本单价：</td>
		<td>入库总成本：</td>
	</tr> 
	<#list purchaseReceiptDetails as item>
	<tr>
		<td width="500">${item.commodity.display}</td> 
		<td  width="200">${item.storageLocation.display}</td> 
		<td>${item.measureUnit}</td>
		<td>${item.quantity}</td> 
		<td>${item.costPrice}</td>
		<td>${item.costAmount}</td> 
	</tr>
	<tr>
		<td width="500">&nbsp;</td> 
		<td  width="200">&nbsp;</td> 
		<td>&nbsp;</td>
		<td>&nbsp;</td> 
		<td>&nbsp;</td>
		<td>&nbsp;</td> 
	</tr>
	</#list>
</table>
</body>
</html>