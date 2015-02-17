'use strict';

// Copy All Files At The Root Level (app)
module.exports = function (gulp, plugins, config) { return function () {
	var merge = require('merge-stream');
	var app = gulp.src([
		'app/*',
		'!app/test',
		'!app/*.jade'
	], {
		dot: true
	}).pipe(gulp.dest('dist'));

	var bower = gulp.src([
		'bower_components/**/*'
	]).pipe(gulp.dest('dist/bower_components'));

	var elements = gulp.src([
			'.tmp/elements/**/*.html',
			'!.tmp/elements/elements.html'
		])
		.pipe(gulp.dest('dist/elements'));

	var vulcanized = gulp.src(['.tmp/elements/elements.html'])
		.pipe(plugins.rename('elements.vulcanized.html'))
		.pipe(gulp.dest('dist/elements'));

	return merge(app, bower, elements, vulcanized)
		.pipe(plugins.size({title: 'copy'}));
};};
