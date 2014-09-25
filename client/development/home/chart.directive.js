angular.module('app')
	.directive('chart', [
		function() {
			return {
				restrict: 'EA',
				scope: {
					config: '=',
					data: '='
				},
				templateUrl: 'home/chart.tpl.html',
				link: function($scope) {

					$scope.scale = function(datum) {
						if (!$scope.options) return datum;
						return $scope.options.height * datum / $scope.options.maxValue;
					};

					if (!$scope.data || !$scope.data.length) {
						$scope.$watch('data', function(newValue, oldValue) {
							if (newValue !== undefined &&
								newValue.length &&
								newValue !== oldValue) {
								initializeOptions();
							}
						});
					} else {
						initializeOptions();
					}

					function initializeOptions() {
						$scope.options = angular.copy($scope.config) || {};
						$scope.options = angular.extend({
							height: 20,
							width: 80,
							maxValue: 1,
							barWidth: ($scope.options.width || 80) / $scope.data.length,
							fill: '#428bca'
						}, $scope.options);
					}
				}
			}
		}]);