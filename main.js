var stockModule = angular.module("stockModule", []);

stockModule.controller('mainController', function($scope, stockService) {
	$scope.stocks = stockService.getStocks().then(function(stocks) {
		$scope.stocks = stocks;
	});	
	setInterval(function() {
		$scope.stocks = stockService.getStocks().then(function(stocks) {
			$scope.stocks = stocks;
		});	
	}, 20000);
	
	$scope.money = 1000;
	$scope.playerStockValue = 0;
	$scope.stockCount = 0;
	$scope.buyStockDisabled = true;
	$scope.buyStock = function(cStock) {
	
		if($scope.money < cStock.stockValue) {
			alert("Not enough money!");
			return;
		}
	
		$scope.money -= cStock.stockValue;

		// I have read that parseFloat isn't ideal for currency calculations, but since this project's 
		// intention is to learn angularjs then I presumed this would be adequate. 
		// http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
		$scope.playerStockValue += parseFloat(cStock.stockValue);
		
		$scope.stockCount++;
	};
	$scope.setColor = function (num) {
		if(typeof num == 'function')
			return false;
        else if(num.perChange.charAt(0) == "+") {
            return {
                color: "green"
            }
        }
        else {
            return {
                color: "red"
            }
        }
    }
});

stockModule.factory('stockService', function($http) {
    return {
        getStocks: function() {
            return $http.get('data.php').then(function(result) {
				var stocks = result.data;
				var newStocks = [];
				for(stock in result.data) {
					var currentStock = {
						tickerSymbol : stocks[stock][0],
						companyName  : stocks[stock][1],
						stockValue 	 : stocks[stock][2],
						priceChange  : stocks[stock][3],
						perChange    : stocks[stock][4]
					} 
					newStocks.push(currentStock);
				}
				return newStocks;
			});
        }
    }
});

stockModule.filter("moneyFormat", function() {
	return function(input) {
		if(typeof input == "string")
			input = parseFloat(input);
		return input.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");	
	};
});

stockModule.directive('stock', function() {
    return {
		restrict: 'E',
		templateUrl: 'templates/stock.html'
    };
});

stockModule.directive('money', function() {
    return {
		restrict: 'E',
		templateUrl: 'templates/portfolio.html'
    };
});