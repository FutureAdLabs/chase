var redis = require('redis');

var Redis = function(){
	var _client;
	var _port = 6379;
	var _host = '127.0.0.1';
	var _liveForDays = 1;
	var _key = '';

	var _initialise = function(cfg) {
		if(!cfg) return;

		if(cfg.LiveForDays) _liveForDays = cfg.LiveForDays;
		if(cfg.Key) _key = cfg.Key;
		_port = cfg.Port;
		_host = cfg.Host;
	};

	var _log = function(message) {
		if(!_key || _key.length <= 0) return;

		if(!_client) _createClient();

		if(!_client) return;

		_client.sadd(_key, message)
		_setExpiryOfKey(_key);
	};

	var _setExpiryOfKey = function(key) {
		if(!_client) return;

		_client.ttl(key, function(err, data) {
			if(err || data < 0) {
				var date = new Date();
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();
				var hours = date.getHours();

				var expiry = (60 * 60 * 24 * _liveForDays) - (seconds + (minutes * 60) + (hours * 60 * 60));

				_client.expire(key, expiry);
			}
		});
	};

	var _createClient = function() {
		if(!_port || !_host || _host.length <= 0) return;

		_client = redis.createClient(_port, _host);
		_client.on('error', _handleError);
		_client.on('end', _handleEnd);
	};

	var _handleError = function(err) {
		_client.end();
		_client = null;
	};

	var _handleEnd = function() {
		_client = null;
	};

	return {
		Initialise: _initialise,
		Log: _log
	};
}();

module.exports = Redis;