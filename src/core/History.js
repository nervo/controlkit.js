var EventDispatcher = require('./event/EventDispatcher'),
    Event_ = require('./event/Event'),
    HistoryEvent = require('./HistoryEvent');

var MAX_STATES = 30;

function History() {
    EventDispatcher.apply(this, arguments);
    this._states = [];
    this._isDisabled = false;
}

History.prototype = Object.create(EventDispatcher.prototype);

History.prototype.pushState = function (object, key, value) {
    if (this._isDisabled){
        return;
    }

    var states = this._states;
    if (states.length >= MAX_STATES){
        states.shift();
    }
    states.push({object: object, key: key, value: value});
    this.dispatchEvent(new Event_(this, HistoryEvent.STATE_PUSH, null));
};

History.prototype.getState = function (object, key) {
    var states = this._states,
        statesLen = states.length;

    if (statesLen == 0){
        return null;
    }

    var state, value;
    var i = -1;
    while (++i < statesLen) {
        state = states[i];
        if (state.object === object) {
            if (state.key === key) {
                value = state.value;
                break;
            }
        }
    }
    return value;
};

History.prototype.popState = function () {
    if (this._isDisabled){
        return;
    }

    var states = this._states;
    if (states.length < 1){
        return;
    }

    var lastState = states.pop();
    lastState.object[lastState.key] = lastState.value;

    this.dispatchEvent(new Event_(this, History.HISTORY_STATE_POP, null));
};

History.prototype.getNumStates = function () {
    return this._states.length;
};

History._instance = null;

History.setup = function () {
    return History._instance = new History();
};

History.getInstance = function () {
    return History._instance;
};

History.prototype.enable = function () {
    this._isDisabled = false;
};
History.prototype.disable = function () {
    this._isDisabled = true;
};

module.exports = History;

//ControlKit.History.prototype.isDisabled = function(){return this._isDisabled;};ControlKit.History = function()
//{
//    ControlKit.EventDispatcher.apply(this,arguments);
//    this._states   = [];
//    this._isDisabled = false;
//};
//
//ControlKit.History.prototype = Object.create(ControlKit.EventDispatcher.prototype);
//
///*---------------------------------------------------------------------------------*/
//
//ControlKit.History.prototype.pushState = function(object,key,value)
//{
//    if(this._isDisabled)return;
//
//    var states    = this._states,
//        statesMax = ControlKit.Preset.HISTORY_MAX_STATES;
//
//    if(states.length >= statesMax)states.shift();
//    states.push({object:object,key:key,value:value});
//
//    this.dispatchEvent(new ControlKit.Event(this,ControlKit.EventType.STATE_PUSH,null));
//};
//
//ControlKit.History.prototype.getState = function(object,key)
//{
//    var states    = this._states,
//        statesLen = states.length;
//
//    if(statesLen == 0)return null;
//
//    var state,value;
//
//    var i = -1;
//    while(++i < statesLen)
//    {
//        state = states[i];
//
//        if(state.object === object)
//        {
//            if(state.key === key)
//            {
//               value = state.value;
//               break;
//            }
//        }
//    }
//
//    return value;
//};
//
//ControlKit.History.prototype.popState  = function()
//{
//    if(this._isDisabled)return;
//
//    var states = this._states;
//    if(states.length < 1)return;
//
//    var lastState = states.pop();
//    lastState.object[lastState.key] = lastState.value;
//
//    this.dispatchEvent(new ControlKit.Event(this,ControlKit.EventType.STATE_POP,null));
//};
//
//ControlKit.History.prototype.getNumStates = function(){return this._states.length;};
//
///*---------------------------------------------------------------------------------*/
//
//ControlKit.History._instance   = null;
//ControlKit.History.setup        = function(){return ControlKit.History._instance = new ControlKit.History();};
//ControlKit.History.getInstance = function(){return ControlKit.History._instance;};
//
//ControlKit.History.prototype.enable     = function(){this._isDisabled=false;};
//ControlKit.History.prototype.disable    = function(){this._isDisabled=true;};
//ControlKit.History.prototype.isDisabled = function(){return this._isDisabled;};