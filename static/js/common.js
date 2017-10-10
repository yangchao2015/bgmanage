(function(){
	var config = {
		debug: true,
		scrollloading: false
	}, EVENT = {
    	CONTEXTMENU: 'CONTEXTMENU',  					/* ! 右键事件*/
    	LOADREADY: 'LOADREADY',							/* ! 加载成功*/
    	TAB: {
    		NEW: 'NEW',									/* ! 新建tab*/
            LOADING: 'LOADING',							/* ! tab加载中*/
            CHANGE: 'CHANGE',							/* ! tab切换*/
        	DELETE: 'DELETE',							/* ! 移除tab*/
        	SUCCESS: 'SUCCESS',                         /* ! tab加载成功*/
            ERROR: 'ERROR',                   			/* ! tab加载失败*/
            RELOAD: 'RELOAD'                   			/* ! tab刷新加载*/
       },
       ALERT: 'ALERT'									/* ! 打印提示*/
  }, module = {
   		/*消息执行函数*/
    	messageCallBack: {},
   		/* ! do 事件*/
   		doTree: {
   			/* *
    		 * 时间选择
    		 * */
    		timepick: function(){
    			var options = {
    				date: null,						               /* ! 默认显示时间 */
    				max: null,							   		   /* ! 时间允许最大值*/
    				min: null,							           /* ! 时间允许最小值*/
    				format: null,							       /* ! tabid*/
    			},_this = $(this),data = _this.data();
    			$.extend(options, data);
    			if(options.date == null){
    				options.date = _this.val();
    			}
    			_this.flatpickr();
    		},
    		select: function(){
    			var options = {
    				val: null						           	   /* ! 默认值 */
    			},_this = $(this),data = _this.data();
    			$.extend(options, data);
    			var inputEl = _this.find('input'),selectValueEl = _this.find('.selected-value'),dropMenu = _this.find('.dropdown-menu');
    			if(!options.val){
    				var val = inputEl.val();
    				if(!val){
    					val = dropMenu.find('.dropdown-item:first').data('val');
    				}
    				options.val = val;
    			}
    			/* ! 初始化选择器选择值 */
    			var initEl = dropMenu.find('.dropdown-item[data-value="'+options.val+'"]').addClass('active');
    			inputEl.val(initEl.data('value'));
    			selectValueEl.text(initEl.text());
    			
    			var FN = {
    				open: function(){
    					_this.addClass('active');
    					$(document).on('click',FN.close);
    				},
    				close: function(){
    					_this.removeClass('active');
    					$(document).off('click',FN.close);
    				}
    			};
    			_this.on('click',function(e){
    				e.stopPropagation();
    				var _target = $(e.target);
    				if(_target.hasClass('selected-value')){
    					if(_this.hasClass('active')){
    						FN.close();
    					} else {
    						FN.open();
    					}
    				} else if(_target.hasClass('dropdown-item') && !_target.hasClass('active')) {
    					dropMenu.find('.active').removeClass('active');
    					_target.addClass('active');
    					inputEl.val(_target.data('value'));
    					selectValueEl.text(_target.text());
    					FN.close();
    				}
    			});
    		}
   		},
   		/* ! click 事件*/
   		clickTree: function(){},
    	init: function(){
    		/* ! 屏蔽鼠标的右键菜单*/
            document.oncontextmenu = function(){
        		$(document).trigger(EVENT.CONTEXTMENU);
        		return false;
        	}
            /* ！ 添加全局基本事件监听 和 添加 默认事件处理 */
            module.initListener();
            /* ! 重写系统console.log方法*/
            if(!config.debug) {
            	window.console.log = $.noop;
            } 
    	},
    	/*继承函数*/
    	extend: function (a, b) {
	        if (typeof a == 'string') {
	            module[a] = b;
	        } else {
	            for (var funcName in a) {
	                module[funcName] = a[funcName];
	            }
	        }
	    }
    };
    /* *
    * 使用继承方法完成基本功能方法定义
    * */
    module.extend({
    	initListener: function(){
    		/* ! 全局事件处理 */
        	$('[data-do]').each(function(){
        		var dowhat = $(this).attr('data-do');
        		if(dowhat && module.doTree[dowhat] && $.isFunction(module.doTree[dowhat]))
        			module.doTree[dowhat].call(this);
        	});
        	/* ! 全局添加处理 data-click事件处理 */
        	$(document).on('click','[data-click]',function(){
        		var dowhat = $(this).attr('data-click');
        		if(dowhat && module.clickTree[dowhat] && $.isFunction(module.clickTree[dowhat]))
        			module.clickTree[dowhat].call(this);
        	});
        	/* ! 添加消息通知 */
        	window.addEventListener('message',function(event){
	        	var data = event.data;
	        	if(data.call && module.messageCallBack[data.call] && $.isFunction(module.messageCallBack[data.call]))
	        		module.messageCallBack[data.call].call(data);
	        },false);
    	},
    	/**
         * 检查form 是否符合提交要求
         * */
    	checkForm: function(form){
			var reEls = form.find('[required]'),checkVal = true;
			reEls.each(function(){
				var val = $(this).val() || $(this).text();
				if(!val){
					checkVal = false;
					return false;
				}
			});
			return checkVal;
		},
        /* *
         * 滚动加载
         * @param elSelector 加载内容选择器
         * @param selector 选择器 默认 window
         * @param urlSource 加载地址选择
         * */
        scrollLoading: function(options){
        	var defaults = {
        		elSelector: '[data-loading]',
        		selector: window,
        		urlSource: 'data-url'
        	},container;
        	var params = $.extend({}, defaults, options || {});
        	container = $(params.selector);
        	var loading = function(){
        		var contHeight = container.height(),contop = 0,els;
        		els = $(elSelector);
        		if (params.selector == window) {
        			contop = $(window).scrollTop();
    			} else {
    				contop = container.offset().top;
    			}
        		$.each(els,function(k,v){
        			var el = $(v),tag = v.nodeName.toLowerCase(), url = $(v).attr(params.urlSource), post, posb;
        			if(url){
        				post = el.offset().top - contop, posb = post + el.height();
        				if (el.is(':visible') && (post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
        					el.addClass('bgloading');
        					if (tag === "img") {
        						el.attr("src", url);
							} else {
								el.load(url, {}, function(){
									el.removeClass('bgloading');
								});
							}
        					el.removeAttr(params.urlSource);
    					}
        			}
        		});
        	};
        	/*第一次初始化*/
        	loading();
        	container.off('scroll',loading).on('scroll',loading);
        },
        /* !
         * 数据格式化
         * */
        dataFormat: function(op){
        	var options = {
        		prevalue: {},
        		format: {},
        		filterempty: true
        	},nowData = {};
        	$.extend(options,op);
        	if($.isArray(options.format)){
        		$.each(options.format, function(k,v) {
        			if(!options.filterempty || options.prevalue[v]) {
        				nowData[k] = options.prevalue[v];
        			}
        		});
        	}
        	return nowData;
        },
        /* !
         * 本地存储
         * */
        localData: {
            setData: function (key, value) {
                window.localStorage.setItem(key, value);
            },
            getData: function (key) {
                var data = window.localStorage.getItem(key);
                return !!data ? data : '';
            },
            removeData: function (key) {
                window.localStorage.removeItem(key);
            },
            clearAllData: function () {
                window.localStorage.clear();
            },
            setCookie: function (key, value, day) {
                var exp = new Date(), days = day ? day : 30;
                exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
                this.setBaseCookie(key, value, exp, "/");
            },
            setBaseCookie: function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
                var sCookie = sName + "=" + encodeURIComponent(sValue);
                if (oExpires) {
                    sCookie += "; expires=" + oExpires.toGMTString();
                }
                if (sPath) {
                    sCookie += "; path=" + sPath;
                }
                if (sDomain) {
                    sCookie += "; domain=" + sDomain;
                }
                if (bSecure) {
                    sCookie += "; secure";
                }
                document.cookie = sCookie;
            },
            getCookie: function (sName) {
                var sRE = "(?:; )?" + sName + "=([^;]*);?";
                var oRE = new RegExp(sRE);

                if (oRE.test(document.cookie)) {
                    return decodeURIComponent(RegExp["$1"]);
                } else {
                    return null;
                }
            },
            deleteCookie: function (sName, sPath, sDomain) {
                this.setCookie(sName, '', new Date(0), sPath, sDomain);
            }
        },
        /* !
         * 消息通信，用于iframe间通信
         * */
        messageChannel: function(op) {
        	var options = {
        		tabid: null,
        		call: null,
        		data: null,
        	},iframeEls;
        	$.extend(options, op);
        	if(options.tabid){
        		iframeEls = $('.main-page-item[data-tabid="'+options.tabid+'"] iframe');
        	} else {
        		iframeEls = $('#main-pages iframe');
        	}
        	if(iframeEls.length){
        		$.each(iframeEls, function(k,v) {
        			v.contentWindow.postMessage(options,'*');
        		});
        	}
        }
    });
     /* *
     * 加载完成后初始化系统
     * */
    $(function(){
    	module.init();
    });
	/* ！ 挂载到window全家变量 */
	window.EVENT = EVENT;
	window.module = module;
})()
