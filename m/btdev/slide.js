/*
* 幻灯轮换效果 v1.0
* explain:
	new csc.slide("#id","#id>li",{
		slideDirection：2，
		slideButs_bindsj："mosemove"
		slides_fun: function(i){alert("现在切换到第3项"i);}
	})
* demo:
*/

/*
* 构造函数
* slideInner	幻灯片的容器一般是"ul"。
* slides    	幻灯片组，一般是"ul>li"
* options   	详细的配置json对像，参看slide.options的注释
*/
define(function(require, exports, module){
	var slide = function(slideInner,slides,options){
		this.slideButs_arr = [];
		this.slideInner=$(slideInner);
		this.slides=$(slides);
		this.setOptions(options);
		this.info();
	};
	slide.prototype={
		numberOfSlides:-1,
		slides_xc:null,
		zantin:false,
		setOptions:function(options){
			this.options={
				currentPosition:0,	//最开始在第几张幻灯片
				slideWidth:180,		//元素块的宽度 slideDirection为0时必填
				slideHeight:180,	//元素块的宽度 slideDirection为1时必填	
				slideDirection:0,	//切换样式 0：横向滚动 1：垂直滚动 2：渐显
				slideButs:null,		//切换按钮容器，样式自定义
				slideButs_html:null,//切换按钮html 可以是反回HTML函数，具体参看shenchen_buts;
				slideButs_bindsj:"click",//触发切换的事件
				slideButs_selectclass:"s",//未实现，预留 当前幻灯按钮样式
				slides_xssm:1,		//容器显示项的个数 当slideDirection不为2时有效果 （基础效果，slideDirection不能为2 渐显）
				slides_auto_span:5000,//自动切换间隔 0为关闭自动切换
				slides_span:"normal",//切换速度 jquery切换速度关键字或数字（毫秒）
				slides_to_l:null,//前一个事件绑定对象
				slides_to_r:null,//后一个事件绑定对象
				slides_controller: null,//控制切换的按钮容器,
				slides_controller_event: 'mouseover',//控制切换按钮的事件
				slides_controller_curStyle: 'cur',//当前切换按钮的样式
				slides_title:null,//切换当前显示的标题控件
				slides_easing:null,//添加动画函数
				slides_fun:function(i){}//每次切换执行的函数，i为切换后的位置。
			};
			for(var o in options){
				this.options[o]=options[o];
			};
			for(var p in this.options){
				this[p] = this.options[p];
			}
		},
		manageControls:function(position){//核心方法,实现切换
			var o = this;
			if(this.slides_xc) {clearTimeout(this.slides_xc);}
			if(this.zantin){this.slides_xc = setTimeout(function(){o.manageControls(position)},1000); return;}
			position = this.numberOfSlides-1 > position ? position : this.numberOfSlides-1;
			position = position>=0?position:0;
			this.currentPosition = position;
			this.autoint = position >= this.numberOfSlides-1 ? 0 : position+1;
			this.slideButsStyle();
			this.slides_fun.call(o,position);
			this.slideInner.stop();
			switch(this.slideDirection)
			{
				case 0:
					if(this.slides_controller) {
						$(this.slides_controller).find('li').eq(position).addClass(this.slides_controller_curStyle).siblings().removeClass(this.slides_controller_curStyle);
						$(this.slides_title).html($(this.slides).eq(this.currentPosition).find('img').attr('alt'));
					}
					this.slideInner.animate({'left':this.slideWidth*(-position)},this.slides_span,this.slides_easing ? this.slides_easing : 'linear');
					break;
				case 1:
					if(this.slides_controller) {
						$(this.slides_controller).find('li').eq(position).addClass(this.slides_controller_curStyle).siblings().removeClass(this.slides_controller_curStyle);
						$(this.slides_title).html($(this.slides).eq(this.currentPosition).find('img').attr('alt'));
					}
					this.slideInner.animate({'top':this.slideHeight*(-position)},this.slides_span,this.slides_easing ? this.slides_easing : 'linear');
					break;
				case 2:
					//this.slides.not(this.slides[this.currentPosition]).css({'z-index':1,"display":"none"});
					//this.slides.not(this.slides[this.currentPosition]).css({'z-index':3}).hide(this.slides_span);
					if(this.slides_controller) {
						$(this.slides_controller).find('li').eq(position).addClass(this.slides_controller_curStyle).siblings().removeClass(this.slides_controller_curStyle);
						$(this.slides_title).html($(this.slides).eq(this.currentPosition).find('img').attr('alt'));
					}
					this.slides.not(this.slides[this.currentPosition]).css({'z-index':3}).fadeOut(this.slides_span);
					$(this.slides[this.currentPosition]).css({'z-index':2,'display':""}).fadeIn(this.slides_span);
					break;
			}
	/*		if(this.slideDirection){
				this.slideInner.animate({'top':this.slideHeight*(-position)},this.slides_span);
			}else{
				this.slideInner.animate({'left':this.slideWidth*(-position)},this.slides_span);
			}*/
			if(this.slides_auto_span){
				o.slides_xc = setTimeout(function(){o.manageControls(o.autoint)},o.slides_auto_span)
			}
		},
		shenchen_buts:function(){//生成控制按钮
			var o = this;
			if(this.slideButs){
				for(var i=0;i<this.numberOfSlides;i++){
					var dom;
					if(!this.slideButs_html){
						dom=$("<a href=\"javascript:;\" onfocus=\"this.blur()\">"+(i+1)+"</a>");
					}else if(typeof(this.slideButs_html)=="function"){
						dom=$(this.slideButs_html(i));
					}else{
						dom=$(this.slideButs_html);
					}
					+function(){
						var n = i;
						dom.bind(o.slideButs_bindsj,function(a){
							o.manageControls(n);
							return false;
						});
					}();
					this.slideButs_arr.push(dom);
					this.slideButs.append(dom);
				}
			}
		},
		bind_but:function(){//绑定按钮事件
			var o = this;
			if(this.slides_to_l){
				this.slides_to_l = $(this.slides_to_l);
				this.slides_to_l.bind("click",function(){
					o.syg();
					return false;
				});
			}
			if(this.slides_to_r){
				this.slides_to_r = $(this.slides_to_r);
				this.slides_to_r.bind("click",function(){
					o.xyg();
					return false;
				});			
			}
		},
		slideButsStyle:function(){
			
		},
		syg:function(){
			if(this.slides_title) $(this.slides_title).html($(this.slides).eq(this.currentPosition).find('img').attr('alt'));
			this.manageControls(this.currentPosition<=0?this.numberOfSlides-1:this.currentPosition-1)
		},
		xyg:function(){
			if(this.slides_title) $(this.slides_title).html($(this.slides).eq(this.currentPosition).find('img').attr('alt'));
			this.manageControls(this.currentPosition>=this.numberOfSlides-1?0:this.currentPosition+1)
		},
		info:function(){
			var o = this;
			switch(this.slideDirection){
				case 0:
					this.slideInner.css({'width': this.slideWidth * this.slides.length,'position':'absolute'});
					this.slides.css({'float':"left"});
					break;
				case 1:
					this.slideInner.css({'height': this.slideHeight * this.slides.length,'position':'absolute'});
					this.slides.css({'clear':'both'})
					break;
				case 2:
					this.slideInner.css({'position':'relative','zoom':1});
					this.slides.css({'position':'absolute','left':0,'top':0,'zoom':1});
					break;
			}
			this.numberOfSlides=this.slides.length - this.slides_xssm + 1;
			/*if(this.slideDirection){
				this.slideInner.css({'height': this.slideHeight * this.slides.length,'position':'absolute'});
			}else{
				this.slideInner.css({'width': this.slideWidth * this.slides.length,'position':'absolute'});
			}*/
			this.slideButs = $(this.slideButs);
			this.slideInner.bind("mouseenter",function(){o.zantin=true;}).bind("mouseleave",function(){o.zantin=false;});
			this.shenchen_buts();
			this.bind_but();
			this.manageControls(this.currentPosition);//定位到默认幻灯	
			this.toggleTile(this.currentPosition);
		},
		toggleTile: function(position){
			var _this = this;
			$(this.slides_controller).find('li').each(function(index){
				$(this).on(_this.slides_controller_event, function(){
					_this.position = index;
					_this.manageControls(index);
					$(this).addClass(_this.slides_controller_curStyle).siblings().removeClass(_this.slides_controller_curStyle);
					$(_this.slides_title).html($(_this.slides).eq(_this.currentPosition).find('img').attr('alt'));
				});
			});
		}
	}

	module.exports = slide;
});
