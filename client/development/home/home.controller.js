angular.module('app')
	.controller('home', [
		'$scope',
		'$http',
		'$interval',
		function($scope, $http, $interval) {
			//audio stuff
			var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
				soundSource = audioCtx.createBufferSource(),
				analyser = audioCtx.createAnalyser(),
				stream,
				soundSource;

			analyser.minDecibels = -90;
			analyser.maxDecibels = -15;
			analyser.smoothingTimeConstant = .65;
			analyser.fftSize = 128;
			var bufferLength = analyser.fftSize;
			window.dataArray = new Uint8Array(bufferLength);

			soundSource.connect(audioCtx.destination);
			soundSource.connect(analyser);
			window.analyser = analyser;

			//scope stuff
			$scope.id = '167265594';
			$scope.chart = {
				height: window.innerHeight - 100,
				width: window.innerWidth,
				barWidth: window.innerWidth / analyser.fftSize
			};
			$scope.scale = function(number) {
				return $scope.chart.height * number / 200;
			} ;
			$scope.load = function() {
				var streamUrl = 'https://api.soundcloud.com/tracks/' + $scope.id + '/stream?client_id=7eadfcb24859c38770417ef858756544';
				//var streamUrl = 'music/beautiful-girls.mp3';

				$http({
					url: streamUrl,
					method: 'GET',
					responseType: 'arraybuffer'
				})
					.success(function(audioData) {
						audioCtx.decodeAudioData(audioData, function(buffer) {
							soundSource.buffer = buffer;
							soundSource.start(0);
							$interval(beatStat, 50);
						}, function(e) {
							console.log("Error with decoding audio data" + e.err);
						});
					})
					.error(function(error) {
						console.log(error);
					});
			};

			function beatStat() {
				analyser.getByteTimeDomainData(dataArray);
				$scope.data = dataArray;
			}

			//kick it off
			$scope.load();

		}]);

