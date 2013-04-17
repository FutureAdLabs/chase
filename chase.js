var os = require('os');
var consoleLogger = require('./loggers/console');
var redisLogger = require('./loggers/redis');

var Chase = function(){
	var _logger = consoleLogger;
	var _levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'off'];
	var _logLevel = 2;
	var _showHost = false;

	var _initialise = function(cfg) {
		if(!cfg) return;

		if(cfg.LogLevel) _logLevel = _levels.indexOf(cfg.LogLevel);
		if(cfg.ShowHost) _showHost = cfg.ShowHost;
		if(cfg.Method) {
			if(cfg.Method === 'redis') {
				redisLogger.Initialise(cfg.Redis);
				_logger = redisLogger;
			}
		}
	};

	var _log = function(message, levelstring) {
		var level = _logLevel;
		if(levelstring) {
			if(_contains(_levels, levelstring)) {
				level = _levels.indexOf(levelstring);
			}
		}

		if(level >= _logLevel) {
			var info = '';
			if(_showHost) info = info + os.hostname() + '\t';
			var timestamp = new Date().toUTCString();
			info = info + timestamp + '\t';

			message = info + ' - ' + message;

			_logger.Log(message);
		}
	};

	var _contains = function(array, value) {
		if(!array || !value) return false;

		for(var i = 0, length = array.length; i < length; i++) {
			if(array[i] === value) return true;
		}

		return false;
	}

	return {
		Initialise: _initialise,
		Log: _log
	}
}();

module.exports = Chase;