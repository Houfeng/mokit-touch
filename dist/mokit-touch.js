/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Plugin = __webpack_require__(1);
	module.exports = new Plugin(function () {
	  return __webpack_require__(2);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';
	
	var factory = function factory(thunk) {
	  function Plugin(opts) {
	    return typeof Plugin.entity === 'function' ? new Plugin.entity(opts) : Plugin.entity;
	  }
	  Plugin.install = function (mokit) {
	    factory.mokit = mokit;
	    this.entity = thunk();
	    this.entity.install(mokit);
	  };
	  if (typeof mokit !== 'undefined') {
	    mokit.use(Plugin);
	  }
	  return Plugin;
	};
	
	module.exports = factory;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1).mokit;
	var utils = mokit.utils;
	
	var SUPPORT_TOUCH = 'ontouchstart' in document;
	var START_EVENT_NAME = SUPPORT_TOUCH ? 'touchstart' : 'mousedown';
	var MOVE_EVENT_NAME = SUPPORT_TOUCH ? 'touchmove' : 'mousemove';
	var END_EVENT_NAME = SUPPORT_TOUCH ? 'touchend' : 'mouseup';
	var CUSTOM_EVENT_NAMES = /*istanbul ignore next*/'tap,taphold,dbltap,swipe,swipeup,swiperight,\nswipedown,swipeleft,pointdown,pointmove,pointup';
	
	module.exports = {
	  name: CUSTOM_EVENT_NAMES,
	
	  option: {
	    swipeDurationThreshold: 1000,
	    swipeHorizontalDistanceThreshold: 25,
	    swipeVerticalDistanceThreshold: 45,
	    holdDurationThreshold: 1000,
	    dblDurationThreshold: 450,
	    scrollSupressionThreshold: 25
	  },
	
	  addListener: function /*istanbul ignore next*/addListener(emitter, name, listener, capture) {
	    if (!utils.isFunction(listener)) return;
	
	    var self = this;
	
	    //处理 touchstart 事件
	    listener.touchstart = listener.touchstart || function (event) {
	      var point = event.changedTouches ? event.changedTouches[0] : event;
	      listener.startPoint = listener.endPoint = {
	        'x': point.pageX,
	        'y': point.pageY,
	        'timeStamp': event.timeStamp,
	        'point': point
	      };
	      if (name == 'taphold') {
	        listener.createHoldHandler(event);
	      }
	      //模拟鼠标事件
	      if (name == 'pointdown') {
	        utils.copy(listener.startPoint, event);
	        emitter.emit('pointdown', event);
	        emitter.isPointDown = true;
	      }
	    };
	
	    //创建 hold 处理器
	    listener.createHoldHandler = listener.createHoldHandler || function (event) {
	      // 处理 taphold 事件
	      if (!listener.holdTimer && !listener.holdHandler) {
	        var option = self.option;
	        listener.holdHandler = function () {
	          event.taphold = true;
	          emitter.emit('taphold', event);
	        };
	        listener.holdTimer = setTimeout(function () {
	          if (listener.holdHandler) listener.holdHandler();
	        }, option.holdDurationThreshold);
	      }
	    };
	
	    //清除 hold 处理器
	    listener.clearHoldHandler = listener.clearHoldHandler || function () {
	      if (listener.holdTimer) {
	        clearTimeout(listener.holdTimer);
	        listener.holdTimer = null;
	        listener.holdHandler = null;
	      }
	    };
	
	    //获取划动信息
	    listener.getTouchInfo = function (event) {
	      var point = event.changedTouches ? event.changedTouches[0] : event;
	      listener.endPoint = {
	        'x': point.pageX,
	        'y': point.pageY,
	        'timeStamp': event.timeStamp,
	        'point': point
	      };
	      //
	      var option = self.option;
	      // 一些计算结果
	      var info = {};
	      info.timeStamp = listener.endPoint ? listener.endPoint.timeStamp : null;
	      info.existStartAndStop = listener.endPoint && listener.startPoint;
	      info.horizontalDistance = info.existStartAndStop ? listener.endPoint.x - listener.startPoint.x : 0;
	      info.verticalDistance = info.existStartAndStop ? listener.endPoint.y - listener.startPoint.y : 0;
	      info.horizontalDistanceValue = Math.abs(info.horizontalDistance);
	      info.verticalDistanceVlaue = Math.abs(info.verticalDistance);
	      info.isHorizontal = info.horizontalDistanceValue >= info.verticalDistanceVlaue;
	      info.isVertical = !info.sHorizontal;
	      info.isSwipeMove = info.horizontalDistanceValue >= option.swipeHorizontalDistanceThreshold || info.verticalDistanceVlaue >= option.swipeVerticalDistanceThreshold;
	      info.isSwipeTime = info.existStartAndStop ? listener.endPoint.timeStamp - listener.startPoint.timeStamp <= option.swipeDurationThreshold : true;
	      info.isHoldTime = info.existStartAndStop ? listener.endPoint.timeStamp - listener.startPoint.timeStamp >= option.holdDurationThreshold : false;
	      //这里的 direction 仅是指划动方法，不代表 swipe 动作，swipe 动作还有时间或划动距离等因素
	      if (info.isHorizontal && info.horizontalDistance > 0) {
	        info.direction = 'right';
	      } else if (info.isHorizontal && info.horizontalDistance < 0) {
	        info.direction = 'left';
	      } else if (info.isVertical && info.verticalDistance > 0) {
	        info.direction = 'down';
	      } else if (info.isVertical && info.verticalDistance < 0) {
	        info.direction = 'up';
	      }
	      return info;
	    };
	
	    //处理 touchmove 事件
	    listener.touchmove = listener.touchmove || function (event) {
	      var info = listener.getTouchInfo(event);
	      if (info.isSwipeMove) {
	        listener.clearHoldHandler();
	      }
	      var stopBubble = false;
	      //模拟鼠标事件
	      if (emitter.isPointDown && name == 'pointmove') {
	        utils.copy(listener.endPoint, event);
	        emitter.emit('pointmove', event);
	        stopBubble = true;
	      }
	      //在绑定划动的方向上禁止滚动，因为 Android 4.x 不如此处理，touchend 事件将不触发
	      if (name == 'swipe' || name == 'swipe' + info.direction) {
	        stopBubble = true;
	      }
	      //如果需要阻止冒泡
	      if (stopBubble) {
	        return false;
	      }
	    };
	
	    //完成事件
	    listener.done = listener.done || function (event) {
	      listener.clearHoldHandler();
	      var info = listener.getTouchInfo(event);
	      //模拟鼠标事件
	      if (name == 'pointup') {
	        utils.copy(listener.endPoint, event);
	        emitter.emit('pointup', event);
	        emitter.isPointDown = false;
	      }
	      // 根据计算结果判断
	      if (info.isSwipeTime && info.isSwipeMove) {
	        event.swipe = true;
	        event.direction = info.direction;
	        if (name == 'swipe') {
	          emitter.emit('swipe', event);
	        }
	        if (name == 'swipe' + event.direction) {
	          emitter.emit('swipe' + event.direction, event);
	        }
	      } else if (info.isSwipeTime && !info.isSwipeMove && !info.isHoldTime) {
	        if (name == 'tap') {
	          emitter.emit('tap', event);
	        }
	        if (name == 'dbltap') {
	          //处理 “双击”
	          var option = self.option;
	          event.dbltap = listener.PreTapTime && info.timeStamp - listener.PreTapTime <= option.dblDurationThreshold;
	          if (event.dbltap) {
	            emitter.emit('dbltap', event);
	            listener.PreTapTime = null;
	          } else {
	            listener.PreTapTime = listener.endPoint.timeStamp;
	          }
	        }
	      }
	    };
	
	    //绑定组合事件
	    emitter.on(START_EVENT_NAME, listener.touchstart, capture);
	    emitter.on(MOVE_EVENT_NAME, listener.touchmove, capture);
	    emitter.on(END_EVENT_NAME, listener.done, capture);
	  },
	
	  removeListener: function /*istanbul ignore next*/removeListener(emitter, name, listener, capture) {
	    //只有指定了 handler 才能取消构成组合事件的 “原事件”
	    //否则会直接移除会将其他 touchstart 等事件也移除
	    if (utils.isFunction(listener)) {
	      if (utils.isFunction(listener.touchstart)) {
	        emitter.off(START_EVENT_NAME, listener.touchstart, capture);
	      }
	      if (utils.isFunction(listener.touchmove)) {
	        emitter.off(MOVE_EVENT_NAME, listener.touchmove, capture);
	      }
	      if (utils.isFunction(listener.done)) {
	        emitter.off(END_EVENT_NAME, listener.done, capture);
	      }
	    }
	  },
	
	  install: function /*istanbul ignore next*/install(mokit) {
	    mokit.EventEmitter.register(this);
	    mokit.Touch = this;
	  }
	
	};

/***/ }
/******/ ]);
//# sourceMappingURL=mokit-touch.js.map