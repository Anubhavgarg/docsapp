var visualization = angular.module('visualization', ['visualizationServicesModule']);

var defaultItems = {
	columnData : [
	   {"name":"Data1","values":"1,6"},
	   {"name":"Data2","values":"5,4"}
	],
	categories : ['Category-1', 'Category-2'],
	columnColours:  ["#408F91","#96D9BF","#EEAC9A","#9DC1BE",'#8A8D91','#586053','#ECE8C6','#CEB7C5'],
	legendPosition : 'bottom'
}

function createChartColumns(columnData) {
	// console.log(columnData)
    var columnDataArray = columnData ? columnData : defaultItems.columnData;
	var columnJson = [];
	for(var i=0; i<columnDataArray.length; i++) {
		var columnData = [];
		var values = columnDataArray[i].values.split(',');
		// console.log(columnDataArray[i])
		// console.log(values);
		columnData.push(columnDataArray[i].name);
		for(var j=0; j<values.length; j++) {
			columnData.push(formatString(values[j], 'graph'));
		}
		columnJson.push(columnData);
	}
	return columnJson;
}

function createColorPatternArr(columnData) {
	var colorPatternArr = [];
	var columnDataArray = columnData ? columnData : defaultItems.columnData;
	for(var i=0; i<columnDataArray.length;i++) {
        if(columnDataArray[i].color) {
            colorPatternArr.push(columnDataArray[i].color);
        }
        else {
            colorPatternArr.push(defaultItems.columnColours[i]);
        }
    }
	return colorPatternArr;
}

function createAxisLabels(chartCategories) {
	var axisLabelArray = chartCategories ? chartCategories : defaultItems.categories;
	if(typeof(axisLabelArray) == "object") {
		if($.isArray(axisLabelArray)) {
			return axisLabelArray;
		}
		else {
			return axisLabelArray[0]['values'];
		}

	}
}

function createScatterAssociateValObj(obj, columnData) {
	var associatedValObj = obj ? obj : {};
	var columnDataNameArr = [];
	if(Object.keys(associatedValObj).length) {
		var valInObjArr = [];
		for(var key in obj) {
			valInObjArr.push(key, obj[key]);
		}
		for(var i=0; i<columnData.length;) {
			if(valInObjArr.indexOf(columnData[i][0]) < 0) {
				columnData.splice(i,1);
			}
			else {
				i++;
			}
		}
	}
	else {
		for(var i=0; i<columnData.length; i++) {
			columnDataNameArr.push(columnData[i][0]);
		}
		for(var j=0; j<columnDataNameArr.length; j++) {
			var nameToSearch = columnDataNameArr[j] + '_x';
			if(columnDataNameArr.indexOf(nameToSearch) > -1) {
				associatedValObj[columnDataNameArr[j]] = nameToSearch;
			}
		}
	}

	return associatedValObj;
}

function createTableData(data) {
	if(!data || !data.length) {
		return;
	}
	var tableData = [];
	var tableHeaderData = [];
	var tableBodyData = [];
	var numBodyRows = 0;

	for(var i in data) {
		if(data[i]['values'].length > numBodyRows) {
			numBodyRows = data[i]['values'].length;
		}
	}

	for(var j=0; j<numBodyRows; j++) {
		tableBodyData[j] = {};
	}

	for(var i in data) {
		tableHeaderData.push(data[i]['name']);
		//to make the values as an array
		if(typeof data[i]['values'] == 'string')
			data[i]['values'] = data[i]['values'].split(',');

		for(var k=0;k<numBodyRows;k++) {
			if(!data[i]['values'][k] || isNaN(data[i]['values'][k])) {
				tableBodyData[k][data[i]['name']] = data[i]['values'][k];
			}
			else {
				tableBodyData[k][data[i]['name']] = Number(data[i]['values'][k]);
			}
 		}
	}
	tableData.push(tableHeaderData, tableBodyData);
	return tableData;
}

function getObjectLength(obj) {
	var objKeyArr = Object.keys(obj);
	for(var i=0; i<objKeyArr.length; i++) {
		if(objKeyArr[i].indexOf('$$hashKey') > -1) {
			objKeyArr.splice(i,1);
		}
	}
	return objKeyArr.length;
}

visualization.chartNum=0;
visualization.idArr=[];

function returnNewVal(val, arr, chartType) {
	var idToCheck = chartType + visualization.chartNum;
	if(arr.indexOf(idToCheck) > -1) {
		visualization.chartNum++;
		idToCheck = chartType + visualization.chartNum;
		returnNewVal(idToCheck,arr,chartType);
	}
	else {
		visualization.chartNum++;
		return idToCheck;
	}
}
function createBindingId(id, chartType) {
	var chartId = id;
	if(id)  {
		visualization.idArr.push(chartId);
	} else {
		chartId = returnNewVal(id, visualization.idArr, chartType);
	}
	return chartId;
}

function isUrl(str) {
	var urlFlag = false;
	if(str) {
		if(str.toString().indexOf('http') > -1) {
			urlFlag = true;
		}
	}
	return urlFlag;
}

function urlType(str) {
	if(str.toString().indexOf('_viz_PHOTO') > -1) {
		return 'photo';
	}
	else if(str.toString().indexOf('_viz_FILE') > -1) {
		return 'file';
	}
}

