/**
 * @authors H君
 * @date    2017-03-10 15:24:08
 * @version 0.0.3
 */

(function(global, factory) {

	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.Scrollbar = factory());

}(this, function() {


	"use strict";

	// 版本号
	var Version = '0.0.3';


	var Scrollbar = function(options) {

		// 默认配置
		var defaults = {

		}

		var options = extend(defaults, options);

		this.options = options;
		this.element = document.querySelector('#' + options.id);
		this.scrollContent = null; // 内容区域对象
		this.scrollContentHeight = null; // 内容区域高度
		this.scrollBar = null; // 滚动条对象
		this.scrollBarHeight = null; // 滚动条高度
		this.scrollBarTop = null; // 获取滚动条Top值
		this.scrollHeight = 5; //滚动大小
		this.scrollStatus = false;
		this.direct = null;
		this.init(this.options, this.element);

	}

	// 初始化
	Scrollbar.prototype.init = function(options, element) {

		var _self = this;

		if (!element) return;

		element.className += ' scroll-wrapper';
		_self.scrollContentHeight = element.offsetHeight; // 获取区域高度

		// 内容高度大于固定高度
		if (_self.scrollContentHeight > options.height) {

			element.style.position = 'relative';
			element.style.height = options.height + 'px';
			element.style.overflow = 'hidden';
			
			_self.scrollContent = document.createElement("div");
			_self.scrollContent.className += ' scroll-content';
			_self.scrollContent.innerHTML = element.innerHTML;

			element.innerHTML = '';
			element.appendChild(_self.scrollContent);

			_self.createTool(options, element);
		}


	}

	// 显示滚动条
	Scrollbar.prototype.createTool = function(options, element) {

		var _self = this,
			scrollbarHtml = document.createElement("div"); // 创建弹框盒子

		_self.scrollBarHeight = parseInt(options.height * options.height / _self.scrollContentHeight); // 生成滚动条高度

		scrollbarHtml.className = 'scroll-tool';
		scrollbarHtml.innerHTML = '<div class="scroll-bar" style="height:' + _self.scrollBarHeight + 'px"></div>';
		element.appendChild(scrollbarHtml);

		_self.scrollBar = element.querySelector('.scroll-bar');
		//事件绑定
		_self.bindEvent(options);

	}

	
	// 绑定事件
	Scrollbar.prototype.bindEvent = function(options) {

		var _self = this,
			elememt = _self.element;
		
		//兼容火狐滚动事件
		elememt.addEventListener('DOMMouseScroll', mousewheel, false);
		elememt.addEventListener('mousewheel', mousewheel, false);

		var x = 0,
			y = 0,
			differx = 0,
			differY = 0;
		
		_self.scrollBar.onmousedown = function(e) {

			x = e.clientX;
			y = e.clientY;

			_self.scrollStatus = true;	
			_self.scrollBarTop = parseInt(_self.scrollBar.style.top.substring(0, _self.scrollBar.style.top.length - 2)) || 0;//获得滚动条的Top值

			document.onmousemove = function(e) {
				console.log(_self.scrollStatus)
				var newX = e.clientX,
					newY = e.clientY;
				differx = newX - x;
				differY = newY - y;

				_self.direct = - differY;

				if (_self.scrollStatus) {
					
					_self.scroll.call(_self, e , Math.abs(differY),_self.scrollBarTop);
				}

			}

			document.onmouseup = function(e) {
				_self.scrollStatus = false;
				differx = null;
				differY = null;
				document.onmousemove = null;
				document.onmouseup = null;
			}
		};

		function mousewheel(e){
			_self.scrollBarTop = parseInt(_self.scrollBar.style.top.substring(0, _self.scrollBar.style.top.length - 2)) || 0;//获得滚动条的Top值	
			e.wheelDelta && (_self.direct = e.wheelDelta) || (_self.direct = -e.detail); //兼容火狐滚动方向
			_self.scroll.call(_self, e , _self.scrollHeight,_self.scrollBarTop);
		}

	}


	Scrollbar.prototype.scroll = function(e,scrollHeight,scrollBarTop) {

		var _self = this,
			e = e || window.event;

		var	overHeight = _self.options.height - (_self.scrollBarHeight + scrollBarTop), //滚动条剩下多少到底部
			oneScrollHeight = parseInt((scrollBarTop + scrollHeight)* _self.scrollContentHeight /  _self.options.height);//每滚1像素对等于内容区域的滚动高度

		if (_self.direct > 0) {
			//判断滚动条Top值是否大于0
			if (scrollBarTop <= scrollHeight) {
				_self.scrollBar.style.top = '0px';
				_self.scrollContent.style.top = '0px';
			} else {
				var Top = scrollBarTop - scrollHeight; //滚动位置Top - 滚动条高度
				_self.scrollBar.style.top = Top + 'px';
				_self.scrollContent.style.top = - oneScrollHeight  + 'px';
			}

		} else {
			//判断滚动条Top值是否小于（固定高度再减去滚动条高度）

			if (overHeight <= scrollHeight) {
				_self.scrollBar.style.top = scrollBarTop + overHeight + 'px'; //滚动位置Top + 剩余可用高度
				_self.scrollContent.style.top =  _self.options.height - _self.scrollContentHeight + 'px';
			} else {
				
				var Top = scrollBarTop + scrollHeight; //滚动位置Top - 滚动条高度
				_self.scrollBar.style.top = Top + 'px'; //滚动位置Top + 滚动条高度
				_self.scrollContent.style.top = - oneScrollHeight  + 'px';
			}
		}
		e.preventDefault();
	}

	// 防止冒泡
	function stopEvent(e) {
		if (!e) var e = window.event;
		if (e.stopPropagation) {
			// 兼容火狐
			e.stopPropagation();
		} else if (e) {
			// 兼容IE
			window.event.cancelBubble = true;
		}
	}

	// 合并对象
	function extend(to, from) {
		for (var key in from) {
			to[key] = from[key];
		}
		return to;
	}

	//获取css属性值
	function getStyle(obj) {
		return document.defaultView.getComputedStyle(obj, null);
	}

	return function(option){
		new Scrollbar(option);
	};

}));