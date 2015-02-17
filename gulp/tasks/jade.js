'use strict';

// Jade
module.exports = function (gulp, plugins, config) { return function () {
	var marked = require('marked');
	// Synchronous highlighting with highlight.js
	marked.setOptions({
		highlight: function (code) {
			return require('highlight.js').highlightAuto(code).value;
		}
	});

	return gulp.src('app/*.jade')
		.pipe(plugins.jade({pretty: true}))
		.pipe(gulp.dest('.tmp'));
};};
