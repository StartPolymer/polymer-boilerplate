/* global -$ */
'use strict';

// GitHub Pages
var ghPagesOrigin = 'origin';
var ghPagesBranch = 'gh-pages';

// PageSpeed Insights
var pageSpeedSite = 'https://startpolymer.org'; // change it
var pageSpeedStrategy = 'mobile'; // desktop
var pageSpeedKey = ''; // nokey is true

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pageSpeed = require('psi');
var merge = require('merge-stream');
var mainBowerFiles = require('main-bower-files');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src([
      'app/scripts/**/*.js',
      'app/elements/**/*.js',
      'app/elements/**/*.html'
    ])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint.extract()) // Extract JS from .html files
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
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

  var elements = gulp.src(['app/elements/**/*.html'])
    .pipe(gulp.dest('dist/elements'));

  var vulcanized = gulp.src(['app/elements/elements.html'])
    .pipe($.rename('elements.vulcanized.html'))
    .pipe(gulp.dest('dist/elements'));

  return merge(app, bower, elements, vulcanized).pipe($.size({title: 'copy'}));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(mainBowerFiles().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  return gulp.src('app/styles/*.scss')
    .pipe($.changed('styles', {extension: '.scss'}))
    .pipe($.rubySass({
        style: 'expanded',
        precision: 10,
        loadPath: ['.']
      })
      .on('error', console.error.bind(console))
    )
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.cssmin()))
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('elements', function () {
  return gulp.src('app/elements/**/*.scss')
    .pipe($.changed('elements', {extension: '.scss'}))
    .pipe($.rubySass({
        style: 'expanded',
        precision: 10,
        loadPath: ['.']
      })
      .on('error', console.error.bind(console))
    )
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/elements'))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.cssmin()))
    .pipe(gulp.dest('dist/elements'))
    .pipe($.size({title: 'elements'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', ['views'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', 'dist']});

  return gulp.src(['app/**/*.html', '.tmp/*.html', '!app/{elements,test}/**/*.html'])
    // Replace path for vulcanized assets
    .pipe($.if('*.html', $.replace('elements/elements.html', 'elements/elements.vulcanized.html')))
    .pipe(assets)
    // Concatenate And Minify JavaScript
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Concatenate And Minify Styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.cssmin()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    // Output Files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Jade
gulp.task('views', function () {
  return gulp.src('app/*.jade')
    .pipe($.jade({pretty: true}))
    .pipe(gulp.dest('.tmp'));
});

// Vulcanize imports
gulp.task('vulcanize', function () {
  return gulp.src('dist/elements/elements.vulcanized.html')
    .pipe($.vulcanize({
      dest: 'dist/elements',
      strip: true
    }))
    .pipe(gulp.dest('dist/elements'))
    .pipe($.size({title: 'vulcanize'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Watch Files For Changes & Reload
gulp.task('serve', ['views', 'styles', 'elements', 'fonts'], function () {
  browserSync({
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/**/*.html',
    '.tmp/*.html',
    '.tmp/styles/**/*.css',
    '.tmp/elements/**/*.css',
    'app/images/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.{jade,md}', ['views', reload]);
  gulp.watch('app/styles/**/*.scss', ['styles', reload]);
  gulp.watch('app/elements/**/*.scss', ['elements', reload]);
  gulp.watch('app/scripts/**/*.js', ['jshint', reload]);
  gulp.watch('app/elements/**/*.js', ['jshint', reload]);
  gulp.watch('bower.json', ['wiredep', 'fonts', reload]);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    notify: false,
    port: 9000,
    server: 'dist'
  });
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/layouts/*.jade')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

// Deploy to GitHub Pages
gulp.task('deploy', function () {
  return gulp.src('dist/**/*')
    .pipe($.ghPages({
      origin: ghPagesOrigin,
      branch: ghPagesBranch
    }));
});

// Run PageSpeed Insights
// Please feel free to use the `nokey` option to try out PageSpeed
// Insights as part of your build process. For more frequent use,
// we recommend registering for your own API key. For more info:
// https://developers.google.com/speed/docs/insights/v1/getting_started
gulp.task('pagespeed', function () {
  return pageSpeed(pageSpeedSite, {
    nokey: 'true',
    // key: pageSpeedKey,
    strategy: pageSpeedStrategy
  }, function (err, data) {
    console.log('Site: ' + pageSpeedSite);
    console.log('Strategy: ' + pageSpeedStrategy);
    if (err) {
      console.log(err);
    } else {
      console.log('Score: ' + data.score);
      console.log(data.pageStats);
    }
  });
});

// Build Size
gulp.task('build-size', function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence(
    ['copy', 'styles'],
    'elements',
    ['jshint', 'images', 'fonts', 'html'],
    'vulcanize',
    'build-size',
    cb);
});

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
try { require('web-component-tester').gulp.init(gulp); } catch (err) {}

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
