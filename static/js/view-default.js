(function(){
	/* ! 处理ajax 发送请求前的场景*/
    $(document).ajaxStart(function(){
    	module.loading.show();
    });
    /* ! 处理ajax请求失败的场景*/
    $(document).ajaxError(function(event,request,settings){
    	module.loading.hide();
    	module.alert('呀，加载失败啦！');
    });
    var params = {
    	nowTabid: $(window.frameElement).closest('.main-page-item').attr('data-tabid')
    };
    module.extend({
    	alert: function(info,time){
    		module.postMessage({
    			call: 'alert',
        		data: {
        			info: info,
        			time: time || 2000
        		}
    		});
    	},
        loading: {
        	show: function(){
        		$(document).trigger(EVENT.TAB.LOADING);
        	},
        	hide: function(){
        		$(document).trigger(EVENT.TAB.SUCCESS);
        	}
        },
    	postMessage: function(op){
    		var options = {
    			docall: '',
    			tabid: null,
        		data: null
    		};
    		$.extend(options, op);
    		options.docall = op.call;
    		options.call = 'messageChannel';
    		parent.postMessage(options,'*');
    	},
    	/**
         * tab菜单管理
         * */
        tabManage: {
        	init: function(){
        		/* ! 添加tab监听*/
        		$(document).on(EVENT.TAB.NEW,module.tabManage.create);
        		$(document).on(EVENT.TAB.LOADING,module.tabManage.loading);
        		$(document).on(EVENT.TAB.CHANGE,module.tabManage.change);
        		$(document).on(EVENT.TAB.SUCCESS,module.tabManage.success);
        		$(document).on(EVENT.TAB.RELOAD,module.tabManage.reload);
        	},
        	create: function(e, data){
        		module.tabManage.messagePost(EVENT.TAB.NEW,data);
        	},
        	change: function(e,tabid){
        		module.tabManage.messagePost(EVENT.TAB.CHANGE,tabid || params.nowTabid);
        	},
        	success: function(e,tabid){
        		module.tabManage.messagePost(EVENT.TAB.SUCCESS,tabid || params.nowTabid);
        	},
        	loading: function(e,tabid){
        		module.tabManage.messagePost(EVENT.TAB.LOADING,tabid || params.nowTabid);
        	},
        	reload: function(e,tabid) {
        		module.tabManage.messagePost(EVENT.TAB.RELOAD,tabid || params.nowTabid);
        	},
        	messagePost: function(ev,data) {
        		module.postMessage({
        			call: 'tabManage',
        			ev: ev,
        			data: data
        		});
        	}
        }
    });
    /* ! 加载新建tab */
	module.clickTree.loadtab = function(){
		var options = {
			title: '新建tab',						/* ! tab标题 */
			url: '',								/* ! 请求url*/
			loadhide: true,							/* ! 请求完成后是否隐藏加载动画*/
			tabid: null,							/* ! tabid*/
		},_this = $(this),data = _this.data();
		$.extend(options, data);
		if(options.tabid==null){
			options.tabid = new Date().getTime();
			_this.data('tabid',options.tabid).attr('data-tabid',options.tabid);
		}
		/* ! 新建tab */
		$(document).trigger(EVENT.TAB.NEW,options);
	}
    /* *
     * 加载完成后初始化系统
     * */
    $(function(){
        /* ! 初始化 tab */
    	module.tabManage.init();
    });
})()