'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.actionsReducersBuilder = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _entityActionsBuilder = require('../actions/entity-actions-builder');

var _reducerBuilder4 = require('../reducers/reducer-builder');

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _capitalize = require('lodash/capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _reducerBuilderFunction(nodes, types, defaultData, actionTypes) {
    var isArrayTypes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    var reducerBuilderReduce = void 0;
    if (isArrayTypes) {
        reducerBuilderReduce = function reducerBuilderReduce(element) {
            return (0, _reducerBuilder4.reducerBuilder)(types.reduce(function (acc, type) {
                var _extends2;

                if (defaultData) return _extends({}, acc, (_extends2 = { name: element }, _defineProperty(_extends2, type + 'Types', actionTypes[type].action), _defineProperty(_extends2, 'defaultData', defaultData[type]), _extends2));
                return _extends({}, acc, _defineProperty({ name: element }, type + 'Types', actionTypes[type].action));
            }, {}));
        };
    } else {
        reducerBuilderReduce = function reducerBuilderReduce(element) {
            var _reducerBuilder2;

            return (0, _reducerBuilder4.reducerBuilder)((_reducerBuilder2 = { name: element }, _defineProperty(_reducerBuilder2, types + 'Types', actionTypes), _defineProperty(_reducerBuilder2, 'defaultData', defaultData), _reducerBuilder2));
        };
    }
    if ((0, _isArray2.default)(nodes)) {
        return nodes.reduce(function (acc, elm) {
            return _extends({}, acc, _defineProperty({}, elm, reducerBuilderReduce(elm)));
        }, {});
    } else {
        return reducerBuilderReduce(nodes);
    }
}

var actionsReducersBuilder = exports.actionsReducersBuilder = function actionsReducersBuilder(_ref) {
    var name = _ref.name;
    var nodes = _ref.nodes;
    var types = _ref.types;
    var service = _ref.service;
    var defaultData = _ref.defaultData;

    if ((0, _isArray2.default)(types)) {
        var _ref2;

        var _actionBuilderMultiTypes = types.reduce(function (acc, elem) {
            return _extends({}, acc, _defineProperty({}, elem, (0, _entityActionsBuilder.actionBuilder)({ names: nodes, type: elem, service: service[elem] })));
        }, {});
        var _reducerBuilder = _reducerBuilderFunction(nodes, types, defaultData, _actionBuilderMultiTypes, true);
        return _ref2 = {}, _defineProperty(_ref2, name + 'Actions', _actionBuilderMultiTypes), _defineProperty(_ref2, name + 'Reducers', _reducerBuilder), _ref2;
    } else {
        var _ref3;

        var _actionBuilder = (0, _entityActionsBuilder.actionBuilder)({ names: nodes, type: types, service: service });
        var _reducerBuilder3 = _reducerBuilderFunction(nodes, types, defaultData, _actionBuilder.action, false);
        return _ref3 = {}, _defineProperty(_ref3, name + 'Actions', _actionBuilder), _defineProperty(_ref3, name + 'Reducers', _reducerBuilder3), _ref3;
    }
};

function verifProps(_ref4) {
    var name = _ref4.name;
    var nodes = _ref4.nodes;
    var types = _ref4.types;
    var service = _ref4.service;
    var defaultData = _ref4.defaultData;

    if (!(0, _isString2.default)(name)) {
        throw new Error('Name should be a string : ' + name);
    }
    if (!(0, _isString2.default)(types) && !(0, _isArray2.default)(types) || (0, _isArray2.default)(types) && types.length === 1) {
        throw new Error('Types should be a array with two elements or a string : ' + types);
    }
    if (!(0, _isString2.default)(nodes) && !(0, _isArray2.default)(nodes) || (0, _isArray2.default)(nodes) && nodes.length === 1) {
        throw new Error('Node should be a array with two elements or a string : ' + nodes);
    }
    if (!(0, _isFunction2.default)(service) && (0, _isArray2.default)(types) && !(0, _isObject2.default)(service) || (0, _isArray2.default)(types) && (Object.keys(service).indexOf('load') === -1 || Object.keys(service).indexOf('save') === -1)) {
        throw new Error('Service should be a function or an object with the key \'load\' and \'save\' : ' + service);
    }
    if (defaultData) {
        if (!(0, _isObject2.default)(defaultData) || (0, _isArray2.default)(types) && (Object.keys(defaultData).indexOf('load') === -1 || Object.keys(defaultData).indexOf('save') === -1)) {
            throw new Error('DefaultData should be an object or an object with the key \'load\' and \'save\' if there is 2 types: ' + defaultData);
        }
    }
}

