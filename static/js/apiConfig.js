/* ! 定义API配置 */
(function(){
	var apiConfig = {
		protocols: {
			http: 'http://',
			https: 'https://'
		},
		hosts: {
			base: '192.168.0.0:8082/api/'
		},
		apiFormat: function(api) {
			return apiConfig.protocols.http + apiConfig.hosts.base + api;
		}
	};
	/*定义所有api*/
	apiConfig.apis =  {
		/*定义功能名称或者api分组名称*/
		frameApi: {
			/*！定义api*/
			apiname1: apiConfig.apiFormat('getUser'),
		}
	};
	/* ！ 挂载到window全家变量 */
	window.API = apiConfig.apis;
})()
