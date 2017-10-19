define("p/provider/1.0.0/repayPlan",["./libs/validate","./libs/tooltip","./libs/common","./libs/dialog","dialogEx","./libs/loading","./libs/commondirect"],function(a){a.async(["dicTool","bootstrap","datePicker"],function(){a.async(["BTDictData"],function(){a("./libs/validate");var b=a("./libs/tooltip");a("./libs/common"),a("./libs/loading");var c=a("./libs/commondirect");a("angular");var d=angular.module("mainApp",[]);c.direcPlus(d),d.controller("testController",function(a){a.tradeListPage={pageNum:1,pageSize:10,pages:1,total:1},a.searchData={GTEtradeDate:(new Date).getSubDate("MM",3).format("YYYY-MM-DD"),LTEtradeDate:(new Date).format("YYYY-MM-DD"),applyCode:"",reCode:""},a.showDetail=function(a){$(a.target||a.srcElement),$("#fix_operator_info_box").height($("body").height()).slideDown()},a.backForward=function(){$("#fix_operator_info_box").slideUp()},a.dateEmitter={changeDateInfo:function(b){var c=b.target||b.srcElement,d=$(c).attr("dateName"),e=$(c).attr("dateData");a[e][d]=c.value}},a.pageEmitter={firstPage:function(){currentData.tradeListPage.pageNum=1,_personModule.reFreshTradList(!1)},endPage:function(){currentData.tradeListPage.pageNum=currentData.tradeListPage.pages,_personModule.reFreshTradList(!1)},prevPage:function(){currentData.tradeListPage.pageNum--,_personModule.reFreshTradList(!1)},nextPage:function(){currentData.tradeListPage.pageNum++,_personModule.reFreshTradList(!1)},skipPage:function(a,c){var d=$('#fund_list_page [name="skipToPageNum"]').val();return isNaN(d)||d.split(".").length>1||Number(d)<1||Number(d)>currentData.tradeListPage.pages?($('#fund_list_page [name="skipToPageNum"]').val(""),b.errorTipbar($(c.target),"请填写正确的页数!",1e3),void 0):(currentData.tradeListPage.pageNum=Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0),$('#fund_list_page [name="skipToPageNum"]').val(""),_personModule.reFreshTradList(!1),void 0)}},window.dateEmitter={changeDateInfo:function(){}}}),angular.bootstrap($("#container"),["mainApp"])})})}),define("p/provider/1.0.0/libs/validate",[],function(a,b){var c={isEmpty:function(a){return""===a.val()||null===a.val()||void 0===a.val()},packageValidAttr:function(a,b){var c=b.elements,d=a.find(":input");return d.each(function(){var a=$(this).attr("valid"),d=$(this).attr("name"),e=!1;if(a&&""!==a){a=JSON.parse(a.replace(/'/g,'"'));for(var f in c){var g=c[f];if(g.name===d){e=!0;var h=g.rules;for(var i in h){var j=h[i];for(var k in a)a[k],k===j.name&&delete a[k]}for(var l in a){var m=a[l];c[f].rules.push({name:l,message:m===!0?"":m})}}}if(!e){var n=[];for(var o in a){var p=a[o];n.push({name:o,message:p===!0?"":p})}b.elements.push({name:d,rules:n,events:["blur"]})}}}),b}},d={required:function(a,b,c){return $.browser.msie&&Number($.browser.version)<9&&a.attr("placeholder")&&a.attr("placeholder")===a.val()?c&&""!==c?c:"此项必须填写":null!==a.val()&&""!==a.val()&&void 0!==a.val()?!0:c&&""!==c?c:"此项必须填写"},repwd:function(a,b,d){return c.isEmpty(a)?!0:c.isEmpty(b.target)||b.target.val()!==a.val()?d&&""!==d?d:"请保持密码与确认密码的一致性":!0},min:function(a,b,d){return c.isEmpty(a)?!0:isNaN(a.val())||!isNaN(a.val())&&!isNaN(b.min)&&Number(a.val())>=Number(b.min)?!0:d&&""!==d?d:"此项可填写的数值不低于"+b.min},strmin:function(a,b,d){return c.isEmpty(a)?!0:a.val().length>=b.strmin?!0:d&&""!==d?d:"此项可填写的长度必须大于或等于"+b.strmin},max:function(a,b,d){return c.isEmpty(a)?!0:isNaN(a.val())||!isNaN(a.val())&&!isNaN(b.max)&&Number(a.val())<=Number(b.max)?!0:d&&""!==d?d:"此项可填写的数值不高于"+b.max},strmax:function(a,b,d){return c.isEmpty(a)?!0:a.val().length<=b.strmax?!0:d&&""!==d?d:"此项可填写的长度必须小于或等于"+b.max},money:function(a,b,d){return c.isEmpty(a)?!0:/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/.test(a.val())?!0:d&&""!==d?d:"请填写正确的数值(例如8888888.88,正数且小数点后保留两位)"},email:function(a,b,d){return c.isEmpty(a)?!0:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(a.val())?!0:d&&""!==d?d:"请填写格式正确的邮箱"},mobile:function(a,b,d){return c.isEmpty(a)?!0:/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(a.val())?!0:d&&""!==d?d:"请填写格式正确的手机号码"},phone:function(a,b,d){return c.isEmpty(a)?!0:/^((\d{3,4}-)?\d{7,8})$|^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(a.val())?!0:d&&""!==d?d:"请填写格式正确的电话号码"},fax:function(a,b,d){return c.isEmpty(a)?!0:/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(a.val())?!0:d&&""!==d?d:"请填写格式正确的传真号码"},zipcode:function(a,b,d){return c.isEmpty(a)?!0:/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(a.val())?!0:d&&""!==d?d:"请填写格式正确的邮编号码"},minlength:function(){}};window.validateCache={},b.validate=function(a,b){if(arguments.length>1){b=c.packageValidAttr(a,b),validateCache[a.attr("id")]=b;for(var e=0;e<b.elements.length;e++){var f=b.elements[e],g=a.find('[name="'+f.name+'"]');g.length>0&&g.each(function(a){g[a].tempElement=f});for(var h=0;h<f.events.length;h++){var i=f.events[h];g.bind(i,function(){for(var a=this.tempElement,c=0;c<a.rules.length;c++){var e=a.rules[c],f=d[e.name]($(this),e.params,e.message);if(f!==!0){b.errorPlacement(f,$(this));break}}})}}}else if(arguments.length>0){for(var j=validateCache[a.attr("id")],k=!0,l=0;l<j.elements.length;l++){var m=j.elements[l];if(m.name&&""!==m.name)for(var n=a.find('[name="'+m.name+'"]'),o=0;o<m.rules.length;o++){var p=m.rules[o],q=d[p.name](n,p.params,p.message);if(q!==!0){j.errorPlacement(q,n),k=!1;break}}}return k}},b.cleanValidate=function(a,b,c,d){if(a.is("form")&&d)a.find(":input").each(function(){if(null===c||void 0===c)$(this).unbind();else for(var a=0;a<c.length;a++){var b=c[a];$(this).unbind(b)}});else if(a.is("form")&&!d)for(var e=0;e<b.length;e++){var f=b[e];if(null===c||void 0===c||void 0===c[f]||null===c[f])a.find('[name="'+f+'"]').unbind();else for(var g=0;g<c[f].length;g++){var h=c[f][g];a.find('[name="'+f+'"]').unbind(h)}}}}),define("p/provider/1.0.0/libs/tooltip",[],function(a,b){var c={tipabarBind:function(a,b,c,d,e){d&&b.css("zIndex",d),a.is("button")&&setTimeout(function(){b.remove(),e&&e()},3e3),c&&0!==c&&!isNaN(c)&&setTimeout(function(){b.remove(),e&&e()},c),a.one("focus",function(){b.remove()}),window.onresize=function(){var c=a.offset().left+a.outerWidth()+8,d=a.offset().top+a.height()/2-10;b.css({top:d+"px",left:c+"px"})}}};b.errorTipbar=function(a,b,d,e){if(a.length<1)return console&&console.log("创建提示框时找不到响应对象，其选择器为:"+a.selector),void 0;var f=$('<div mapping="tipbar" class="tipbar-wrap">'+b+'<div class="tipbar-wrap-arrow"></div></div>');f.appendTo($("body"));var g=a.offset().left+a.outerWidth()+8,h=a.offset().top+a.height()/2-10;f.css({top:h+"px",left:g+"px"}),c.tipabarBind(a,f,d,e)},b.errorTopTipbar=function(a,b,d,e,f){if(a.length<1)return console&&console.log("创建提示框时找不到响应对象，其选择器为:"+a.selector),void 0;var g=$('<div mapping="tipbar" class="tipbar-wrap">'+b+'<div class="tipbar-wrap-arrow-top"></div></div>');g.appendTo($("body"));var h=a.offset().left+10,i=a.offset().top-g.outerHeight()-10;g.css({top:i+"px",left:h+"px"}),c.tipabarBind(a,g,d,e,f)},b.errorLeftTipbar=function(a,b,d,e){if(a.length<1)return console&&console.log("创建提示框时找不到响应对象，其选择器为:"+a.selector),void 0;var f=$('<div mapping="tipbar" class="tipbar-wrap">'+b+'<div class="tipbar-wrap-arrow-left"></div></div>');f.appendTo($("body"));var g=a.offset().left-f.outerWidth()-8,h=a.offset().top+a.height()/2-10;f.css({top:h+"px",left:g+"px"}),c.tipabarBind(a,f,d,e)},b.infoTopTipbar=function(a,b){var c={msg_box_cls:"alert alert-success alert-block",msg_box_width:"80%",slideDownTime:500,during:1500,slideUpTime:500,fontColor:"rgb(70, 136, 71)",inIframe:!1},d=$.extend(c,b||{}),e=$(window.parent.document).find("iframe").filter("#mainshow");e.length>0&&(d.inIframe=!0);var f=d.msg_box_cls.split(" ").join("-"),g=$('<div mapping="'+f+'" class="'+d.msg_box_cls+'"><p>'+a+"</p></div>");return g.css({width:d.msg_box_width,position:"fixed",zIndex:800,textAlign:"center",top:0,left:"50%",color:d.fontColor,display:"none"}).appendTo(d.inIframe?$("body"):$(window.parent.document.body)).css("marginLeft","-"+g.outerWidth()/2+"px").slideDown(d.slideDownTime,function(){window.setTimeout(function(){g.slideUp(d.slideUpTime,function(){g.remove()})},d.during)}),$(window).unload(function(){g.remove()}),g},b.boxTopTipbar=function(a,b,c,d){var e={wrapCss:{position:"absolute",left:0,top:0,zIndex:900,display:"none",backgroundColor:"white"},closeSelector:".close-tipbar",slideDownSpeed:"slow",slideUpSpeed:"slow"},f=$.extend(!0,e,null===d||void 0===d?{}:d),g=$("<div></div>");"static"===b.css("position")&&b.css("position","relative").attr("isStatic","true"),a=$(a.html()),g.css(f.wrapCss).css({width:b.width()+"px",height:b.height()+"px"}).appendTo(b).append(a).slideDown(f.slideDownSpeed);var h=function(){"true"===b.attr("isStatic")&&b.css("position","static").attr("isStatic","false"),g.slideUp(f.slideUpSpeed,function(){$(this).remove()})};c?c.click(function(){h()}):$(a).find(f.closeSelector).click(function(){h()})},b.cleanPageTip=function(){$('[mapping="tipbar"]').remove()}}),define("p/provider/1.0.0/libs/common",["p/provider/1.0.0/libs/tooltip","p/provider/1.0.0/libs/dialog","dialogEx"],function(a,b){a("p/provider/1.0.0/libs/tooltip");var c={token:"",setAjaxHeader:function(a){$.ajaxSetup({beforeSend:function(b){b.setRequestHeader("token",a)}})},getRemoteToken:function(){$.ajax({url:b.getRootPath()+"/p/testdata/testToken.json",type:"post",dataType:"json",async:!1,success:function(a){c.setAjaxHeader(a.token)}})}};b.getRootPath=function(){var a=window.document.location.href,b=window.document.location.pathname,c=a.indexOf(b),d=a.substring(0,c),e=b.substring(0,b.substr(1).indexOf("/")+1),f=-1===location.href.indexOf("qiejf")?"/better":"";return d+e+f},b.getBFSRootPath=function(){var a=window.document.location.href,b=window.document.location.pathname,c=a.indexOf(b),d=a.substring(0,c),e=b.substring(0,b.substr(1).indexOf("/")+1);return-1===location.href.indexOf("qiejf")?"/fund":"",d+e},b.isBFS=function(){return-1!==location.href.indexOf("qiejf.com")?!1:!0},b.splitArray=function(a,b){for(var c=[],d=0;d<a.length;){var e=a.slice(d,d+b);c.push(e),d+=b}return c},b.cloneArrayDeep=function(a){for(var b=[],c=0;c<a.length;c++){var d=a[c];d instanceof Array?d=arguments.callee(d):d instanceof Object&&(d=$.extend(!0,{},d)),b.push(d)}return b},b.pakageCheckBoxValue=function(a){var b={};return a.each(function(a){b[a]=this.checked}),b},b.setCheckBoxValue=function(a,b){a.each(function(a){this.checked=b[a]})},b.setUncheckCss=function(a){a.prev("span").removeClass("unchecked").end().filter(":not(:checked)").prev("span").addClass("unchecked")},b.setUnionCheck=function(a){a.filter(":not(.right-text-checkbox)").prev("span").css("cursor","pointer").click(function(){$(this).next(":checkbox")[0].checked=!$(this).next(":checkbox")[0].checked}),a.filter(".right-text-checkbox").next("span").css("cursor","pointer").click(function(){$(this).prev(":checkbox")[0].checked=!$(this).prev(":checkbox")[0].checked})},b.addKey4ArrayObj=function(a,b,c){for(var d=[],e=0;e<a.length;e++){var f=a[e];f[b]=c,d.push(f)}return d},b.resizeIframe=function(a){var b=$(document).find("body").outerHeight()+20,c=$(window.parent.document).find("#content_iframe");b<c.height()||(toHeight=b-c.height()>0?"+="+(b-c.height()):"-="+(c.height()-b),c.animate({height:toHeight+"px"},a||1500))},b.formaterDate=function(a){if(a.split("-").length>1)return a;a+="";var b="";return b+=a.substr(0,4)+"-"+a.substr(4,2)+"-"+a.substr(6)},b.formaterPoint4=function(a){return Number(a).toFixed(4)},b.formaterPoint2=function(a){return Number(a).toFixed(2)},b.formaterThounthand=function(a,b){a=Number(a).toFixed(b||2)+"";var c=a.split(".");a=c[0];var d="";"-"===a.substr(0,1)&&(d=a.substr(0,1),a=a.substr(1));for(var e=c[1]||"",f=[],g=a.length;g>-3;){if(a.length<=3){f.push(a);break}if(g-=3,f.push(a.substr(g,3)),3>=g&&g>0){f.push(a.substr(0,g));break}}return d+f.reverse().join(",")+"."+e},b.formaterPercent=function(a){return a+"%"},b.serializeSingleObject=function(a){var b="",c=0;for(var d in a){var e=a[d];"object"==typeof e&&e instanceof Array&&(e=e.join(",")),("function"!=typeof e||"object"!=typeof e)&&(0===c?(b+=d+"="+e,c++):b+="&"+d+"="+e)}return b},b.isEmptyObject=function(a){var b=!0;for(var c in a)b=!1;return b},b.formaterJsonUglify=function(a){return JSON.stringify(a).replace(/\{/g,"$left_quote$").replace(/\}/g,"$right_quote$").replace(/"/g,"$double_quote$").replace(/:/g,"=").replace(/\[/g,"$left_middle_quote$").replace(/\]/g,"$right_middle_quote$")},b.packageJsonFromUglify=function(a){return a=a.replace(/\$left_quote\$/g,"{").replace(/\$right_quote\$/g,"}").replace(/\$double_quote\$/g,'"').replace(/=/g,":").replace(/\$left_middle_quote\$/,"[").replace(/\$right_middle_quote\$/,"]"),JSON.parse(a)},b.getToday=function(){return new Date},b.getCurrentDate=function(){var a=new Date;return a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate()},b.getMonthDay=function(a,b){var c=new Date(a,b,0);return c.getDate()},b.cleanPageTip=function(){$('[mapping="tipbar"]').remove()},$.extend(Date.prototype,{format:function(a){a=a||"YYYY-MM-DD HH:mm:SS";var b=a.indexOf("YYYY"),c=a.indexOf("MM"),d=a.indexOf("DD"),e=a.indexOf("HH"),f=a.indexOf("mm"),g=a.indexOf("SS");if(-1!==b&&(a=a.replace("YYYY",this.getFullYear()+"")),-1!==c){var h=this.getMonth()<9?"0"+(this.getMonth()+1):this.getMonth()+1+"";a=a.replace("MM",h)}if(-1!==d){var i=this.getDate()<10?"0"+this.getDate():this.getDate()+"";a=a.replace("DD",i)}if(-1!==e){var j=this.getHours()<10?"0"+this.getHours():this.getHours()+"";a=a.replace("HH",j)}if(-1!==f){var k=this.getMinutes()<10?"0"+this.getMinutes():this.getMinutes()+"";a=a.replace("mm",k)}if(-1!==g){var l=this.getSeconds()<10?"0"+this.getSeconds():this.getSeconds()+"";a=a.replace("SS",l)}return a},getSubDate:function(a,b){var c=this.getFullYear(),d=this.getMonth(),e=this.getDate(),f=(new Date(this.getFullYear(),this.getMonth(),0).getDate(),new Date(this.getFullYear(),this.getMonth()-1,0).getDate());return"YYYY"===a&&(c-=b),"MM"===a&&(d-=b,0===d?c-=1:0>d&&(d+=11,c-=1),e>new Date(c,d+1,0).getDate()&&(e=new Date(c,d+1,0).getDate())),"DD"===a&&(e-=b,0===e?(e=f,d-=1):0>e&&(e=f+e,d-=1),0===d?c-=1:0>d&&(d+=11,c-=1)),new Date(c,d,e)},getMonthDay:function(){return new Date(this.getFullYear(),this.getMonth()+1,0).getDate()}}),window.ArrayPlus=function(a){return $.extend(a,{objectChildFilter:function(a,b){var c=[];for(var d in this){var e=this[d];e[a]&&-1!==(e[a]+"").indexOf(b+"")&&c.push(e)}return c},addKey4ArrayObj:function(a,b){for(var c=[],d=0;d<this.length;d++){var e=this[d];e[a]=b,c.push(e)}return c},splitBy:function(a){for(var b=[],c=0;c<this.length;){var d=this.slice(c,c+a);b.push(d),c+=a}return b}})},c.getRemoteToken(),window.setInterval(function(){c.getRemoteToken()},6e5),$(".nav-tabs").on("shown",function(){b.resizeIframe(),b.cleanPageTip()}),$.ajaxSetup({error:function(){console&&console.log(arguments)},complete:function(c){var d=c.responseText;try{var e=JSON.parse(d);if(401===e.code){var f=a("p/provider/1.0.0/libs/dialog");f.alert("您还未登录或已退出登录，请先执行登录操作!",function(){var a=window.parent.location.href.split("/");a.pop(),b.isBFS()||window.parent.location.replace(a.join("/")+"/login.html")})}}catch(g){}}})}),define("p/provider/1.0.0/libs/dialog",["dialogEx"],function(a,b){var c=a("dialogEx");b.confirm=function(a,b,d){c({title:"提示信息",content:a||"提示信息",width:300,fixed:!0,okValue:"确定",ok:b||function(){},cancelValue:"取消",cancel:d||function(){}}).showModal()},b.tip=function(a,b,d){var e=c({title:"提示信息",content:a||"提示信息",width:300,fixed:!0,close:d||null}).showModal();setTimeout(function(){e.close().remove()},1e3*b)},b.alert=function(a,b){c({title:"警告信息",content:a||"警告信息",width:300,fixed:!0,ok:b||null}).showModal()},b.error=function(a,b){c({title:"错误提示",content:a||"错误提示",width:300,fixed:!0,ok:b||!0}).showModal()},b.success=function(a,b,d){var e=c({title:"成功提示",content:a||"成功提示",width:300,fixed:!0,close:d||null}).showModal();setTimeout(function(){e.close().remove()},1e3*b)}}),define("p/provider/1.0.0/libs/loading",[],function(a,b){b.addLoading=function(a,b){var c,d,e,f,g=a.css("position");if("static"===g&&a.css("position","relative").attr("isStatic","true"),a.is("table")){var h=a.find("tbody:visible");if(h.find("tr td").length<1)return;d=h.height()+"px",c=a.width()+"px",e=h.position().left+"px",f=h.position().top+"px"}else d="100%",c="100%",e=0,f=0;var i=$('<div mapping="loading"></div>');a.append(i),i.css({opacity:.2,cursor:"pointer",background:"black",position:"absolute",left:e,top:f,zIndex:9999,width:c,height:d});var j=$('<img src="'+b+'/p/img/loading.gif" alt="正在加载中...." />');i.append(j),j.css({position:"absolute",left:"50%",top:"50%",width:"50px",height:"50px"}).css({marginLeft:"-"+j.width()/2+"px",marginTop:"-"+j.height()/2+"px"})},b.removeLoading=function(a,b){setTimeout(function(){"true"===a.attr("isStatic")&&a.css("position","static").removeAttr("isStatic"),a.find('[mapping="loading"]').remove(),b&&b()},200)}}),define("p/provider/1.0.0/libs/commondirect",[],function(a,b){b.direcPlus=function(a){a.directive("ngFocus",["$parse",function(a){return function(b,c,d){var e=a(d.ngFocus);c.bind("focus",function(a){b.$apply(function(){e(b,{$event:a})})})}}]),a.directive("ngBlur",["$parse",function(a){return function(b,c,d){var e=a(d.ngBlur);c.bind("blur",function(a){b.$apply(function(){e(b,{$event:a})})})}}]),a.directive("ngLoad",["$parse",function(a){return function(b,c,d){var e=a(d.ngLoad);c.bind("load",function(a){b.$apply(function(){e(b,{$event:a})})})}}])}});
