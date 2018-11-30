
/* 
 * 抽奖用 跑马灯动画 
 * options.target 目标元素(组)
 * options.targetWidth 目标矩型宽度
 * options.targetHeight 目标矩型高度
*/
function RaceLamp(options) {
    if (!options.target) {
        console.log('缺少目标标签');
        return false;
    }

    var _this = this;

    this.target = options.target;
	this.targetWidth = typeof options.targetWidth === 'number' && options.targetWidth >= 2 ? parseInt(options.targetWidth) : 3;
	this.targetHeight = typeof options.targetHeight === 'number' && options.targetHeight >= 2 ? parseInt(options.targetHeight) : 3;
    this.speed = 100;
    this.orderClassName = 'lottery-target-no';
	this.targetNum = getTargetNum();

	function getTargetNum(){
		return _this.targetWidth * _this.targetHeight - (_this.targetWidth - 2) * (_this.targetHeight - 2);
	}
	
    function init(){

        var targetObj = $(_this.target);
		var targetWidth = _this.targetWidth;
		var targetHeight = _this.targetHeight;

        function rearrange() {
            var classOrderNum = 0;
            for (var i = 0; i < targetObj.length; i++) {
                classOrderNum = getOrder()[i];
                targetObj.eq(i).addClass(_this.orderClassName + classOrderNum);
            }
        }

        function getOrder() {
			var orderResult = [];
			var leng = targetWidth * targetHeight - 1;
			var lastLineStart = leng - targetWidth;
			
			for(var i = 0; i < leng; i++){
				if(i < targetWidth){
					orderResult.push(i);
				}else if(i >= lastLineStart){
					orderResult.push(2 * lastLineStart - i + 1);
				}else{
					orderResult.push(dealMiddle(i, leng)());
				}
			}
			return orderResult;
        }
		
		function dealMiddle(i, leng){
			var leftColumnCount = 0;
			var rightColumnCount = 0;
			var columnFlag = targetWidth % 2 == 0 ? 'even' : 'odd';
			
			function leftColumn(){
				leftColumnCount++;
				return leng - leftColumnCount;
			}
			
			function rightColumn(){
				rightColumnCount++;
				return targetWidth - 1 + rightColumnCount;
			}

			if(i % 2 == 0){
				return columnFlag == 'even' ? leftColumn : rightColumn;
			}else{
				return columnFlag == 'even' ? rightColumn : leftColumn;
			}
		}

        rearrange();
    }

    init();
}

RaceLamp.prototype.start = function(callback, endPosition){

    var _this = this;
    var targetObj = $(_this.target);
    var slowDownSwitch = false;
    var runSwitch = true;
	var curNum = 0;
    var circleNum = 0;
	var speed = _this.speed;
	var timeConstant = getConstant();
    endPosition = arrayToNum(endPosition);

    setTimeCircle();

    function setTimeCircle() {
        setTimeout(function () {
            setHighLight();
			setCurNum();
            checkDoCallback();
            checkRunStatus();
        }, speed);
    };

    function checkRunStatus() {
        runSwitch && setTimeCircle();
        slowDownSwitch && slowDown();
        if(typeof endPosition == 'number' && endPosition == curNum){
            if(checkSpeedOverFlow()){
                stop();
            }
            if (circleNum > 3) {
                turnSlowDownSwitch('on');
            };
        }
    }

    function setHighLight() {
        targetObj.removeClass('on');
        $('.' + _this.orderClassName +  curNum).addClass('on');
    }
	
	function setCurNum(){
		curNum >= _this.targetNum - 1 ? resetCurNum() : curNum++;
	}

    function getConstant() {
        return (1000 - speed) / _this.targetNum;
    }

    function checkSpeedOverFlow(){
        return speed >= 1000 ? true : false;
    }

    function turnSlowDownSwitch(type){
        slowDownSwitch = type == 'on' ? true : false;
    }

    function slowDown(){
        speed = speed + timeConstant;
    }

    function stop(){
        runSwitch = false;
    }

    function checkDoCallback(){
        checkSpeedOverFlow() && typeof callback == 'function' && setTimeout(function(){callback()}, 500);
    }

    function resetCurNum() {
        curNum = 0;
        circleNum++;
    }

    function arrayToNum(arr){
        if(typeof arr != 'object'){
            return arr;
        }
        var randomKey = Math.floor(Math.random() * arr.length);
        return arr[randomKey];
    }
}