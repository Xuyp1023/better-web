/*
分页专用模块
作者:binhg
*/
define(function(require,exports,module){
	//私有属性:分页属性、分页工具方法
	var _pageParam = {
		pageWapId :'fund_kind',
		callback : new Fuction(),


	},_pageFunc={
		//分页事件
		firstPage : function(){
			currentData.fundListPage.pageNum=1;
			_pageParam.callback();
		},
		endPage : function(){
			currentData.fundListPage.pageNum=currentData.fundListPage.pages;
			_pageParam.callback();
		},
		prevPage : function(){
			currentData.fundListPage.pageNum--;
			_pageParam.callback();
		},
		nextPage : function(){
			currentData.fundListPage.pageNum++;
			_pageParam.callback();
		},
		skipPage : function(data,event){
			var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
			if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>currentData.fundListPage.pages){
				$('#fund_list_page [name="skipToPageNum"]').val('');
				tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
				return;
			}
			currentData.fundListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
			$('#fund_list_page [name="skipToPageNum"]').val('');
			_pageParam.callback();
		}
	};
});