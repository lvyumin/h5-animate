/*
 *  arr：可以是存放图片路径的一个数组，也可以是选取到的img的jquery对象；
 * funLoading：每一个单独的图片加载完成后执行的操作；
 * funOnLoad：全部图片都加载完成后的操作；
 * funOnError：单个图片加载出错时的操作。
 * */
function loadimg(arr, funLoading, funOnLoad, funOnError) {
	var numLoaded = 0,
		numError = 0,
		isObject = Object.prototype.toString.call(arr) === "[object Object]" ? true : false;

	var arr = isObject ? arr.get() : arr;
	var flag = true,
		flagIndex = 1,
		arrLength = arr.length;
	for(a in arr) {

		var src = isObject ? $(arr[a]).attr("src") : arr[a];

		//		console.log("hhhh" + src);

		preload(src, arr[a]);

	}

	function preload(src, obj) {
		var img = new Image();
		img.onload = function() {
			numLoaded++;
			funLoading && funLoading(numLoaded, arr.length, src, obj);
			funOnLoad && numLoaded == arr.length && funOnLoad(numError);
		};
		img.onerror = function() {
			numLoaded++;
			numError++;
			funOnError && funOnError(numLoaded, arr.length, src, obj);
		}
		img.src = src;
	}

}

$(function() {
	var obj = new travelObj();
	obj.init();
});

var travelObj = function() {};

travelObj.prototype.init = function() {
	var self = this;


	var imgonload = function(errors) {
			/*errors：加载出错的图片数量；*/
			console.log("加载完成");
			$('#load-fly').addClass("load-flyaway");
			$(".mask").addClass('fade-out');
			setTimeout(function() {
				$(".mask").hide();
				$(".ufo-sound").show();
				var audio = document.getElementById('mp3-btn');
				audio.play(); //播放音乐
				self.initSwiper();
			}, 1000);
		}
	var funloading = function(n, total, src, obj) {
			/* 
			n：已加载完成的数量； 
			total：总共需加载的图片数量； 
			src：当前加载完成的图片路径； 
			obj：当loadimg函数中传入的arr为存放图片路径的数组时，obj=src，是图片路径， 
			    当arr为jquery对象时，obj是当前加载完成的img dom对象。 
			*/

			var percentFlag = parseInt(n / total * 100);
			var percent = percentFlag + '%';
			if(percentFlag > 50) {

				$('#load-fly').removeClass('load-fly');
				$('#load-fly').css('left', percent);
				$('#load-progress').removeClass('load-pro');
				$('#load-progress').width(percent);

			}

		}
	var funOnError = function(n, total, src, obj) {
		console.log("the " + n + "st img loaded Error!");
	}

    //start Animation
	$('#load-fly').addClass("load-fly");
	$('#load-progress').addClass("load-pro");
	setTimeout(function() {
		loadimg($("img"), funloading, imgonload, funOnError);
	}, 1000);
   self.bundClick();
    
};
//Swiper
travelObj.prototype.initSwiper = function() {
	var self = this;

	var isChangeIndex = -1,
		isTouch = false,
		timer = null;
	var height = document.documentElement.clientHeight;
	var $travelBoxSlide = $('.travel-box').find('.swiper-slide');
	$(".swiper-container").height(height);
	var flag = 1;

	var mySwiper = new Swiper('.travel-box', {
		direction: 'vertical',
		nextButton: '.arrow-box',
		speed: 1000,
		onInit: function(swiper) {
			$('.ani-step1').show();
			$(".bubble-airbox").show();
			timer = setTimeout(function() {
				swiper.slideTo(1);
			}, 10000);
		},
		onSlideChangeStart: function(swiper) {
			var aniFlag = '.ani-step' + (swiper.activeIndex + 1);

			$(aniFlag).show();

			if(!isTouch && (swiper.activeIndex == isChangeIndex + 1 || swiper.activeIndex == isChangeIndex - 1)) {
				isTouch = true;
				clearTimeout(timer);
			}

			if(!isTouch) {
				if(swiper.activeIndex == '1') {
					timer = setTimeout(function() {
						swiper.slideTo(2);
					}, 16000);
				} else if(swiper.activeIndex == '2') {
					timer = setTimeout(function() {
						swiper.slideTo(3);
					}, 20000);
				} else if(swiper.activeIndex == '3') {
					timer = setTimeout(function() {
						swiper.slideTo(4);
					}, 17000);
				}
			}
		},
		onSlideChangeEnd: function(swiper) {
			var aniPreFlag = '.ani-step' + (swiper.previousIndex + 1);
			$(aniPreFlag).hide();
		},
		onTouchEnd: function(swiper) {
			isChangeIndex = swiper.activeIndex;
		}

	});


};

travelObj.prototype.bundClick = function() {
	var self = this;
	
	$('.go-btn button').click(function(){
	    location.href = "http://www.baidu.com";
	});
	$('.ufo-sound').click(function(){
		self.playMusic();
	});
};

travelObj.prototype.playMusic = function() {
	var self = this;

	var audio = document.getElementById('mp3-btn');

	if(audio.paused) //如果当前是暂停状态
	{
		$('.ufo-sound').addClass('rubberBand');
		$('.ufo-sound>img').hide();
		audio.play(); //播放
		return;
	} else {
		//当前是播放状态
		$('.ufo-sound').removeClass('rubberBand');
		$('.ufo-sound>img').show();
		audio.pause(); //暂停
	}

};