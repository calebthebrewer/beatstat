angular.module('app')
	.controller('home', [
		'$scope',
		'$http',
		'$interval',
		function($scope, $http, $interval) {
			var //streamUrl = 'https://api.soundcloud.com/tracks/32842984/stream?client_id=7eadfcb24859c38770417ef858756544',
				streamUrl = 'music/beautiful-girls.mp3',
				audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
				soundSource = audioCtx.createBufferSource(),
				analyser = audioCtx.createAnalyser(),
				stream,
				soundSource;

			analyser.minDecibels = -90;
			analyser.maxDecibels = -10;
			analyser.smoothingTimeConstant = 0.85;
			analyser.fftSize = 32;
			var bufferLength = analyser.fftSize;
			window.dataArray = new Uint8Array(bufferLength);

			soundSource.connect(audioCtx.destination);
			soundSource.connect(analyser);
			window.analyser = analyser;

			$http({
				url: streamUrl,
				method: 'GET',
				responseType: 'arraybuffer'
			})
				.success(function(audioData) {
					audioCtx.decodeAudioData(audioData, function(buffer) {
						soundSource.buffer = buffer;
						soundSource.start(0);
						$interval(beatStat,50);
					}, function(e) {
						console.log("Error with decoding audio data" + e.err);
					});
				})
				.error(function(error) {
					console.log(error);
				});

			var chart = function() {
				var chart = {},
					svg= d3.select('.chart');
				svg.attr('height', 400);
				svg.attr('width', 800);
				var width = 800,
					height = 400;

				var dataWidth = 32,
					dataHeight = 128;

				var barWidth = width / dataWidth;

				var x = d3.scale.linear()
					.domain([0, dataWidth])
					.range([0, width]);

				var y = d3.scale.linear()
					.domain([0, dataHeight])
					.range([0, height]);

				chart.draw = function(data) {
					var bars = svg.selectAll('rect')
						.remove()
						.data(data)
						.enter().append('rect')
						.attr('x', function(d, i) {return i * barWidth;})
						.attr('y', 0)
						.attr('width', barWidth)
						.attr('height', function(d) {return d;});
				}

				return chart;
			}();

			function beatStat() {
				analyser.getByteTimeDomainData(dataArray);
				chart.draw(dataArray);
				$scope.data = dataArray;
			}

		}]);

