angular.module('app')
	.controller('home', [
		'$scope',
		'$http',
		'$interval',
		function($scope, $http, $interval) {

			//audio stuff
			var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
				soundSource = audioCtx.createBufferSource(),
				analyserL = audioCtx.createAnalyser(),
				analyserR = audioCtx.createAnalyser(),
				splitter = audioCtx.createChannelSplitter();

			soundSource.connect(audioCtx.destination);
			soundSource.connect(splitter);
			splitter.connect(analyserL, 0);
			splitter.connect(analyserR, 1);

			var analyserConfig = {
				minDecibels: -100,
				maxDecibals: 0,
				smoothingTimeConstant: .75,
				fftSize: 256
			};

			angular.extend(analyserL, analyserConfig);
			angular.extend(analyserR, analyserConfig);

			$scope.timeDomainData = new Uint8Array(analyserL.fftSize);

			$scope.frequencyDataL = new Uint8Array(analyserR.frequencyBinCount);
			$scope.frequencyDataR = new Uint8Array(analyserR.frequencyBinCount);

			setConfigs();
			start();

			function setConfigs() {
				$scope.timeDomainConfig = {
					width: window.innerWidth,
					height: window.innerHeight - 100,
					maxValue: 256
				};
				$scope.frequencyConfig = {
					width: window.innerWidth / 2,
					height: window.innerHeight - 100,
					maxValue: 256,
					fill: 'red'
				};
			}

			function start() {
				var streamUrl = 'https://api.soundcloud.com/tracks/167265594/stream?client_id=7eadfcb24859c38770417ef858756544';
				//var streamUrl = 'music/beautiful-girls.mp3';
				//var streamUrl = 'music/stolen-dance.mp3';

				$http({
					url: streamUrl,
					method: 'GET',
					responseType: 'arraybuffer'
				})
					.success(function(audioData) {
						$scope.loaded = true;
						$scope.decoding = true;
						audioCtx.decodeAudioData(audioData, function(buffer) {
							$scope.decoding = false;
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
				analyserL.getByteFrequencyData($scope.frequencyDataL);
				analyserL.getByteFrequencyData($scope.frequencyDataR);
				analyserL.getByteTimeDomainData($scope.timeDomainData);
				setConfigs();
			}

		}]);

