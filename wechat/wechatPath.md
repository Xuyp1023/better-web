<style>
a {target:_blank}
</style>
<link rel="stylesheet" href="https://yandex.st/highlightjs/8.0/styles/github.min.css">
<script src="https://yandex.st/highlightjs/8.0/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>



## 微信端路径
[TOC]
> 路由配置文件路径：/wechat/js/route.js
> 主页 index.html#/ 



> ##### 主页
| 业务名称  |路径  |
|-|:-|
|主页|[#/home/finance](https://static.qiejf.com/better/wechat/index.html#/home/finance)|




##### 1.开户
| 业务名称  |路径  |
|-|:-|
|填写基本资料|[#/register/basic] [1]|
|上传认证资料|[#/register/upload] [2]|
|设置交易密码|[#/register/passwd] [3]|
|详情-待审核 |[#/register/waitAudit] [4]|
|详情-待激活 |[#/register/waitActive] [5]|
|查看认证资料|[#/register/show] [6]         |
|开户成功    |[#/register/accountSuccess] [7]|


[1]:https://static.qiejf.com/better/wechat/index.html#/register/basic " #/register/basic"
[2]:https://static.qiejf.com/better/wechat/index.html#/register/upload " #/register/upload"
[3]:https://static.qiejf.com/better/wechat/index.html#/register/passwd " #/register/passwd"
[4]:https://static.qiejf.com/better/wechat/index.html#/register/waitAudit " #/register/waitAudit"
[5]:https://static.qiejf.com/better/wechat/index.html#/register/waitActive " #/register/waitActive"
[6]:https://static.qiejf.com/better/wechat/index.html#/register/show " #/register/show"
[7]:https://static.qiejf.com/better/wechat/index.html#/register/accountSuccess " #/register/accountSuccess"



##### 2.客户关系  
| 业务名称  |路径|
|:-|:-|
|客户关系管理|[#/relation/manage](https://static.qiejf.com/better/wechat/index.html#/relation/manage)|
|选择客户类型|[#/relation/select](https://static.qiejf.com/better/wechat/index.html#/relation/select)|
|关联授信核心企业|[#/relation/core/link](https://static.qiejf.com/better/wechat/index.html#/relation/core/link)|
|关联核心企业成功|[#/relation/core/show](https://static.qiejf.com/better/wechat/index.html#/relation/core/show)|
|关联核心企业详情|[#/relation/core/detail](https://static.qiejf.com/better/wechat/index.html#/relation/core/detail)|
|开通保理融资业务|[#/relation/factor/link](https://static.qiejf.com/better/wechat/index.html#/relation/factor/link)|
|开通保理附件上传|[#/relation/factor/attach](https://static.qiejf.com/better/wechat/index.html#/relation/factor/attach)|
|开通保理确认    |[#/relation/factor/ensure](https://static.qiejf.com/better/wechat/index.html#/relation/factor/ensure)|
|开通保理融资成功|[#/relation/factor/show](https://static.qiejf.com/better/wechat/index.html#/relation/factor/show)|
|开通保理融资详情|[#/relation/factor/detail](https://static.qiejf.com/better/wechat/index.html#/relation/factor/detail)|


##### 3.贸易合同
| 业务名称  |路径|
|:-|:-|
|贸易合同列表|[#/tradeContract/list](https://static.qiejf.com/better/wechat/index.html#/tradeContract/list)|
|添加贸易合同|[#/tradeContract/add](https://static.qiejf.com/better/wechat/index.html#/tradeContract/add)|
|编辑贸易合同|[#/tradeContract/edit/:contractId](https://static.qiejf.com/better/wechat/index.html#/tradeContract/edit/100)|
|查看合同信息|[#/tradeContract/info/:type/:contractId](https://static.qiejf.com/better/wechat/index.html#/tradeContract/info/detail/100)|
|上传合同附件|[#/tradeContract/upload/:contractId](https://static.qiejf.com/better/wechat/index.html#/tradeContract/upload/100)|
|查看合同附件|[#/tradeContract/attach/:contractId](https://static.qiejf.com/better/wechat/index.html#/tradeContract/attach/100)|


##### 4.票据池(新版)
| 业务名称  |路径|
|:-|:-|
|票据池列表|[#/billPool](https://static.qiejf.com/better/wechat/index.html#/billPool)|
|未融资票据详情|[#/billPool/detail/unFi/:id](https://static.qiejf.com/better/wechat/index.html#/billPool/detail/unFi/100)|
|已融资票据详情|[#/billPool/detail/didFi/:id](https://static.qiejf.com/better/wechat/index.html#/billPool/detail/didFi/100)|


##### 5.应收账款相关
| 业务名称  |路径|
|:-|:-|
|应收账款列表|[#/recieve](https://static.qiejf.com/better/wechat/index.html#/recieve)|
|未融资应收详情|[#/recieve/detail/unFi/:id](https://static.qiejf.com/better/wechat/index.html#/recieve/detail/unFi/100)|
|已融资应收详情|[#/recieve/detail/didFi/:id](https://static.qiejf.com/better/wechat/index.html#/recieve/detail/didFi/100)|


##### 6.询价相关
| 业务名称  |路径|
|:-|:-|
|查看票据列表|[#/inquiry](https://static.qiejf.com/better/wechat/index.html#/inquiry)|
|查看票据详情|[#/inquiry/detail/:enquiryNo](https://static.qiejf.com/better/wechat/index.html#/inquiry/detail/100)|
|放弃融资|[#/inquiry/abandon/:id](https://static.qiejf.com/better/wechat/index.html#/inquiry/abandon/100,101)|
|报价记录|[#/inquiry/offerRecord/:enquiryNo](https://static.qiejf.com/better/wechat/index.html#/inquiry/offerRecord/100,101)|
|回复报价|[#/inquiry/reply/:id](https://static.qiejf.com/better/wechat/index.html#/inquiry/reply/100,101)|
|发布询价|[#/inquiry/do/:id](https://static.qiejf.com/better/wechat/index.html#/inquiry/do/100)|


##### 7.融资相关
| 业务名称  |路径|
|:-|:-|
|融资申请|[#/financeBusi/apply](https://static.qiejf.com/better/wechat/index.html#/financeBusi/apply)|
|融资详情|[#/financeBusi/detail/:requestNo](https://static.qiejf.com/better/wechat/index.html#/financeBusi/detail/100)|
|待批融资|[#/financeSearch/pend](https://static.qiejf.com/better/wechat/index.html#/financeSearch/pend)|
|还款融资|[#/financeSearch/repay](https://static.qiejf.com/better/wechat/index.html#/financeSearch/repay)|
|历史融资|[#/financeSearch/history](https://static.qiejf.com/better/wechat/index.html#/financeSearch/history)|


##### 8.融资产品
| 业务名称  |路径|
|:-|:-|
|保理产品|[#/product](https://static.qiejf.com/better/wechat/index.html#/product)|


##### 9.图片预览
| 业务名称  |路径|
|:-|:-|
|图片预览|[#/preImg/:id](https://static.qiejf.com/better/wechat/index.html#/preImg/100)|



##### 10.流程相关
> 路由配置路径：/wechat/flowScript/route.js
> 主页面 flow.html#/ 

| 业务名称  |路径|
|:-|:-|
|待办任务列表|[#/flow/todoList](https://static.qiejf.com/better/wechat/flow.html#/flow/todoList)|
|已办任务列表|[#/flow/didList](https://static.qiejf.com/better/wechat/flow.html#/flow/didList)|
|审批历史记录|[#/flow/flowRecord](https://static.qiejf.com/better/wechat/flow.html#/flow/flowRecord)|
|融资详情|[#/flow/detail](https://static.qiejf.com/better/wechat/flow.html#/finance/detail)|
|融资审批|[#/flow/audit](https://static.qiejf.com/better/wechat/flow.html#/finance/audit)|


