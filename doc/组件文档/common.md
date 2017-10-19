<link rel="stylesheet" href="http://yandex.st/highlightjs/8.0/styles/github.min.css">
<script src="http://yandex.st/highlightjs/8.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

## 1.common常用公共方法

##### 公用方法
|方法名               |描述                  |
|-|-|
|getRootPath          |获取当前项目地址URL   |        
|cloneArrayDeep       |数组深度克隆，返回一个新的数组|        
|addKey4ArrayObj      |为数组对象批量添加属性|        
|resizeIframeListener |iframe高度根据内容高度自动调整|        
|filterArrayFirst     |获取数组首元素属性，如果数组为空，返回默认值|        
|cleanPageTip         |清除页面气泡提示( 一般为表单校验提示 )      |        
|pageSkip             |滚动条，滚动到指定元素位置|   

#### 示例 
##### 详细
```javascript
//引入文件
var common = require("common");

//返回当前项目地址URL，示例为demo1环境下
common.getRootPath();
// https://demo1.qiejf.com/better

//返回克隆后的对象，避免影响被克隆对象
var arr = [1,2,3]
common.cloneArrayDeep(arr);
// [1, 2, 3]

//遍历数组，添加属性
var arr = [{name:'aaa'},{name:'bbb'}]
common.addKey4ArrayObj(arr,'alive',true)
// [{name:'aaa',alive:true},{name:'bbb',alive:true}]

//首值过滤
var arr1 = [{name:'aaa',value:'100'},{name:'bbb',value:'200'}]
var arr2 = [];
common.filterArrayFirst(arr1); // '100'  #默认返回首元素value属性
common.filterArrayFirst(arr2); // ''    #空列表，返回''
common.filterArrayFirst(arr1,'name'); // 'aaa'  #指定返回首元素name属性

//当Iframe内部高度变化时，调用（模板展开，收缩，表格数据增减以及其他）
common.resizeIframeListener();

//从后台查询列表完毕，刷新表格，调用resize
$scope.queryList(true).success(function(){
    common.resizeIframeListener();
});

//绑定'ngRepeatFinished'事件 ,触发时调用resize
//ngRepeatFinished 事件在 ng-repeat-end指令中定义，标志表格渲染完毕
$scope.$on('ngRepeatFinished',function(){
    common.resizeIframeListener();
});

```




##### Array对象拓展方法（ArrayPlus）
| 参数        |描述      |               
|-|:-:|
|extractChildArray          |提取数组子对象特定值，组成数组或字符串|
|objectChildFilter          |通过属性过滤数组中元素     |
|objectChildFilterByBoolean |通过boolean属性过滤数组中元素|
|replaceChild               |替换数组中元素     |
|addKey4ArrayObj            |为数组中对象批量添加属性     |
|setKeyArrayObj             |为数组中对象批量设置属性     |
|isContain                  |判断数组包含关系，返回true|false     |
|delChild                   |删除数组中特定对象元素     |


#### 示例 
##### 详细

```javascript

//提取特定值
var arr = [{value:100,name:'一百'},{value:200,name:'二百'}]
ArrayPlus(arr).extractChildArray('value',true)
//"100,200"     true 返回字符串
ArrayPlus(arr).extractChildArray('value',false)
//[100, 200]  false 返回数组

//过滤元素，返回符合条件的元素
var arr = [{value:100,name:'一百'},{value:200,name:'二百'}]
ArrayPlus(arr).objectChildFilter('value',100)
//[{value:100,name:'一百'}]

//替换条件的元素
var arr = [{value:100,name:'一百'},{value:200,name:'二百'}]
ArrayPlus(arr).replaceChild('value',100,{name:'replace'})
//[{name:'replace'},{value:200,name:'二百'}]

//为数组中对象批量添加属性
var arr = [{value:100,name:'一百'},{value:200,name:'二百'}]
ArrayPlus(arr).addKey4ArrayObj('alive',true)
//[{value:100,name:'一百',alive:true},{value:200,name:'二百',alive:true}]

//为数组中对象批量设置属性
var arr = [{value:100,alive:true},{value:200,alive:true}]
ArrayPlus(arr).setKeyArrayObj('alive',false)    //无条件设置
//[{value:100,alive:false},{value:200,alive:false}]
var arr = [{value:100,alive:true},{value:200,alive:true}]
ArrayPlus(arr).setKeyArrayObj('alive',false,'value',100)//有条件设置
//[{value:100,alive:false},{value:200,alive:true}]

//判断数组是否包含某元素
var arr = ['0','2'];
ArrayPlus(arr).isContain(1)
//false
ArrayPlus(arr).isContain(2)
//false
ArrayPlus(arr).isContain('2')
//true


//删除特定元素
var arr = [{value:100,alive:true},{value:200,alive:true}]
ArrayPlus(arr).delChild('value',100)
//[{value:200,alive:true}]

```
