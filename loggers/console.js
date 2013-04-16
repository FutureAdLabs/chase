var Console = function(){
	var _log = function(message) {
		console.log(message);
	};

	return {
		Log: _log
	};
}();

module.exports = Console;