exports.default = function (conf) {
    if ((0, _isArray2.default)(conf)) {
        return conf.reduce(function (acc, elm) {
            verifProps(elm);
            return _extends({}, acc, _defineProperty({}, elm.name, actionsReducersBuilder(_extends({}, elm))));
        }, {});
    } else {
        verifProps(conf);
        return actionsReducersBuilder(conf);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIl9yZWR1Y2VyQnVpbGRlckZ1bmN0aW9uIiwibm9kZXMiLCJ0eXBlcyIsImRlZmF1bHREYXRhIiwiYWN0aW9uVHlwZXMiLCJpc0FycmF5VHlwZXMiLCJyZWR1Y2VyQnVpbGRlclJlZHVjZSIsImVsZW1lbnQiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwibmFtZSIsImFjdGlvbiIsImVsbSIsImFjdGlvbnNSZWR1Y2Vyc0J1aWxkZXIiLCJzZXJ2aWNlIiwiX2FjdGlvbkJ1aWxkZXJNdWx0aVR5cGVzIiwiZWxlbSIsIm5hbWVzIiwiX3JlZHVjZXJCdWlsZGVyIiwiX2FjdGlvbkJ1aWxkZXIiLCJ2ZXJpZlByb3BzIiwiRXJyb3IiLCJsZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwiaW5kZXhPZiIsImNvbmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBU0EsdUJBQVQsQ0FBa0NDLEtBQWxDLEVBQXdDQyxLQUF4QyxFQUErQ0MsV0FBL0MsRUFBNERDLFdBQTVELEVBQWdHO0FBQUEsUUFBdkJDLFlBQXVCLHVFQUFSLEtBQVE7O0FBQzVGLFFBQUlDLDZCQUFKO0FBQ0EsUUFBR0QsWUFBSCxFQUFpQjtBQUNiQywrQkFBdUIsOEJBQUNDLE9BQUQsRUFBYTtBQUNoQyxtQkFBTyxxQ0FBZUwsTUFBTU0sTUFBTixDQUFhLFVBQUNDLEdBQUQsRUFBTUMsSUFBTixFQUFlO0FBQUE7O0FBQzlDLG9CQUFHUCxXQUFILEVBQWdCLG9CQUFXTSxHQUFYLGlCQUFnQkUsTUFBTUosT0FBdEIsK0JBQWdDRyxPQUFLLE9BQXJDLEVBQWdETixZQUFZTSxJQUFaLEVBQWtCRSxNQUFsRSw2Q0FBdUZULFlBQVlPLElBQVosQ0FBdkY7QUFDaEIsb0NBQVdELEdBQVgsb0JBQWdCRSxNQUFNSixPQUF0QixJQUFnQ0csT0FBSyxPQUFyQyxFQUFnRE4sWUFB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QU1KLEVBTkksQ0FBUDtBQU9ILEtBUkQsTUFRTztBQUNIUSxtQkFBV00sSUFBWDtBQUNBLGVBQU9iLHVCQUF1QmEsSUFBdkIsQ0FBUDtBQUNIO0FBQ0osQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YWN0aW9uQnVpbGRlcn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9ucy1idWlsZGVyJztcclxuaW1wb3J0IHtyZWR1Y2VyQnVpbGRlcn0gZnJvbSAnLi4vcmVkdWNlcnMvcmVkdWNlci1idWlsZGVyJztcclxuXHJcbmltcG9ydCBpc0FycmF5IGZyb20gJ2xvZGFzaC9pc0FycmF5JztcclxuaW1wb3J0IGNhcGl0YWxpemUgZnJvbSAnbG9kYXNoL2NhcGl0YWxpemUnXHJcbmltcG9ydCBpc1N0cmluZyBmcm9tICdsb2Rhc2gvaXNTdHJpbmcnXHJcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJ2xvZGFzaC9pc0Z1bmN0aW9uJztcclxuaW1wb3J0IGlzT2JqZWN0IGZyb20gJ2xvZGFzaC9pc09iamVjdCc7XHJcblxyXG5mdW5jdGlvbiBfcmVkdWNlckJ1aWxkZXJGdW5jdGlvbiAobm9kZXMsdHlwZXMsIGRlZmF1bHREYXRhLCBhY3Rpb25UeXBlcywgaXNBcnJheVR5cGVzID0gZmFsc2UgKSB7XHJcbiAgICBsZXQgcmVkdWNlckJ1aWxkZXJSZWR1Y2U7XHJcbiAgICBpZihpc0FycmF5VHlwZXMpIHtcclxuICAgICAgICByZWR1Y2VyQnVpbGRlclJlZHVjZSA9IChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiByZWR1Y2VyQnVpbGRlcih0eXBlcy5yZWR1Y2UoKGFjYywgdHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoZGVmYXVsdERhdGEpIHJldHVybiB7Li4uYWNjLCBuYW1lOiBlbGVtZW50LCBbdHlwZSsnVHlwZXMnXSA6IGFjdGlvblR5cGVzW3R5cGVdLmFjdGlvbiwgZGVmYXVsdERhdGE6IGRlZmF1bHREYXRhW3R5cGVdfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsuLi5hY2MsIG5hbWU6IGVsZW1lbnQsIFt0eXBlKydUeXBlcyddIDogYWN0aW9uVHlwZXNbdHlwZV0uYWN0aW9ufVxyXG4gICAgICAgICAgICB9LCB7fSkpXHJcbiAgICAgICAgfVxyXG4gICAgfWVsc2Uge1xyXG4gICAgICAgIHJlZHVjZXJCdWlsZGVyUmVkdWNlID0gKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlZHVjZXJCdWlsZGVyKHtuYW1lOiBlbGVtZW50LCBbdHlwZXMrICdUeXBlcyddOiBhY3Rpb25UeXBlcywgZGVmYXVsdERhdGEgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihpc0FycmF5KG5vZGVzKSl7XHJcbiAgICAgICAgcmV0dXJuIG5vZGVzLnJlZHVjZSgoYWNjLCBlbG0pID0+ICh7Li4uYWNjLFxyXG4gICAgICAgICAgICBbZWxtXTogcmVkdWNlckJ1aWxkZXJSZWR1Y2UoZWxtKVxyXG4gICAgICAgIH0pLCB7fSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHJlZHVjZXJCdWlsZGVyUmVkdWNlKG5vZGVzKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBhY3Rpb25zUmVkdWNlcnNCdWlsZGVyID0gKHtuYW1lLCBub2RlcywgdHlwZXMsIHNlcnZpY2UsIGRlZmF1bHREYXRhfSkgPT4ge1xyXG4gICAgaWYoaXNBcnJheSh0eXBlcykpIHtcclxuICAgICAgICBjb25zdCBfYWN0aW9uQnVpbGRlck11bHRpVHlwZXMgPSB0eXBlcy5yZWR1Y2UoKGFjYywgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gey4uLmFjYywgW2VsZW1dOiBhY3Rpb25CdWlsZGVyKHtuYW1lczogbm9kZXMsIHR5cGU6IGVsZW0sIHNlcnZpY2U6IHNlcnZpY2VbZWxlbV19KX1cclxuICAgICAgICB9LCB7fSlcclxuICAgICAgICBjb25zdCBfcmVkdWNlckJ1aWxkZXIgPSBfcmVkdWNlckJ1aWxkZXJGdW5jdGlvbiAobm9kZXMsIHR5cGVzLCAgZGVmYXVsdERhdGEsIF9hY3Rpb25CdWlsZGVyTXVsdGlUeXBlcywgdHJ1ZSlcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBbbmFtZSArICdBY3Rpb25zJ10gOiBfYWN0aW9uQnVpbGRlck11bHRpVHlwZXMsXHJcbiAgICAgICAgICAgIFtuYW1lICsgJ1JlZHVjZXJzJ10gOiBfcmVkdWNlckJ1aWxkZXJcclxuICAgICAgICB9XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgICAgY29uc3QgX2FjdGlvbkJ1aWxkZXIgPSBhY3Rpb25CdWlsZGVyKHtuYW1lczogbm9kZXMsIHR5cGU6IHR5cGVzLCBzZXJ2aWNlfSlcclxuICAgICAgICBjb25zdCBfcmVkdWNlckJ1aWxkZXIgPSBfcmVkdWNlckJ1aWxkZXJGdW5jdGlvbiAobm9kZXMsdHlwZXMsIGRlZmF1bHREYXRhLCAgX2FjdGlvbkJ1aWxkZXIuYWN0aW9uLCBmYWxzZSApXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgW25hbWUgKyAnQWN0aW9ucyddIDogX2FjdGlvbkJ1aWxkZXIsXHJcbiAgICAgICAgICAgIFtuYW1lICsgJ1JlZHVjZXJzJ10gOiBfcmVkdWNlckJ1aWxkZXJcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB2ZXJpZlByb3BzICh7bmFtZSwgbm9kZXMsIHR5cGVzLCBzZXJ2aWNlLCBkZWZhdWx0RGF0YX0pIHtcclxuICAgIGlmKCFpc1N0cmluZyhuYW1lKSl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOYW1lIHNob3VsZCBiZSBhIHN0cmluZyA6ICR7bmFtZX1gKVxyXG4gICAgfVxyXG4gICAgaWYoKCFpc1N0cmluZyh0eXBlcykgJiYgIWlzQXJyYXkodHlwZXMpKSB8fCAoaXNBcnJheSh0eXBlcykgJiYgdHlwZXMubGVuZ3RoID09PSAxKSl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUeXBlcyBzaG91bGQgYmUgYSBhcnJheSB3aXRoIHR3byBlbGVtZW50cyBvciBhIHN0cmluZyA6ICR7dHlwZXN9YClcclxuICAgIH1cclxuICAgIGlmKCghaXNTdHJpbmcobm9kZXMpICYmICFpc0FycmF5KG5vZGVzKSl8fCggaXNBcnJheShub2RlcykgJiYgbm9kZXMubGVuZ3RoID09PSAxKSl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb2RlIHNob3VsZCBiZSBhIGFycmF5IHdpdGggdHdvIGVsZW1lbnRzIG9yIGEgc3RyaW5nIDogJHtub2Rlc31gKVxyXG4gICAgfVxyXG4gICAgaWYoIWlzRnVuY3Rpb24oc2VydmljZSkgJiYgKGlzQXJyYXkodHlwZXMpICYmICFpc09iamVjdChzZXJ2aWNlKSkgfHwgKGlzQXJyYXkodHlwZXMpICYmIChPYmplY3Qua2V5cyhzZXJ2aWNlKS5pbmRleE9mKCdsb2FkJykgPT09IC0xIHx8IE9iamVjdC5rZXlzKHNlcnZpY2UpLmluZGV4T2YoJ3NhdmUnKSA9PT0gLTEpKSl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXJ2aWNlIHNob3VsZCBiZSBhIGZ1bmN0aW9uIG9yIGFuIG9iamVjdCB3aXRoIHRoZSBrZXkgJ2xvYWQnIGFuZCAnc2F2ZScgOiAke3NlcnZpY2V9YClcclxuICAgIH1cclxuICAgIGlmKGRlZmF1bHREYXRhKXtcclxuICAgICAgICBpZighaXNPYmplY3QoZGVmYXVsdERhdGEpIHx8IChpc0FycmF5KHR5cGVzKSAmJiAoT2JqZWN0LmtleXMoZGVmYXVsdERhdGEpLmluZGV4T2YoJ2xvYWQnKSA9PT0gLTEgfHwgT2JqZWN0LmtleXMoZGVmYXVsdERhdGEpLmluZGV4T2YoJ3NhdmUnKSA9PT0gLTEpKSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRGVmYXVsdERhdGEgc2hvdWxkIGJlIGFuIG9iamVjdCBvciBhbiBvYmplY3Qgd2l0aCB0aGUga2V5ICdsb2FkJyBhbmQgJ3NhdmUnIGlmIHRoZXJlIGlzIDIgdHlwZXM6ICR7ZGVmYXVsdERhdGF9YClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoY29uZikgPT4ge1xyXG4gICAgaWYoaXNBcnJheShjb25mKSl7XHJcbiAgICAgICAgcmV0dXJuIGNvbmYucmVkdWNlKChhY2MsIGVsbSk9PiB7XHJcbiAgICAgICAgICAgIHZlcmlmUHJvcHMoZWxtKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC4uLmFjYyxcclxuICAgICAgICAgICAgICAgIFtlbG0ubmFtZV0gOiBhY3Rpb25zUmVkdWNlcnNCdWlsZGVyKHsuLi5lbG19KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAse30pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZlcmlmUHJvcHMoY29uZilcclxuICAgICAgICByZXR1cm4gYWN0aW9uc1JlZHVjZXJzQnVpbGRlcihjb25mKVxyXG4gICAgfVxyXG59O1xyXG4iXX0=