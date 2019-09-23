var pluginError = require('plugin-error');
var through = require('through2');
var build = require('../build');
var highlightService = require('../services/blockHighlightService');

function gulp(blocksDir, hbsHelpers, layoutDir) {

	var _ref = {
		name: '_ref',
		schema: {
			"type": "string"
		}
	}

	var _modifiers = {
		name: '_modifiers',
		schema: {
			"type": "string"
		}
	}

	build.register(blocksDir, hbsHelpers);
	var blockSchemaProperties = [_ref, _modifiers, highlightService.property];
	var externals = build.setup(blocksDir, layoutDir, blockSchemaProperties);

	return through.obj(function (file, enc, cb) {

		var errors = [];

		if (file.isNull()) {
			this.push(file);
			return cb();
		}
		
		if (file.isStream()) {
			this.emit('error', new pluginError('yuzu render', 'Streaming not supported'));
			return cb();
		}

		var renderedTemplate = build.render(file.contents.toString(), file.path, externals, errors);

		if(errors.length > 0) {
			errors.forEach((error) => {
				this.emit('error', new pluginError(error.source, error.inner));
			});
			return cb();	
		}

		file.contents = new Buffer(renderedTemplate);

		this.push(file);
		cb();
	});
}

module.exports = gulp;