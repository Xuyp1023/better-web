<link rel="stylesheet" href="http://yandex.st/highlightjs/8.0/styles/github.min.css">
<script src="http://yandex.st/highlightjs/8.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

## 1.校验规则

##### 常用校验规则( 无参数 )
|校验规则       |名称     |描述
|-|:-:|-|
|required       |必填      | 不能为空
|money          |金额      | 正数且小数点后保留两位 88.88
|nozero         |非零      | 不能为 0
|float          |浮点数    | 正数且支持1-2位小数  1.0/2.11
|email          |邮箱      | 15365874587@163.com
|fax            |传真号码  | 
|zipcode        |邮编      |
|identNo        |身份证号  | 
|mobile         |手机号码  | 15361468784
|phone          |电话号码  | 15361469918/ 8145755/ 0734-8547854

##### 常用校验规则( 传递参数 param ）
|校验规则       |名称      |描述
|-|:-:|-|
|strmin         |最小长度  | 
|strmax         |最大长度  | 



#### 示例 
##### 详细
```javascript
//引入文件
var validate = require("validate");

//校验规则配置 示例
var validOption = {
      elements: [
      {   //单规则
          name: 'info.description',
          rules: [{name: 'email'}],
          events: ['blur']
      },{ //多规则
          name: 'info.loanBalance',
          rules: [{name: 'required'},{name: 'money'}],
          events: ['blur']
      },{ //多规则，且有规则需要参数
          name: 'info.operOrg',
          rules: [{name: 'required'}, {name:'strmin', params:{strmin:5}}],
          events: ['blur']
      }],
      // 规则校验不通过，弹出气泡提示
      errorPlacement: function(error, element) {
          var label = element.parents('td').prev().text().substr(0);
          tipbar.errorLeftTipbar(element,label+error,0,99999);
      }
};

//将校验规则绑定到DOM元素上  validOption:校验规则
validate.validate($('#add_box'),validOption);

//调用校验方法，返回true|false
var valid = validate.validate($('#add_box'));
if(!valid) return;

```
