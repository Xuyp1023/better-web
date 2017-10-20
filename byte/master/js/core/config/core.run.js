(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$templateCache'];
    function appRun($templateCache) {    

    	//解决IE8之类不支持getElementsByClassName
		if (!document.getElementsByClassName) {
		    document.getElementsByClassName = function (className, element) {
		        var children = (element || document).getElementsByTagName('*');
		        var elements = new Array();
		        for (var i = 0; i < children.length; i++) {
		            var child = children[i];
		            var classNames = child.className.split(' ');
		            for (var j = 0; j < classNames.length; j++) {
		                if (classNames[j] == className) {
		                    elements.push(child);
		                    break;
		                }
		            }
		        }
		        return elements;
		    };
		}

    	/*js原生对象扩展*/
		//Date对象拓展
		if(!Date.now){
			Date.now = function(){
				return new Date().getTime();
			};
		}
		angular.extend(Date.prototype,{
			//日期格式化
			format : function(formatStr){
				formatStr = formatStr||'YYYY-MM-DD HH:mm:SS';
				var FullYearIndex = formatStr.indexOf('YYYY'),
				monthIndex = formatStr.indexOf('MM'),
				dayIndex = formatStr.indexOf('DD'),
				hourIndex = formatStr.indexOf('HH'),
				miniteIndex = formatStr.indexOf('mm'),
				secondIndex = formatStr.indexOf('SS');
				if(FullYearIndex!== -1){
					formatStr = formatStr.replace('YYYY',this.getFullYear()+'');
				}
				if(monthIndex!== -1){
					var thisMonth = this.getMonth()<9?'0'+(this.getMonth()+1):(this.getMonth()+1)+'';
					formatStr = formatStr.replace('MM',thisMonth);
				}
				if(dayIndex !== -1){
					var thisDay = this.getDate()<10?'0'+(this.getDate()):(this.getDate())+'';
					formatStr = formatStr.replace('DD',thisDay);
				}
				if(hourIndex !== -1){
					var thisHours = this.getHours()<10?'0'+(this.getHours()):(this.getHours())+'';
					formatStr = formatStr.replace('HH',thisHours);
				}
				if(miniteIndex !== -1){
					var thisMinites = this.getMinutes()<10?'0'+(this.getMinutes()):(this.getMinutes())+'';
					formatStr = formatStr.replace('mm',thisMinites);
				}
				if(secondIndex !== -1){
					var thisSecond = this.getSeconds()<10?'0'+(this.getSeconds()):(this.getSeconds())+'';
					formatStr = formatStr.replace('SS',thisSecond);
				}
				return formatStr;
			},
			//获取各大浏览器公认的时间
            getCommonDate:function(str){
                return new Date(Date.parse(str.replace(/-/g,"/")));
            },
			//日期前驱范围计算
			getSubDate : function(flag,subNum){
				var FullYearNum = this.getFullYear(),
				monthNum = this.getMonth(),
				dayNum = this.getDate(),
				thisMonthAllDays = new Date(this.getFullYear(),this.getMonth(),0).getDate(),
				prevMonthAllDays = new Date(this.getFullYear(),this.getMonth()-1,0).getDate();
				if(flag === 'YYYY'){
					FullYearNum-=subNum;
				}
				if(flag === 'MM'){
					monthNum -= subNum;
					if(monthNum===0){
						FullYearNum-=1;
					}else if(monthNum<0){
						monthNum+=11;
						FullYearNum-=1;
					}
					if(dayNum>new Date(FullYearNum,monthNum+1,0).getDate()){
						dayNum = new Date(FullYearNum,monthNum+1,0).getDate();
					}
				}
				if(flag === 'DD'){
					dayNum-=subNum;
					if(dayNum===0){
						dayNum = prevMonthAllDays;
						monthNum-=1;
					}else if(dayNum<0){
						dayNum = prevMonthAllDays+dayNum;
						monthNum-=1;
					}
					if(monthNum===0){
						FullYearNum-=1;
					}else if(monthNum<0){
						monthNum+=11;
						FullYearNum-=1;
					}
				}
				return new Date(FullYearNum,monthNum,dayNum);
			},
			//获取当月拥有天数
			getMonthDay : function(){
				return new Date(this.getFullYear(),this.getMonth()+1,0).getDate();
			}
		});

		// 模板文件
		$templateCache.put('bulmaui-table/pager.html',
        '<ul class="pagination-list">'+
          '{{each listPages as value index}}'+  
            '<li>{{#value}}</li>'+  
          '{{/each}}'+
			'<li><button class="bt-btn bt-small pagination-previous" {{if currentPage <= 1}}disabled{{/if}}>上一页</button></li>'+
        	'<li><button class="bt-btn bt-small pagination-next" {{if totalPages <= currentPage}}disabled{{/if}}>下一页</button></li>'+
        '</ul>');
        

        $templateCache.put('bulmaui-select/select.html',
            '<select></select>');

    }

})();