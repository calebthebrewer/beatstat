angular.module('app')
	.controller('home', ['$scope', function($scope) {
		window.song = document.getElementById('audio');

		$scope.play = function() {
			song.play();
		};

		$scope.pause = function() {
			song.pause();
		};
	}]);