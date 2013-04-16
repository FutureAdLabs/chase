var consoleLogger = require('./loggers/console');

var Chase = function(){
	var _logger = consoleLogger;
	var _levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'off'];
	var _logLevel = 2;

	var _initialise = function(cfg) {
		if(!cfg) return;

		if(cfg.LogLevel) _logLevel = cfg.LogLevel;
	};

	var _log = function(message, levelstring) {
		var level = _logLevel;
		if(levelstring) {
			if(_contains(_levels, levelstring)) {
				level = _levels.indexOf(levelstring);
			}
		}

		if(level >= _logLevel) {
			var timestamp = new Date().toUTCString();
			message = timestamp + ' - ' + message;

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