function formatString(nStr, chartType) {
	if(!nStr || isNaN(nStr) || typeof nStr == 'boolean') {
		var nStr = (nStr=='true' || nStr=='false') ? (nStr=='true' ? true : false) : nStr;
		return nStr;
	}
	else if(chartType == 'table') {
		return parseFloat(nStr).toLocaleString('en', { maximumFractionDigits: 2 });
	}
	else if(chartType == 'graph') {
		if(Math.floor(nStr) == nStr) {
			nStr = nStr;
		}
		else {
			nStr = Number(parseFloat(nStr).toFixed(2));
		}
		return nStr;
	}
	else if(!isNaN(parseFloat(nStr)) && isFinite(nStr)) {
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var u;

		if(x1.length >= 17) {
			x1 = x1.slice(0,-15);
			u = 'Q';
		} else if(x1.length >= 14) {
			x1 = x1.slice(0,-12);
			u = 'T';
		} else if(x1.length >= 11) {
			x1 = x1.slice(0,-9);
			u = 'B';
		} else if(x1.length >= 8) {
			x1 = x1.slice(0,-6);
			u = 'M';
		} else if(x1.length >= 6) {
			x1 = x1.slice(0,-3);
			u = 'K';
		} else {
			return parseFloat(nStr).toLocaleString('en', { maximumFractionDigits: 2 });
		}

		var x2 = u ? ' ' + u : (x.length > 1 ? '.' + x[1] : '');
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
}

/*Chart Directives*/

//scatter Chart
visualization.directive('p3ChartScatter', ['$timeout', function($timeout) {
	function chartLink(scope, element, attrs) {
		var dimensionToWatchArr = ["height","width"];
		var attrsToWatch = ["chartColumns", "chartCategories", "legendPosn", "transform"];

		scope.bindToId = createBindingId(scope.bindto, 'scatter');

		scope.$watchGroup(attrsToWatch, function () {
            loadChartData();
        }, true);

		function loadChartData() {

			var graphCreate = function() {
				var bindId = '#' + scope.bindToId;
				var legendPosn = scope.legendPosn ? scope.legendPosn : "bottom";
				var xLabel = scope.xLabel ? scope.xLabel : ' ';
				var yLabel = scope.yLabel ? scope.yLabel : ' ';
				var columnData = createChartColumns(scope.chartColumns);

				var chart = c3.generate({
					bindto: bindId,
				    data: {
				        xs: createScatterAssociateValObj(scope.associatedValObj, columnData),
				        columns: columnData,
				        type: 'scatter'
				    },
				    axis: {
				        x: {
				            label: xLabel,
				            tick: {
				                fit: false
				            }
				        },
				        y: {
				            label: yLabel
				        }
				    },
				    color: {
						pattern: createColorPatternArr(scope.chartColumns) //array having colours for each bar
					},
				});

				scope.$watchGroup(dimensionToWatchArr, function(newValue, oldValue) {
		            chart.resize({height:scope.height, width:scope.width});
		        }, true);

				if(scope.transform) {
					chart.transform(scope.transform);
				}
			}
			$timeout(function() {
				graphCreate();
			},300);
		}
	}
	return {
		restrict: 'E',
		scope: {
			bindto: "@bindToId",
			chartColumns: "=columnData",
			associatedValObj: "=valuePair",
			xLabel: "=label",
			yLabel: "=yLabel",
			height: "=height",
			width: "=width"
		},
		templateUrl: 'viz_charts.html',
		link: chartLink
	}
}]);

//Bar chart
visualization.directive('p3ChartBar', ['$timeout', function($timeout) {

	function chartLink(scope, element, attrs) {
		var dimensionToWatchArr = ["height","width"];
		var attrsToWatch = ["forceChartRender", "chartColumns", "chartCategories", "legendPosn", "transform"];

		scope.bindToId = createBindingId(scope.bindto, 'bar');
		// console.log(scope.bindToId);
		//var changeToWatchArr = '["chartColumns", "chartCategories","transform", "legendPosn"]';

		scope.$watchGroup(attrsToWatch, function() {
						// console.log("changing : ", attrsToWatch);
            loadChartData();
        }, true);

		function loadChartData() {

			var graphCreate = function() {
				var bindId = '#' + scope.bindToId;
				var legendPosn = scope.legendPosn? scope.legendPosn : defaultItems.legendPosition;

				// console.log(scope.chartColumns);
				// console.log(createChartColumns(scope.chartColumns));
				// console.log(createAxisLabels(scope.chartCategories));

				var chart = c3.generate({
					bindto: bindId,
				    data: {
						columns: createChartColumns(scope.chartColumns),
						type: 'bar'
					},
					bar: {
						width: {
						    ratio: 0.5 // this makes bar width 50% of length between ticks
						}
					},
					axis: {
						x: {
							type: 'category',
							categories: createAxisLabels(scope.chartCategories)
						},
						rotated: scope.axisRotate
					},
					tooltip: {
					    format: {
					        value: function (value, ratio, id) {
					            var format = d3.format(',');
					            return format(value);
					        }
					    }
					},
					color: {
						pattern: createColorPatternArr(scope.chartColumns) //array having colours for each bar
					},
				    legend: {
				        position: legendPosn
				    },
				    grid: {
				        y: {
				            lines: [{value:0}]
				        }
				    }
				});

				scope.$watchGroup(dimensionToWatchArr, function(newValue, oldValue) {
		            chart.resize({height:scope.height, width:scope.width});
		        }, true);

				if(scope.transform) {
					chart.transform(scope.transform);
				}
			}
			$timeout(function() {
				graphCreate();
			},300);
		}
	}
	return {
		"restrict": 'E',
		"scope": {
            "bindto": "@bindToId",
            "chartColumns": "=columnData",
            "chartCategories":"=axisCategories",
            "axisRotate" : "=axisRotate",
            "transform" : "=chartTransform",
            "legendPosn": "=legendPosition",
            "height": "=height",
            "width": "=width",
						"forceChartRender": "="
        },
        templateUrl: 'viz_charts.html',
		link: chartLink
	}
}]);

//Column chart
visualization.directive('p3ChartColumn', ['$timeout', function($timeout) {

	function chartLink(scope, element, attrs) {
		var dimensionToWatchArr = ["height","width"];
		var attrsToWatch = ["chartColumns", "chartCategories", "legendPosn", "transform"];

		scope.bindToId = createBindingId(scope.bindto, 'bar');

		scope.$watch(attrsToWatch, function () {
            loadChartData();
        }, true);

		function loadChartData() {

			var graphCreate = function() {
				var bindId = '#' + scope.bindToId;
				var legendPosn = scope.legendPosn? scope.legendPosn : "bottom";

				var chart = c3.generate({
					bindto: bindId,
				    data: {
						columns: createChartColumns(scope.chartColumns),
						type: 'bar'
					},
					bar: {
						width: {
						    ratio: 0.5 // this makes bar width 50% of length between ticks
						}
					},
					axis: {
						x: {
							type: 'category',
							categories: createAxisLabels(scope.chartCategories)
						},
						rotated: true
					},
					tooltip: {
					    format: {
					        value: function (value, ratio, id) {
					            var format = d3.format(',');
					            return format(value);
					        }
					    }
					},
					color: {
						pattern: createColorPatternArr(scope.chartColumns) //array having colours for each bar
					},
				    legend: {
				        position: legendPosn
				    }
				});

				scope.$watchGroup(dimensionToWatchArr, function(newValue, oldValue) {
		            chart.resize({height:scope.height, width:scope.width});
		        }, true);

				if(scope.transform) {
					chart.transform(scope.transform);
				}
			}

			$timeout(function() {
				graphCreate();
			},300);
		}
	}

	return {
		"restrict": 'E',
		"scope": {
            "bindto": "@bindToId",
            "chartColumns": "=columnData",
            "chartCategories":"=axisCategories",
            "transform" : "=chartTransform",
            "legendPosn": "=legendPosition",
            "height": "=height",
            "width": "=width"
        },
        templateUrl: 'viz_charts.html',
		link: chartLink
	}
}]);

//Stacked Bar chart
visualization.directive('p3ChartStackedBar', ['$timeout', function($timeout) {

	function chartLink(scope, element, attrs) {
		var dimensionToWatchArr = ["height","width"];
		var attrsToWatch = ["chartColumns", "chartCategories", "legendPosn", "transform"];

		scope.bindToId = createBindingId(scope.bindto, 'stackedBar');
		//var changeToWatchArr = '["chartColumns", "chartCategories","transform", "legendPosn"]';

		scope.$watchGroup(attrsToWatch, function () {
            loadChartData();
        }, true);

		function loadChartData() {

			var graphCreate = function() {
				var bindId = '#' + scope.bindToId;
				var legendPosn = scope.legendPosn? scope.legendPosn : defaultItems.legendPosition;
				var dataToBeStacked = scope.groupData ? scope.groupData : [];

				var chart = c3.generate({
					bindto: bindId,
				    data: {
						columns: createChartColumns(scope.chartColumns),
						type: 'bar',
						groups: [dataToBeStacked]
					},
					bar: {
						width: {
						    ratio: 0.5 // this makes bar width 50% of length between ticks
						}
					},
					axis: {
						x: {
							type: 'category',
							categories: createAxisLabels(scope.chartCategories)
						},
						rotated: scope.axisRotate
					},
					tooltip: {
					    format: {
					        value: function (value, ratio, id) {
					            var format = d3.format(',');
					            return format(value);
					        }
					    }
					},
					color: {
						pattern: createColorPatternArr(scope.chartColumns) //array having colours for each bar
					},
				    legend: {
				        position: legendPosn
				    },
				    grid: {
				        y: {
				            lines: [{value:0}]
				        }
				    }
				});

				scope.$watchGroup(dimensionToWatchArr, function(newValue, oldValue) {
		            chart.resize({height:scope.height, width:scope.width});
		        }, true);

				if(scope.transform) {
					chart.transform(scope.transform);
				}
			}

			$timeout(function() {
				graphCreate();
			},300);
		}
	}

	return {
		"restrict": 'E',
		"scope": {
            "bindto": "@bindToId",
            "chartColumns": "=columnData",
            "chartCategories":"=axisCategories",
            "groupData":"=groupData",  // has to be an array
            "axisRotate" : "=axisRotate",
            "transform" : "=chartTransform",
            "legendPosn": "=legendPosition",
            "height": "=height"
        },
        templateUrl: 'viz_charts.html',
		link: chartLink
	}
}]);

//Stacked Bar chart
visualization.directive('p3ChartStackedColumn', ['$timeout', function($timeout) {

	function chartLink(scope, element, attrs) {
		var dimensionToWatchArr = ["height","width"];
		var attrsToWatch = ["chartColumns", "chartCategories", "legendPosn", "transform"];

		scope.bindToId = createBindingId(scope.bindto, 'stackedColumn');
		//var changeToWatchArr = '["chartColumns", "chartCategories","transform", "legendPosn"]';

		scope.$watchGroup(attrsToWatch, function () {
            loadChartData();
        }, true);

		function loadChartData() {

			var graphCreate = function() {
				var bindId = '#' + scope.bindToId;
				var legendPosn = scope.legendPosn? scope.legendPosn : defaultItems.legendPosition;
				var dataToBeStacked = scope.groupData ? scope.groupData : [];

				var chart = c3.generate({
					bindto: bindId,
				    data: {
						columns: createChartColumns(scope.chartColumns),
						type: 'bar',
						groups: [dataToBeStacked]
					},
					bar: {
						width: {
						    ratio: 0.5 // this makes bar width 50% of length between ticks
						}
					},
					axis: {
						x: {
							type: 'category',
							categories: createAxisLabels(scope.chartCategories)
						},
						rotated: true
					},
					tooltip: {
					    format: {
					        value: function (value, ratio, id) {
					            var format = d3.format(',');
					            return format(value);
					        }
					    }
					},
					color: {
						pattern: createColorPatternArr(scope.chartColumns) //array having colours for each bar
					},
				    legend: {
				        position: legendPosn
				    }
				});

				scope.$watchGroup(dimensionToWatchArr, function(newValue, oldValue) {
		            chart.resize({height:scope.height, width:scope.width});
		        }, true);

				if(scope.transform) {
					chart.transform(scope.transform);
				}
			}

			$timeout(function() {
				graphCreate();
			},300);
		}
	}

	return {
		"restrict": 'E',
		"scope": {
            "bindto": "@bindToId",
            "chartColumns": "=columnData",
            "chartCategories":"=axisCategories",
            "groupData":"=groupData",  // has to be an array
            "axisRotate" : "=axisRotate",
            "transform" : "=chartTransform",
            "legendPosn": "=legendPosition",
            "height":"=height",
            "width":"=width"
        },
        templateUrl: 'viz_charts.html',
		link: chartLink
	}
}]);

//line chart
visualization.directive('p3ChartLine', ['$timeout', function($timeout) {

	function chartLink(scope, element, attrs) {
		var dimensionToWatchArr = ["height","width"];
		var attrsToWatch = ["chartColumns", "chartCategories", "legendPosn", "transform"];

		scope.bindToId = createBindingId(scope.bindto, 'line');

		scope.$watchGroup(attrsToWatch, function () {
            loadChartData();
        }, true);

		function loadChartData() {
			$timeout(function() {
				graphCreate();
			});
		}

		function graphCreate() {
			var bindId = "#" + scope.bindToId;
			var legendPosn = scope.legendPosn? scope.legendPosn : defaultItems.legendPosition;

			var chart = c3.generate({
				bindto: bindId,
			    data: {
					columns: createChartColumns(scope.chartColumns),
					type: 'line'
				},
				bar: {
					width: {
					    ratio: 0.5 // this makes bar width 50% of length between ticks
					}
				},
				axis: {
					x: {
						type: 'category',
						categories: createAxisLabels(scope.chartCategories)
					}
				},
				tooltip: {
				    format: {
				        value: function (value, ratio, id) {
				            var format = d3.format(',');
				            return format(value);
				        }
				    }
				},
				color: {
					pattern: createColorPatternArr(scope.chartColumns)
				},
			    legend: {
			        position: legendPosn
			    }
			});

			scope.$watchGroup(dimensionToWatchArr, function(newValue, oldValue) {
	            chart.resize({height:scope.height, width:scope.width});
	        }, true);

			if(scope.transform) {
				chart.transform(scope.transform);
			}
		}
	}

	return {
		"restrict": 'E',
		"scope": {
            "bindto": "@bindToId",
            "chartColumns": "=columnData",
            "chartCategories":"=axisCategories",
            "transform" : "=chartTransform",
            "legendPosn": "=legendPosition",
            "height":"=height",
            "width":"=width"
        },
        templateUrl: 'viz_charts.html',
		link: chartLink
	}
}]);

//Pie chart
visualization.directive('p3ChartPie', ['$timeout', function($timeout) {

	function chartLink(scope, element, attrs) {
		var dimensionToWatchArr = ["height","width"];
		var attrsToWatch = ["chartColumns", "chartCategories", "legendPosn", "transform"];

		scope.bindToId = createBindingId(scope.bindto, 'pie');

		scope.$watch('chartColumns', function () {
            loadChartData();
        }, true);

        function loadChartData() {
			$timeout(function() {
				graphCreate();
			});
		}

		function graphCreate() {
			var bindId = "#" + scope.bindToId;
			var valuePrefix = scope.valuePrefix ? scope.valuePrefix : '';
			var pieType = scope.pieType ? scope.pieType : 'pie';

			var legendPosn = scope.legendPosn? scope.legendPosn : defaultItems.legendPosition;

			var chart = c3.generate({
				bindto: bindId,
			    data: {
					columns: createChartColumns(scope.chartColumns),
					type: pieType,
				},
			    tooltip: {
				    format: {
				        value: function (value, ratio, id) {
				            var format = d3.format(',');
				            return format(value);
				        }
				    }
				},
				color: {
					pattern: createColorPatternArr(scope.chartColumns)
				},
			    legend: {
			        position: legendPosn
			    }
			});
			scope.$watchGroup(dimensionToWatchArr, function(newValue, oldValue) {
				chart.resize({height:scope.height, width:scope.width});
	        }, true);


			if(scope.transform) {
				chart.transform(scope.transform);
			}
        }
	}

	return {
		"restrict": 'E',
		"scope": {
            "bindto": "@bindToId",
            "chartColumns": "=columnData",
            "chartCategories":"=axisCategories",
            "valuePrefix": "@valuePrefix",
            "pieType": "@",
            "transform" : "=chartTransform",
            "legendPosn": "=legendPosition",
            "height":"=height",
            "width":"=width"
        },
		templateUrl: 'viz_charts.html',
		link: chartLink
	}
}]);

///Directive for donut chart
visualization.directive('p3ChartDonut', ['$timeout', function($timeout) {

	function chartLink(scope, element, attrs) {
		var dimensionToWatchArr = ["height","width"];

		var attrsToWatch = ["chartColumns", "chartCategories", "legendPosn", "transform"];

		scope.bindToId = createBindingId(scope.bindto, 'donut');

		scope.$watch('chartColumns', function () {
          loadChartData();
    }, true);

        function loadChartData() {
        	$timeout(function() {
				graphCreate();
			});

			function graphCreate() {
				var bindId = "#" + scope.bindToId;
				var valuePrefix = scope.valuePrefix ? scope.valuePrefix : '';
				var pieType = scope.pieType ? scope.pieType : 'donut';

				var legendPosn = scope.legendPosn? scope.legendPosn : defaultItems.legendPosition;

				var chart = c3.generate({
					bindto: bindId,
				    data: {
						columns: createChartColumns(scope.chartColumns),
						type: pieType,
					},
					tooltip: {
					    format: {
					        value: function (value, ratio, id) {
					            var format = d3.format(',');
					            return format(value);
					        }
					    }
					},
					color: {
						pattern: createColorPatternArr(scope.chartColumns)
					},
				    legend: {
				        position: legendPosn
				    }
				});

				scope.$watchGroup(dimensionToWatchArr, function(newValue, oldValue) {
		            chart.resize({height:scope.height, width:scope.width});
		        }, true);

				if(scope.transform) {
					chart.transform(scope.transform);
				}
			}
        }
	}

	return {
		"restrict": 'E',
		"scope": {
            "bindto": "@bindToId",
            "chartColumns": "=columnData",
            "chartCategories":"=axisCategories",
            "valuePrefix": "@valuePrefix",
            "pieType": "@",
            "transform" : "=chartTransform",
            "legendPosn": "=legendPosition",
            "height": "=height",
            "width": "=width"
        },
        templateUrl: 'viz_charts.html',
		link: chartLink
	}
}]);

//Directive For Gallery Carousel
// visualization.directive('p3ChartGallery2d', ['$timeout', 'vizUtilServices', function($timeout, vizUtilServices) {
//
// 	function chartLink(scope, element, attrs) {
// 		scope.mergeStyleObj = vizUtilServices.mergeObj;
// 		scope.imageVizStyleObj = {width: '100%', height: '100%'};
//
// 		scope.$watch('slideData.length', function () {
//             loadChartData();
//         });
//         scope.$watchGroup(['imageWidth', 'imageHeight'], function () {
// 			createStyleObj();
//         });
//
//         function createStyleObj() {
//         	scope.slideHeight = scope.imageHeight ? scope.imageHeight : '300px';
// 			scope.slideWidth = scope.imageWidth ? scope.imageWidth : '300px';
// 			scope.slideStyleObj = {'width': (scope.slideWidth + ' !important'), 'height': scope.slideHeight};
//         }
//
//         function loadChartData() {
// 			galleryCreate();
//
// 			function galleryCreate() {
// 				scope.slides = scope.slideData ? scope.slideData : null/*defaultItems.galleryImages*/;
// 				scope.slideArrows = scope.arrows == false ? scope.arrows : true;
// 				//var autoPlay = scope.autoPlay != 'undefined' ? scope.autoPlay : true;
// 				$timeout(function() {
// 					initialiseSlick();
// 				}, 300);
// 			}
// 			function initialiseSlick() {
// 				if($('.carousel-2d').hasClass('slick-initialized')) {
// 					$('.carousel-2d').slick('unslick');
// 				}
// 				if(!scope.controls) {
// 					$('.carousel-2d').slick({
// 						pauseOnHover: true,
// 						centerMode: true,
// 						centerPadding: '20px',
// 						arrows: scope.slideArrows,
// 						dots: false,
// 						infinite: true,
// 						slidesToScroll: 1,
// 						autoplay: true,
// 						autoplaySpeed: 2000,
// 						fade: true,
// 						nextArrow: '<i class="fa fa-angle-right nextArrow"></i>',
// 	  					prevArrow: '<i class="fa fa-angle-left prevArrow"></i>',
// 					});
// 				}
// 				if(scope.slides) {
// 					scope.dataLoadedFlag = true;
// 					if(!scope.slides.length) {
// 						scope.noImagesToShow = true;
// 					}
// 				}
//
// 				if(scope.controls) {
// 					if($('.slider-nav').hasClass('slick-initialized')) {
// 						$('.slider-nav').slick('unslick');
// 					}
// 					$('.carousel-2d').slick({
// 						pauseOnHover: true,
// 						centerMode: true,
// 						centerPadding: '20px',
// 						arrows: scope.slideArrows,
// 						dots: false,
// 						infinite: true,
// 						slidesToScroll: 1,
// 						autoplay: true,
// 						autoplaySpeed: 2000,
// 						fade: true,
// 						nextArrow: '<i class="fa fa-angle-right nextArrow"></i>',
// 	  					prevArrow: '<i class="fa fa-angle-left prevArrow"></i>',
// 	  					asNavFor: '.slider-nav',
// 	  					//trigger after the slide appears
// 						// i is current slide index
// 						onAfterChange: function(slickSlider,i) {
// 							//remove all active class
// 							$('.slider-nav .slick-slide').removeClass('slick-active');
// 							//set active class for current slide
// 							$('.slider-nav .slick-slide').eq(i).addClass('slick-active');
// 						 }
// 					});
//
// 					$('.slider-nav').slick({
// 						arrows: false,
// 						centerMode: true,
// 						centerPadding: '20px',
// 						slidesToShow: scope.slides.length,
// 						slidesToScroll: 1,
// 						dots: false,
// 						focusOnSelect: true,
// 						asNavFor: '.carousel-2d'
// 					});
// 				}
//
// 				/*scope.$watch('startSlideNum', function() {
// 					console.log(scope.startSlideNum);
// 					$('.carousel-2d').slickGoTo(scope.startSlideNum);
// 				})*/
//
// 				/*if(scope.startSlideNum) {
// 					$('.carousel-2d').slickGoTo(startSlideNum-1);
// 				}*/
//
// 				$(window).trigger('resize');
// 			}
//         }
// 	}
//
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			slideData: "=columnData",
// 			imageWidth: "@",
// 			imageHeight: "@",
// 			numVisibleImages: "@visibleImages",
// 			autoPlay: "@autoPlay",
// 			controls: "=?slideNav",
// 			startSlideNum: "=?",
// 			arrows: "=?",
// 			imageStyleObj: "=?",
// 			imagesClickable: "=?",
// 			imageClickFn: "&onImageClick",
// 			utils: "=utils"
//         },
//         templateUrl: 'frmwk/visualization/templates/viz_gallery_2d.html',
// 		link: chartLink
// 	}
// }]);

//Directive For Gallery Carousel
// visualization.directive('p3ChartGallery', ['$timeout', function($timeout) {
//
// 	function chartLink(scope, element, attrs) {
// 		scope.bindToId = createBindingId(scope.bindto, 'gallery');
//
// 		scope.$watch('slideData.length', function () {
//             loadChartData();
//         });
//
//         function loadChartData() {
//         	$timeout(function() {
// 				galleryCreate();
// 			});
//
// 			function galleryCreate() {
//
// 			    var attrsToWatch = ["slideData","imageHeight", "imageWidth", "numVisibleImages", "controls", "startSlideNum"];
//
// 				setVarAttrVal();
//
// 			    scope.$watchGroup(attrsToWatch, function() {
// 			    	setVarAttrVal();
// 			    });
// 			}
//
// 			function setVarAttrVal() {
// 				var defaultValForGallery = {
// 					imageWidth : 350,
// 					imageHeight: 250,
// 					numVisibleImages: 5,
// 					controls: true
// 				}
// 				var imageWidth = scope.imageWidth ? scope.imageWidth : defaultValForGallery.imageWidth;
// 				var imageHeight = scope.imageHeight ? scope.imageHeight : defaultValForGallery.imageHeight;
// 				var numImageVisible = scope.numVisibleImages ? scope.numVisibleImages : defaultValForGallery.numVisibleImages;
// 				var controls = defaultValForGallery.controls;
//
// 				if(scope.controls == false) {
// 					controls = scope.controls;
// 				}
// 				scope.slides = scope.slideData ? scope.slideData : defaultItems.galleryImages;
// 				var startSlideNum = (scope.startSlideNum && !isNaN(scope.startSlideNum)) ? scope.startSlideNum : 0;
//
// 				scope.options = {
// 			        sourceProp: 'src',
// 			        perspective: 35,
// 			        startSlide: startSlideNum,
// 			        border: 1,
// 			        dir: 'rtl',
// 			        space: 220,
// 			        controls:controls,
// 			        visible: numImageVisible,
// 			        width: imageWidth,
// 			        height: imageHeight,
// 			    };
//
// 			    var autoAnimationSpeed = scope.autoAnimationSpeed && !isNaN(scope.autoAnimationSpeed) ? scope.autoAnimationSpeed : 2000;
// 			    /*$(document).keydown(function(e){
// 				    switch(e.keyCode) {
// 				    	case 37 :
// 				    		e.stopPropagation();
// 				    		break;
// 				    	case 39 :
// 				    		element.find($('.carousel-3d-prev.arrow-right')).click();
// 				    		e.stopPropagation();
// 				    		break;
// 				    }
// 				    e.stopPropagation();
// 				});*/
// 			    /*if(scope.autoAnimation) {
// 				    setInterval(function() {
// 				    	$('.carousel-3d-prev.arrow-right').click();
// 				    }, autoAnimationSpeed)
// 			    }*/
// 			}
//         }
// 	}
//
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			slideData: "=columnData",
// 			imageWidth: "=",
// 			imageHeight: "=",
// 			numVisibleImages: "=visibleImages",
// 			controls: "=slideControl",
// 			startSlideNum: "=?",
// 			autoAnimation: "=?",
// 			autoAnimationSpeed: "=?",
// 			hideCaptionArea: "=?"
//         },
//         templateUrl: 'frmwk/visualization/templates/viz_gallery.html',
// 		link: chartLink
// 	}
// }]);

//For Maps
// visualization.directive('p3ChartMap', ['$timeout', function($timeout) {
//
// 	function chartLink(scope, element, attrs) {
// 		scope.bindToId = createBindingId(scope.bindto, 'map');
//
// 		scope.$watch('mapData', function () {
//             loadChartData();
//         }, true);
//
//         function loadChartData() {
//         	$timeout(function() {
// 				mapCreate();
// 			});
//
// 			function mapCreate() {
// 				var bindToEle = document.getElementById(scope.bindToId);
// 				var cities = scope.mapData;
// 				var zoomVal = scope.zoomVal && !isNaN(scope.zoomVal) ? Number(scope.zoomVal) : 4;
//
// 				var mapOptions = {
// 					zoom: zoomVal,
// 					center: new google.maps.LatLng(25,75),
// 					mapTypeId: google.maps.MapTypeId.TERRAIN
// 				}
//
// 				if(cities && cities.length == 1) {
// 					mapOptions.center = new google.maps.LatLng(cities[0].lat, cities[0].long);
// 				}
//
// 				scope.map = new google.maps.Map(bindToEle, mapOptions);
//
// 				scope.markers = [];
//
// 				var infoWindow = new google.maps.InfoWindow();
//
// 				var createMarker = function (info){
// 					var marker = new google.maps.Marker({
// 						map: scope.map,
// 						position: new google.maps.LatLng(info.lat, info.long),
// 						title: info.city
// 					});
// 					marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
//
// 					google.maps.event.addListener(marker, 'click', function(){
// 						infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
// 						infoWindow.open(scope.map, marker);
// 					});
// 					scope.markers.push(marker);
// 				}
// 				if(cities && cities.length) {
// 					for (i = 0; i < cities.length; i++) {
// 						if(!cities[i]['city']) {
// 							cities[i]['city'] = ' ';
// 						}
// 						if(!cities[i]['desc']) {
// 							cities[i]['desc'] = ' ';
// 						}
// 						createMarker(cities[i]);
// 					}
// 				}
// 				scope.openInfoWindow = function(e, selectedMarker) {
// 					e.preventDefault();
// 					google.maps.event.trigger(selectedMarker, 'click');
// 				}
// 				google.maps.event.addListenerOnce(scope.map, 'idle', function() {
// 					google.maps.event.trigger(scope.map, 'resize');
// 				});
// 			}
// 			scope.$watch('mapViewVal', function() {
// 				$timeout(function() {
// 					mapCreate();
// 				}, 500);
// 			})
//         }
// 	}
//
// 	return {
// 		"restrict": 'E',
// 		"scope": {
//             "bindto": "@bindToId",
//             "mapData": "=columnData",
//             "zoomVal": "@zoomVal",
//             "mapViewVal": "=mapViewVal"
//         },
//         templateUrl: 'frmwk/visualization/templates/viz_map.html',
// 		link: chartLink
// 	}
// }]);
//
// //For Table
// visualization.directive('p3ChartTable', ['$timeout', 'vizUtilServices', function($timeout, vizUtilServices) {
//
// 	function chartLink(scope, element, attrs) {
// 		scope.getObjectLength = vizUtilServices.getLength;
//
// 		scope.reverse = true;
//
// 		var numSelected = 0;	//number of checkboxes
//
// 		scope.$watch('tableData', function () {
//             loadChartData();
//         }, true);
//
//         function reorderData() {
//         	var  arr = [];var cols = [];
//         	for(var i = 0; i<scope.tableData.length; i++) {
//         		if(scope.tableData[i].values) {
//         			for(var j = 0; j<scope.tableData[i].values.length; j++) {
//         				if(arr[j]) {
//         					arr[j][scope.tableData[i].name] = scope.tableData[i].values[j];
//         				}
//         				else {
//         					arr[j] = {}
//         					arr[j][scope.tableData[i].name] = scope.tableData[i].values[j];
//         				}
//         			}
//         		}
//         		cols.push({field: scope.tableData[i].name, title: scope.tableData[i].name})
//         	}
//         	scope.csvCols = cols
//         	scope.rawData = arr;
//         }
//
//
//         function loadChartData() {
// 			tableCreate();
// 			reorderData();
//
// 			function tableCreate() {
// 				scope.items = scope.itemsPerPage ? scope.itemsPerPage : 4;		//maximum number of rows to be displayed per page
// 				if(scope.columnTypeRow && scope.tableData) {
// 					var tableData = [Object.keys(scope.tableData[0]), scope.tableData];
// 				}
// 				else {
// 					var tableData = createTableData(scope.tableData ? scope.tableData : defaultItems.tableData);
// 				}
//
// 				var showPagination = scope.showPagination == false ? false : true;
// 				scope.enableSorting = scope.enableSorting == false ? false : true;
// 				scope.enableSearch = scope.enableSearch == false ? false : true;
//
// 				scope.headData = tableData[0];
// 				scope.bodyData = tableData[1];
// 				scope.paginate = (tableData[1].length > scope.items && showPagination);
//
// 				scope.sortKey = scope.defaultSortKey ? scope.defaultSortKey : scope.headData[0]; 		 // set the default sort key
// 				scope.reverse = scope.reverseSorting == false ? false : true;
//
// 				scope.sort = function(keyname) {
// 					scope.reverse = (scope.sortKey == keyname) ? !scope.reverse : true;
// 			        scope.sortKey = keyname;			//set the sortKey to the parameter passed
// 			    }
// 			    scope.formatColumnData = function(val) {
// 			    	var colData;
// 			    	if(isUrl(val)) {
// 			    		if(urlType(val) == 'file') {
// 				    		colData = val.replace('_viz_FILE','');
// 				    	}
// 				    	else if(urlType(val) == 'photo') {
// 				    		colData = val.replace('_viz_PHOTO','');
// 				    	}
// 			    	}
// 			    	else {
// 			    		colData = formatString(val, 'table');
// 			    	}
// 			    	return colData;
// 			    }
//
// 		        scope.checkType = function(val) {
// 		        	var type = 'notUrl';
// 		        	//check for url
// 		        	if(isUrl(val)) {
// 		        		if(urlType(val)=='file') {
// 		        			type='file';
// 		        		}
// 		        		else if(urlType(val)=='photo') {
// 		        			type='image';
// 		        		}
// 		        	}
// 		        	return type;
// 		        }
//
// 		        scope.checkAll = function() {
// 		        	scope.numRun = 0;
// 					if (scope.selectedAll) {
// 						scope.selectedAll = true;
// 					} else {
// 						scope.selectedAll = false;
// 					}
//
// 					angular.forEach(scope.bodyData, function (item) {
// 						scope.numRun++;
// 			        	for(var key in item) {
// 			        		if(item[key] && typeof item[key] == 'object') {
// 			        			item[key]['selected'] = scope.selectedAll;
// 			        			scope.checkboxChangeFn({obj: item[key]['obj'], selected: item[key]['selected']});
// 			        		}
// 			        	}
// 			        });
// 		        }
// 		        scope.checkStatus = function() {
// 		        	scope.numAttended = scope.bodyData.length;
// 		        	angular.forEach(scope.bodyData, function (item) {
// 			        	for(var key in item) {
// 			        		if(item[key] && typeof item[key] == 'object') {
//
// 			        			if(Object.keys(item[key]).indexOf('selected') > -1 && !item[key]['selected'] && scope.numAttended) {
// 									scope.numAttended = scope.numAttended-1;
// 								}
// 			        		}
// 			        	}
// 			        });
// 			        scope.selectedAll = (scope.numAttended == scope.bodyData.length) ? true : false;
// 		        }
// 		        scope.highlightKeyExistsInRow = function(row) {
// 		        	return (Object.keys(row).indexOf('highlight') ? true : false);
// 		        }
// 			}
//         }
// 	}
// 	return {
// 		"restrict": 'E',
// 		"scope": {
//             "bindto": "@bindToId",
//             "tableData": "=columnData",
//             "columnTypeRow": "=?",
//             "itemsPerPage": "@",
//             "paginateId": "=",
//             "checkable": "=?",
//             "checkboxChangeFn": "&?onCheckboxChange",
//             "editable": "=?",
//             "editboxChangeFn": "&?onEditboxChange",
//             "noInsideBorders":"=?",
//             "noOutsideBorders":"=?",
//             "showPagination": "=?",
//             "enableSorting": "=?",
//             "enableSearch": "=?",
//             "defaultSortKey": "@?",
//             "reverseSorting": "=?",
//             "editBoxStyle": "=?",
//             "editBoxDependsOnCheck": "=?",
//             "csvDownload": "=?"
//         },
//         templateUrl: 'frmwk/visualization/templates/viz_table.html',
// 		link: chartLink
// 	}
// }]);
//
// //Cards when clicked modal will open
// visualization.directive('p3ChartDisplayCard', ['$timeout', function($timeout) {
// 	function chartLink(scope, element, attrs) {
// 		scope.bindTo = createBindingId(scope.bindto, 'displayCard');
// 		scope.template='<a class="abc">abc</a>'
//
// 		$('#adminDashboardModal').on('shown.bs.modal', function (event) {
// 			var button = $(event.relatedTarget);
// 			scope.$apply(function() {
// 				var tempColumnData = button.data('detail');
// 				scope.heading = button.data('heading');
// 				scope.templateType = button.data('template');
// 				scope.tempChartData = tempColumnData['column'];
// 				scope.tempChartCategory = tempColumnData['category'];
// 				scope.tempProfileImage = tempColumnData['defalutProfileImage'];
// 			})
// 		});
// 		scope.closeModal = function() {
// 			$('.modal').modal('hide');
// 			$('.modal-backdrop').remove();
// 		}
//
// 		scope.$watch("cardsData", function() {
// 			loadChartData();
// 		}, true);
//
// 		function loadChartData() {
// 			scope.numCardsInRow = (scope.numCardsInRow).toString();
// 		}
// 	}
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			bindto: "@bindToId",
// 			cardsData: "=columnData",
// 			numCardsInRow: "@numCardsInRow",
// 			cardBorder: "="
// 		},
// 		templateUrl: "frmwk/visualization/templates/viz_displayCards.html",
// 		link: chartLink
// 	}
// }]);
//
// //Cards
// visualization.directive('p3ChartCard', ['$timeout', function($timeout) {
// 	function chartLink(scope, element, attrs) {
// 		scope.bindTo = createBindingId(scope.bindto, 'card');
//
//
// 		scope.$watch("cardData", function() {
// 			loadChartData();
// 		}, true);
//
// 		function loadChartData() {
// 			if(scope.cardData) {
// 				scope.cardTitle = scope.cardData['name'];
// 				scope.cardValue = formatString(scope.cardData['value'], 'card');
// 			}
// 			if(scope.cardBorder) {
// 				element.find('div.cardCont').css({
// 					'border':'1px solid #000',
// 					'padding-left':'15px'
// 				});
// 			}
// 			scope.deleteCard = function(e){
// 				element.remove();
// 				scope.$destroy();
// 			}
// 		}
//
// 		scope.saveChartTitle = scope.saveChartTitle;
//
// 		scope.editChartTitle = function(name){
// 			scope.model.cardTitle = name;
// 			scope.editTitle();
// 		}
// 	}
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			bindto: "@bindToId",
// 			cardData: "=columnData",
// 			saveChartTitle: "=saveChartTitle",
// 			cardBorder: "=",
// 			model: "=ngModel",
// 			editTitle: "&editTitle",
// 			titleEditable: "=titleEditable"
// 		},
// 		templateUrl: "frmwk/visualization/templates/viz_cards.html",
// 		link: chartLink
// 	}
// }]);
//
// //Modal
// visualization.directive('p3ChartImageModal', ['$timeout', function($timeout) {
// 	function chartLink(scope, element, attrs) {
// 		scope.targetId = ''+createBindingId(scope.bindto, 'modal');
// 		scope.modalBodyId = 'body'+scope.targetId;
//
// 		scope.$watch("modalData", function() {
// 			loadChartData();
// 		}, true);
//
// 		function loadChartData() {
// 			var imgSrc;
// 			var imgTemp;
// 			if(typeof(scope.modalData) == 'object') {
// 				for(var i=0; i<scope.modalData.length; i++) {
// 					imgSrc = scope.modalData[i];
// 					imgTemp = '<img class="modal-images" src="'+imgSrc+'" alt="Image Not Available" />';
// 					$('#modal-body').append(imgTemp);
// 				}
// 			}
// 			else {
// 				imgSrc = scope.modalData;
// 				imgTemp = '<img class="modal-images" src="'+imgSrc+'" alt="Image Not Available" />';
// 				$('#'+scope.modalBodyId).append(imgTemp);
// 			}
// 		}
// 	}
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			bindto: "@bindToId",
// 			modalData: "=columnData",
// 			heading: "@modalHeaderText"
// 		},
// 		templateUrl: "frmwk/visualization/templates/viz_image_modal.html",
// 		link: chartLink
// 	}
// }]);

//circular Progress
/*visualization.directive('p3ChartRoundProgress', ['vizUtilServices', function(vizUtilServices) {
	function chartLink(scope, element) {
		scope.$watch('progressData', function() {
			scope.completed = scope.progressData.completed ? scope.progressData.completed : 0;
			scope.max = scope.progressData.target ? scope.progressData.target : 0;
		}, true)
		scope.defaultOptions = {
			radius: "50", stroke: "12", color: '#45ccce', showPercentage: true
		}
		var widthVal = ((scope.radius*2 || scope.defaultOptions.radius*2) + 'px')
		scope.percentageStyleObj = {
			'width': widthVal,
			'height': widthVal,
			'line-height': widthVal
		}
		if(scope.radius && scope.radius < 40) {
			scope.percentageStyleObj.left = '50%';
			scope.percentageStyleObj.transform = 'translateX(-50%)';
		}

		scope.showPercentage = (scope.showPercentage == false) ? false : true;

		scope.mergeStyleObj = vizUtilServices.mergeObj;
	}
	return {
		restrict: 'E',
		scope: {
			title: "=?",
			progressData: "=",
			isSemi: "=?",
			radius: "@",
			showFraction: "=?",
			stroke: "@",
			color: "@",
			animationDuration: "@",
			showPercentage: "=?",
			percentageTextStyleObj: "=?"
		},
        templateUrl: "frmwk/visualization/templates/viz_roundProgressBar.html",
		link: chartLink
    }
}]);*/

//Bar Progress
// directive view: <p3-chart-bar-progress progress-data="progressBarData" title="Progress Bar" show-percent-in-bar="true" bar-color="#218f14" completed-label="completed" multi-color-bar="false" level-distribution-arr="[{'valUpto':'200', 'barColor':'red'}, {'valUpto':'600', 'barColor':'blue'}, {'valUpto':'800', 'barColor':'yellow'}]"></p3-chart-bar-progress>

// visualization.directive('p3ChartBarProgress', ['vizUtilServices', function(vizUtilServices) {
// 	function chartLink(scope, element, attrs) {
// 		var previousValUpto;
// 		var arrToWatch = ['progressData.completed', 'progressData.target'];
// 		scope.$watch('progressData', function() {
// 			if(scope.progressData) {
// 				scope.completed = Number(scope.progressData.completed) ? scope.progressData.completed : 0;
// 				scope.target = Number(scope.progressData.target) ? Number(scope.progressData.target) : 100;
// 			}
// 			if(!scope.multiColorBar && scope.levelDistributionArr && scope.levelDistributionArr.length) {
// 				for(var i=0; i<scope.levelDistributionArr.length; i++) {
// 					var valUpto = Number(scope.levelDistributionArr[i].valUpto) ? scope.levelDistributionArr[i].valUpto : scope.levelDistributionArr[i].percentUpto*scope.target;
// 					if(scope.completed <= scope.levelDistributionArr[i].valUpto) {
// 						scope.barColor = scope.levelDistributionArr[i].barColor;
// 						break;
// 					}
// 				}
// 			}
// 			previousValUpto = 0;
// 		}, true);
//
// 		scope.checkForLimit = function(arr, completed, target) {
// 			if(!arr) {
// 				return;
// 			}
// 			var newArr = arr;
// 			if(newArr.length && Number(newArr[newArr.length-1].valUpto) < Number(completed)) {	//if completed value is greater than all the limits
// 				newArr.push({valUpto: target});
// 			}
// 			else {
// 				if(newArr.length && Number(newArr[0].valUpto) >= completed) {
// 					if(newArr[1]) {
// 						newArr = newArr.splice(1, newArr.length-1);
// 					}
// 				}
// 				else {
// 					for(var i=1; i<newArr.length; i++) {
// 						if(Number(newArr[i].valUpto) >= Number(completed) && Number(completed) > Number(newArr[i-1].valUpto)) {
// 							if(newArr[i+1]) {
// 								newArr = newArr.splice(i+1, newArr.length-1);
// 							}
// 							break;
// 						}
// 					}
// 				}
// 			}
// 			return newArr;
// 		}
// 		scope.calculatePercentWidth = function(val, prevVal, completed, target) {
// 			if(!prevVal)
// 				prevVal = 0;
// 			if(val && target && !isNaN(val) && !isNaN(target)) {
// 				if(completed < Number(val)) {
// 					val = completed;
// 				}
// 				var percentVal = (100*Number(val)/Number(target)) <=100 ? (100*(Number(val)-prevVal)/Number(target)) : 100;
// 				return (percentVal + '%');
// 			}
// 			else {
// 				return 0;
// 			}
// 		}
// 		scope.fixDecimalVal = function(val, digit) {
// 			if(!val)
// 				return;
// 			return val.toFixed(digit);
// 		}
// 	}
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			showValueInBar: "=?",
// 			showFractionInBar: "=?",
// 			completedLabel: "@",
// 			title: "@",
// 			progressData: "=",
// 			barColor: "@",
// 			multiColorBar: "=?",
// 			levelDistributionArr: "=?",	//to display different bar colors for different value ranges (should be in ascending order of valUpto) [{'valUpto': '20', 'barColor': 'green'}]
// 			showValueInEachLevel: "=?"
// 		},
//         templateUrl: "frmwk/visualization/templates/viz_bar_progress.html",
// 		link: chartLink
//     }
// }]);

// Directive to display thumbnails
// visualization.directive('p3ImageThumbnail',  ['$timeout', 'instanceNumFactory', function($timeout, instanceNumFactory) {
// 	function link(scope, element, attrs) {
// 		scope.uniqueId = instanceNumFactory.createBindingId(null, 'thumbnailView');		//unique id to toggle corresponding modal
// 		scope.viewInModal = (scope.viewInModalNum && (!isNaN(scope.viewInModalNum) || scope.viewInModalNum == 'false')) ? Number(scope.viewInModalNum) : 2;
//
// 		scope.startSlideNum = 0;	//default index of starting image in carousel
//
// 		scope.$watch('imageData.length', function() {
// 			// If removing is enabled, all the images should be displayed
// 			scope.displayImagesNum = (scope.numImagesDisplay && !isNaN(scope.numImagesDisplay) && !scope.enableThumbnailRemoval) ? Number(scope.numImagesDisplay) : scope.imageData.length;
// 		});
//
// 		scope.setStartImageInCarousel = function(imageIndex) {	//To start the carousel from image which was clicked
// 			scope.startSlideNum = imageIndex;
// 		}
//
// 		scope.isArray = angular.isArray;
// 		/*scope.convertToImageFormat = function(data, index) {
// 			var returnVal = false;
// 			if(data && !scope.isArray(data) && typeof data == 'object') {
// 				//if data is in the form of an object having a property of src
// 				if(Object.keys(data).indexOf('src') > -1) {
// 					returnVal = data;
// 				}
// 				else {
// 					scope.imageData.splice(index, 1);
// 				}
// 			}
// 			else if(data && typeof data == 'string' && isNaN(Number(data))) {
// 				//if scope.imageData is an array or urls
// 				returnVal = {src:data}
// 			}
// 			else {
// 				//Not a valid data
// 				scope.imageData.splice(index, 1);
// 			}
//
// 			return returnVal;
// 		}*/
// 		/*scope.isString = function(data) {
// 			if(typeof data == 'string') {
// 				return true;
// 			}
// 			return false;
// 		}
// 		scope.isArrOfObjects = function(arr) {
// 			var flag = false;
// 			for(var i in arr) {
// 				if(typeof arr[i] == 'object') {
// 					flag = true;
// 				}
// 				break;
// 			}
// 			return flag;
// 		}*/
// 	}
//
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			numImagesDisplay: "@?",		//number of thumbnails to be displayed
// 			viewInModalNum: "@?",		//(false or number) false, 0=> no view in modal; 1=> single image view; >1=> carousel view in modal
// 			imageData: "=",				//array of object or a single object
// 			galleryTitle: "=?",
// 			enableThumbnailRemoval: "=?",
// 			onThumbnailRemoval: "&onThumbnailRemovalFn",
// 			selectToDelete: "=?",
// 			onThumbnailSelection: "&onThumbnailSelectionFn",
// 			selectText: "@selectText",
// 			imageStyleObj: "=?",
// 			modalImageStyleObj: "=?",
// 			utils: "=utils"
// 		},
// 		templateUrl: 'frmwk/visualization/templates/viz_image_thumbnail.html',
// 		link: link
// 	}
// }]);

//Rating Stars
// visualization.directive('p3RatingStars', ['$timeout', function($timeout) {
// 	function link(scope, element, attributes) {
// 		scope.$watch('ratingValue', function(oldValue, newValue) {
// 			updateStars();
//         });
//         if (scope.max == undefined || isNaN(scope.max)) {
//         	scope.max = 5;
//         }
//         function updateStars() {
// 			scope.stars = [];
// 			for (var i = 0; i < scope.max; i++) {
// 				scope.stars.push({
// 					filled: i < Math.round(scope.ratingValue)
// 				});
// 			}
//         };
//         scope.toggle = function(index) {
//         	if (scope.readOnly == undefined || scope.readOnly === false) {
//            		scope.ratingValue = index + 1;
//            		ratingDecription(scope.ratingValue);
//           	}
//        	};
//        	scope.starSelectedFn = function(index) {
//        		scope.currentSelectedIndex = index;
//        	}
//        	scope.mouseoutFn = function() {
//        		scope.hoverOnStar = false;
//        		scope.toggle(scope.currentSelectedIndex);
//        	}
//        	function ratingDecription(ratingVal) {
//        		scope.hoverOnStar = true;
//        		switch (ratingVal) {
//        			case 1:
//        				scope.starDescription = scope.starSelectDescription&& scope.starSelectDescription[0] ? scope.starSelectDescription[0] : 'Poor';
//        				break;
//        			case 2:
//        				scope.starDescription = scope.starSelectDescription && scope.starSelectDescription[1] ? scope.starSelectDescription[1] : 'Average';
//        				break;
//        			case 3:
//        				scope.starDescription = scope.starSelectDescription && scope.starSelectDescription[2] ? scope.starSelectDescription[2] : 'Good';
//        				break;
//        			case 4:
//        				scope.starDescription = scope.starSelectDescription && scope.starSelectDescription[3] ? scope.starSelectDescription[3] : 'Very Good';
//        				break;
//        			case 5:
//        				scope.starDescription = scope.starSelectDescription && scope.starSelectDescription[4] ? scope.starSelectDescription[4] : 'Excellent';
//        				break;
//        		}
//        		/*$timeout(function() {
//        			scope.hoverOnStar = false;
//        		},1500)*/
//        	}
//     }
//
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			ratingValue: '=?ratingValue',
// 	        max: '=?',
// 	        onRatingSelect: '&?onRatingSelectFn',
// 	        readOnly: '=?',
// 	        starSelectDescription: "=?",	//array: ['poor', 'average', 'good', 'very good', 'excellent']
// 	        starStyleObj: "=?"
// 		},
// 		templateUrl: 'frmwk/visualization/templates/viz_star_rating.html',
// 		link: link
// 	}
// }]);
//
// visualization.directive('p3ChartCircularProgress', ['$timeout', 'instanceNumFactory', 'vizUtilServices', function($timeout, instanceNumFactory, vizUtilServices) {
// 	function link(scope, element, attrs) {
// 		scope.uniqueId = instanceNumFactory.createBindingId(null, 'circularProgress');
// 		var defaultOptions = {
// 			radius: 40,
// 			border: 20,
// 			padding: 0,
// 			startPercent: 0,
// 			endPercent: 0,
// 			noProgressColor: '#ccc',
// 			progressColor: '#47e495',
// 			animationSpeed: 200,
// 			maxAnimationSpeed: 1000,
// 			textColor: '#fff',
// 			textSize: '15px'
// 		}
//
// 		var textColor = scope.textColor ? scope.textColor : defaultOptions.textColor;
// 		var textSize = scope.textSize ? scope.textSize : defaultOptions.textSize;
// 		var radius = (scope.circleRadius && !isNaN(scope.circleRadius)) ? Number(scope.circleRadius) : defaultOptions.radius;
// 		var border = (scope.progressRadius && !isNaN(scope.progressRadius)) ? Number(scope.progressRadius) : defaultOptions.border;
// 		var padding = scope.padding ? scope.padding : defaultOptions.padding;
//
// 		var toPi = scope.isSemi ? Math.PI : Math.PI*2;
// 		var formatPercent = d3.format('.0%');
// 		var boxSize = (radius + padding) * 2;
//
// 		var startPercent, endPercent;
//
// 		scope.$watchGroup(['progressData.completed', 'progressData.target', 'isSemi'], function(newVal, oldVal) {
// 			if(oldVal[0]) {	//to start the progress bar from where it ended earlier
// 				scope.startPercent = endPercent;
// 			}
// 			createProgressView();
// 		}, true)
//
// 		function createProgressView() {
//
// 			startPercent = (scope.startPercent && !isNaN(scope.startPercent)) ? Number(scope.startPercent) : defaultOptions.startPercent;
// 			endPercent = defaultOptions.endPercent;
// 			if(scope.progressData) {
// 				if(!isNaN(scope.progressData.completed) && !isNaN(scope.progressData.target) && scope.progressData.target) {
// 					endPercent = 100*Number(scope.progressData.completed)/Number(scope.progressData.target)
// 				}
// 			}
//
// 			var noProgressColor = scope.noProgressColor ? scope.noProgressColor : defaultOptions.noProgressColor;
// 			var progressColor = scope.progressColor ? scope.progressColor : defaultOptions.progressColor;
//
// 			var count = Math.abs(endPercent - startPercent);
// 			var step = endPercent < startPercent ? -0.01 : 0.01;
// 			var animationSpeed = (scope.animationSpeed && !isNaN(scope.animationSpeed) && scope.animationSpeed<defaultOptions.maxAnimationSpeed) ? Number(scope.animationSpeed) : defaultOptions.animationSpeed;
//
// 			animationSpeed = (count/100)*animationSpeed;	//relative animation speed in terms of value to traverse
//
// 			var arc = d3.svg.arc()
// 			    .startAngle(0)
// 			    .innerRadius(radius)
// 			    .outerRadius(radius - border);
//
// 			var parent = d3.select('#circular-progress-content'+scope.uniqueId);
// 			parent.selectAll('svg').remove();	//removing earlier svg in order to redraw on same element
//
// 			var svg = parent.append('svg')
// 				.attr('class', 'svgProgress')
// 			    .attr('width', boxSize)
// 			    .attr('height', boxSize);
//
// 			var defs = svg.append('defs');
//
// 			if(scope.showHighlightInProgress) {
// 				var filter = defs.append('filter')
// 				    .attr('id', 'blur');
//
// 				filter.append('feGaussianBlur')
// 				    .attr('in', 'SourceGraphic')
// 				    .attr('stdDeviation', '7');
// 			}
//
// 			var transformAttrVal = scope.isSemi ? 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')'+ ' rotate('+'-90'+')' : 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')';
// 			var g = svg.append('g')
// 			    .attr('transform', transformAttrVal);
//
// 			var progressMeter = g.append('g')
// 			    .attr('class', 'progress-meter');
//
// 			progressMeter.append('path')
// 			    .attr('class', 'background')
// 			    .attr('fill', noProgressColor)
// 			    .attr('fill-opacity', 1)
// 			    .attr('d', arc.endAngle(toPi));
//
// 			if(scope.showHighlightInProgress) {
// 				var highlight = progressMeter.append('path')
// 				    .attr('class', 'highlight')
// 				    .attr('fill', progressColor)
// 				    .attr('fill-opacity', 1)
// 				    .attr('stroke', progressColor)
// 				    .attr('stroke-width', 5)
// 				    .attr('stroke-opacity', 1)
// 				    .attr('filter', 'url(#blur)');
// 			}
//
// 			var progressCurve = progressMeter.append('path')
// 			    .attr('class', 'progressCurve')
// 			    .attr('fill', progressColor)
// 			    .attr('fill-opacity', 1);
//
// 			if(!scope.notShowText) {
// 				var numberText = progressMeter.append('text')
// 					.attr('class', 'progressText')
// 				    .attr('fill', textColor)
// 				    .attr('text-anchor', 'middle')
// 				    .attr('font-size', textSize)
// 				    .attr('dy', '.35em');
//
// 				if(scope.isSemi) {
// 					numberText.attr('transform', 'rotate('+'90'+')');
// 				}
// 			}
//
// 			function updateProgress(progress) {
// 			    progressCurve.attr('d', arc.endAngle(toPi * progress));
// 			    if(scope.showHighlightInProgress) {
// 			    	highlight.attr('d', arc.endAngle(toPi * progress));
// 			    }
// 			    if(!scope.notShowText) {
// 			    	if(scope.showFractionAsText) {
// 			    		var text = (scope.progressData && !isNaN(scope.progressData.target)) ? ((progress*scope.progressData.target).toFixed(0) + '/' + scope.progressData.target) : ((100*progress*endPercent).toFixed(0) + '/' + endPercent)
// 			    		numberText.text(text);
// 			    	}
// 			    	else {
// 			    		numberText.text(formatPercent(progress));
// 			    	}
// 			    }
// 			}
//
// 			var progress = startPercent/100;
//
// 			function progressLoop() {
// 			    updateProgress(progress);
//
// 			    if (count > 0) {
// 			    	if(count-(animationSpeed/100)<0) {	// if this becomes less than 0, then progress might become more than 100% without this condition
// 			    		count=0;
// 			    		progress=endPercent/100;
// 			    	}
// 			    	else {
// 				        count = count-(animationSpeed/100);
// 				        progress += step*(animationSpeed/100);
// 				    }
// 				    setTimeout(progressLoop, 10);
// 			    }
// 			};
// 			progressLoop();
// 		}
// 	}
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			showFractionAsText: "=?",
// 			notShowText: "=?",
// 			title: "@",
// 			progressData: "=",
// 			progressColor: "@",
// 			noProgressColor: "@",
// 			multiColorBar: "=?",
// 			circleRadius: "@",
// 			progressRadius: "@",
// 			textColor: "@",
// 			textSize: "@",
// 			showHighlightInProgress: "=?",
// 			isSemi: "=?",
// 			animationSpeed: "@",
// 			startPercent: "@"
// 		},
// 		templateUrl: 'frmwk/visualization/templates/viz_progress_circular.html',
// 		link: link
// 	}
// }]);
// visualization.directive('p3ProgressBarFreeze',function(){
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			progressData: "=",
// 			barColor: "@",
// 			progressNote:'='
// 		},
//         templateUrl: "frmwk/visualization/templates/viz_progress_freezed.html",
//         link:function($scope,element,attrs){
//
//         }
//     }
//
// })
