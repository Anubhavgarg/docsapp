var visualizationServicesModule = angular.module('visualizationServicesModule', []);

visualizationServicesModule.factory('instanceNumFactory', ['$timeout', function() {		//To get unique ids on a page
	var instNum= 0;
	var factory= {
		instNum: instNum,
		instArr: [],
		returnUniqueVal: function(val, arr, chartType) {
			var idToCheck = chartType + factory.instNum;
			if(arr.indexOf(idToCheck) > -1) {
				factory.instNum++;
				idToCheck = chartType + factory.instNum;
				factory.returnUniqueVal(idToCheck,arr,chartType);
			}
			else {
				factory.instNum++;
				return idToCheck;
			}
		},
		createBindingId: function(id, chartType) {
			var chartId = id;
			if(id)  {
				factory.instArr.push(chartId);
			} else {
				chartId = factory.returnUniqueVal(id, factory.instArr, chartType);
			}
			return chartId;
		}
	}

	return factory;
}]);

visualizationServicesModule.service('vizUtilServices', ['$timeout', function() {
	this.mergeObj = function(objectList) {
		var obj = {};
		objectList.forEach(function(x) {
			for (var i in x) {
				obj[i] = x[i];
			}
		});
		return obj;
	}

this.getLength = function(obj) {
	if(!obj) {
		return 0;
	}
	if(typeof obj != 'object') {
		return obj.toString().length;
	}
	var objKeyArr = Object.keys(obj);
	for(var i=0; i<objKeyArr.length; i++) {
		if(objKeyArr[i].indexOf('$$hashKey') > -1) {
			objKeyArr.splice(i,1);
		}
	}
	return objKeyArr.length;
}
}])