<link rel="stylesheet" href="http://yandex.st/highlightjs/8.0/styles/github.min.css">
<script src="http://yandex.st/highlightjs/8.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>


## 1.卷帘模态框组件（bt-roll-modal）
>bt-roll-modal :取值传入模版地址 |必填
>bt-z-index :模板层级控制 |可选 
>bt-max-width: 设置模板宽度 |可选 


#### 示例 (引入模板)
##### 调用函数配置
```javascript
//引入文件
require("modal");
//引用模块 modal
var mainApp = angular.module('mainApp',['pagination','modal','upload','date']);
//打开模态框
$scope.openRollModal('add_box');
//关闭模态框
$scope.closeRollModal("add_box");
```

##### 页面引用
```html
<!-- 模态框定义 -->
<div id="add_box" bt-roll-modal="temp/addSend.html" bt-z-index="9991"></div>
```



## 2.卷帘模态框自动关闭指令（bt-close-modal）
##### 页面引用
```html
<!-- 相当于 点击按钮，调用$scope.closeRollModal 关闭当前模态框 -->
<button class="btn btn-primary" bt-close-modal >取消</button>
```



## 3.引入外部模板指令（bt-include）
>bt-include:需要引入的模板地址 必填
>bt-id:为模板根元素设置ID 选填

######其他参数（很少使用）
>bt-include-model:绑定元素上想要传输的模型
>bt-include-link:绑定模型的对应关系
>bt-include-click:绑定事件 bt-include-event
>bt-include-hide:隐藏该模板按钮
>bt-hide:隐藏模板属性


#### 示例 (引入模板)
##### 调用函数配置
```javascript
//引入文件
require("modal");
//引用模块 modal
var mainApp = angular.module('mainApp',['pagination','modal','upload','date']);
```

##### 页面引用
```html
<!-- 把模板内的html替换该div -->
<div bt-include="temp/waitHandle.html"></div>
```





