
// 跑马灯动画 

function RaceLamp(options) {
    if (!options.target) {
        console.log('缺少目标标签');
        return false;
    }

    var _this = this;
    var speedMap = {
        slow: 200,
        normal: 100,
        slow: 50
    }

    this.target = options.target;
    this.order = options.order ? options.order : 'wise';
    this.speedType = options.speedType ? options.speedType : 'normal';
	this.targetWidth = typeof options.targetWidth === 'number' && options.targetWidth >= 2 ? parseInt(options.targetWidth) : 3;
	this.targetHeight = typeof options.targetHeight === 'number' && options.targetHeight >= 2 ? parseInt(options.targetHeight) : 3;
    this.curNum = 0;
    this.circleNum = 0;
    this.speed = speedMap[this.speedType];
    this.orderClassName = 'lottery-target-no';
	this.targetNum = getTargetNum();

	function getTargetNum(){
		return this.targetWidth * this.targetHeight - (this.targetWidth - 2) * (this.targetHeight - 2);
	}
	
    function init(){

        var targetObj = $(_this.target);

        function rearrange() {
            var classOrderNum = 0;
            for (var i = 0; i < targetObj.length; i++) {
                classOrderNum = getOrder()[i];
                targetObj.eq(i).addClass(_this.orderClassName + classOrderNum);
            }
        }

        function getOrder() {
            var wiseOrder = [0, 1, 2, 7, 3, 6, 5, 4]; // 顺时针
            var antOrder = [0, 7, 6, 1, 5, 2, 3, 4]; // 逆时针
			var wiseOrder = getWiseOrder();
			console.log(wiseOrder);
            return _this.order === 'ant' ? antOrder : wiseOrder;
        }

		function getWiseOrder(){
			var orderResult = [];
			var leng = this.targetWidth * this.targetHeight;
			var lastLineStart = leng - this.targetWidth;
			
			for(var i = 0; i < leng; i++){
				if(i < this.targetWidth){
					orderResult.push(i);
				}else if(i >= lastLineStart){
					orderResult.push(2 * lastLineStart - i);
				}else{
					orderResult.push(dealMiddle(i, leng)());
				}
			}
			return orderResult;
		}
		
		function getAntOrder(){
			
		}
		
		function evenSituation(i, leng){
			var leftColumnCount = 0;
			var rightColumnCount = 0;
			var columnFlag = this.targetWidth % 2 == 0 ? 'even' : 'odd';
			
			function leftColumn(){
				leftColumnCount++;
				return leng - leftColumnCount;
			}
			
			function rightColumn(){
				rightColumnCount++;
				return this.targetWidth - 1 + rightColumnCount;
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
    var timeConstant = getConstant();
    var slowDownSwitch = false;
    var runSwitch = true;
    endPosition = arrayToNum(endPosition);

    setTimeCircle();

    function setTimeCircle() {
        setTimeout(function () {
            setHighLight();
			setCurNum();
            checkDoCallback();
            checkRunStatus();
        }, _this.speed);
    };

    function checkRunStatus() {
        runSwitch && setTimeCircle();
        slowDownSwitch && slowDown();
        if(typeof endPosition == 'number' && endPosition == _this.curNum){
            if(checkSpeedOverFlow()){
                stop();
            }
            if (_this.circleNum > 3) {
                turnSlowDownSwitch('on');
            };
        }
    }

    function setHighLight() {
        targetObj.removeClass('on');
        $('.' + _this.orderClassName +  _this.curNum).addClass('on');
    }
	
	function setCurNum(){
		_this.curNum >= _this.targetNum - 1 ? resetCurNum() :  _this.curNum++;
	}

    function getConstant() {
        return (1000 - _this.speed) / _this.targetNum;
    }

    function checkSpeedOverFlow(){
        return _this.speed >= 1000 ? true : false;
    }

    function turnSlowDownSwitch(type){
        slowDownSwitch = type == 'on' ? true : false;
    }

    function slowDown(){
        _this.speed = _this.speed + timeConstant;
    }

    function stop(){
        runSwitch = false;
    }

    function checkDoCallback(){
        checkSpeedOverFlow() && typeof callback == 'function' && setTimeout(function(){callback()}, 500);
    }

    function resetCurNum() {
        _this.curNum = 0;
        _this.circleNum++;
    }

    function arrayToNum(arr){
        if(typeof arr != 'object'){
            return arr;
        }
        var randomKey = Math.floor(Math.random() * arr.length);
        return arr[randomKey];
    }
}