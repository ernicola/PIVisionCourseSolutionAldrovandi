(function (PV) {
	"use strict";
	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);
	var definition = { 
		typeName: "math-aldrovandi",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		iconUrl: '/Images/math-aldrovandi.png',
		getDefaultConfig: function(){ 
			return { 
				DataShape: 'Timeseries',
				Height: 400,
				Width: 200,
				Backgroundcolor: '#333333',
				Fontcolor: '#FFFFFF',
				Borderradius: 10,
				Displaydigits: 1,
				Values: true,
				Min: true,
				Max: true,
				Sum: true,
				Count: true,
				Sin: true,
				Cos: true,
				Sqrt: true,
				Pow: true,
				PowerFactor: 2,
				Custom: true,
				Customstring: 'LastValue*2'
			} 
		},
		configOptions: function(){
			return [
				{
					title:"Format Symbol",
					mode: "format"
				}
			];
		}
	}
	symbolVis.prototype.init = function(scope, elem) { 
		this.onDataUpdate = dataUpdate;
		function dataUpdate(data){
			if(!data) return;
			var firstAttribute = data.Data[0];
			scope.dataItems = firstAttribute.Values;
			scope.values = [];
			dataHandle();
			if(firstAttribute.Label)
			{
				scope.Units = firstAttribute.Units;
				scope.Label = firstAttribute.Label;
			}
			execMathFunctions();
		};
		function dataHandle(){
			for(var i=0;i<scope.dataItems.length;i++){
                //scope.dataItems[i].Value = parseFloat(scope.dataItems[i].Value.replace(",","."));
				scope.dataItems[i].Value = parseFloat(scope.dataItems[i].Value);
				scope.values.push(scope.dataItems[i].Value);
            }
		}
		function execMathFunctions(){
			scope.LastValue = scope.values.pop();
			scope.MinValue =Math.min.apply(null, scope.values);
			scope.MaxValue =Math.max.apply(null, scope.values);
			scope.SumValue = scope.values.reduce((a, b) => a + b, 0)
			scope.CountValue = scope.dataItems.length;
			scope.SqrtValue = Math.sqrt(scope.LastValue);
			scope.SinValue = Math.sin(scope.LastValue);
			scope.CosValue = Math.cos(scope.LastValue);
			var customFunString = "return ".concat(scope.config.Customstring,";");
			var customFun = Function("LastValue", customFunString);
			scope.CustomValue = customFun(scope.LastValue);
			console.log(scope.CustomValue);
		}
	};
	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
