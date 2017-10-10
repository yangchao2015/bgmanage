$(function(){
	/* ! 屏蔽鼠标的右键菜单*/
    document.oncontextmenu = function(){
		return false;
	}
    var swiper = new Swiper('#mySwiper',{
    	autoplay: 8000,
    	effect: 'fade',
    	pagination: '#mySwiper .swiper-pagination',
    	loop: true,
    	paginationClickable: true
    });
});
