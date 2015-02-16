/* global -$ */
'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var merge = require('merge-stream');
var config = require('./gulp/config');

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
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
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
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
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
    .pipe($.autoprefixer(config.autoprefixer.browsers))
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
    .pipe($.autoprefixer(config.autoprefixer.browsers))
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
    // Revving files with child references into consideration when calculating a hashes
    .pipe($.revAll())
    .pipe(assets.restore())
    .pipe($.useref())
    // Updating all references to revved files
    .pipe($.revReplace())
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
  var marked = require('marked');
  // Synchronous highlighting with highlight.js
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value;
    }
  });

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
    // Revving file
    .pipe($.rev())
    .pipe(gulp.dest('dist/elements'))
    .pipe($.size({title: 'vulcanize'}))
    // Write rev-manifest.json to .tmp
    .pipe($.revAll.manifest())
    .pipe(gulp.dest('.tmp'));
});

// Watch Files For Changes & Reload
gulp.task('serve', ['views', 'styles', 'elements', 'fonts'], function () {
  browserSync({
    browser: config.browserSync.browser,
    https: config.browserSync.https,
    notify: config.browserSync.notify,
    port: config.browserSync.port,
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
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.{jade,md}', ['views', reload]);
  gulp.watch('app/styles/**/*.scss', ['styles', reload]);
  gulp.watch('app/elements/**/*.scss', ['elements', reload]);
  gulp.watch('app/scripts/**/*.js', ['jshint', reload]);
  gulp.watch('app/elements/**/*.js', ['jshint', reload]);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    browser: config.browserSync.browser,
    https: config.browserSync.https,
    notify: config.browserSync.notify,
    port: config.browserSync.port,
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
      ignorePath: /^(\.\.\/)*\.\./,
      exclude: [
        'bower_components/polymer/polymer.js',
        'bower_components/webcomponentsjs/webcomponents.js'
      ]
    }))
    .pipe(gulp.dest('app/layouts'));
});

// Deploy to GitHub Pages
gulp.task('deploy:gh', function () {
  return gulp.src('dist/**/*')
    .pipe($.ghPages({
      branch: config.ghPages.branch,
      origin: config.ghPages.origin
    }));
});

// Run PageSpeed Insights
gulp.task('pagespeed', function () {
  return require('psi')(config.pageSpeed.site, {
    nokey: config.pageSpeed.nokey,
    // key: config.pageSpeed.key,
    strategy: config.pageSpeed.strategy
  }, function (err, data) {
    console.log('Site: ' + config.pageSpeed.site);
    console.log('Strategy: ' + config.pageSpeed.strategy);
    if (err) {
      console.log(err);
    } else {
      console.log('Score: ' + data.score);
      console.log(data.pageStats);
    }
  });
});

// Updating all references in manifest to revved files
gulp.task('revreplace', function () {
  var manifest = require('./.tmp/rev-manifest.json');
  var stream = gulp.src('dist/index.html');

  Object.keys(manifest).reduce(function(stream, key){
    return stream.pipe($.replace(key, manifest[key]));
  }, stream).pipe(gulp.dest('dist'));
});

// Gzip text files
gulp.task('gzip', function () {
  gulp.src('dist/**/*.{txt,html,xml,json,css,js}')
    .pipe($.pako.gzip())
    .pipe(gulp.dest('dist'));
});

// Get gzipped size of build
gulp.task('build-size', function () {
  return gulp.src([
    'dist/**/*',
    '!dist/**/*.{txt,html,xml,json,css,js}'
    ]).pipe($.size({title: 'build (gzipped)'}));
});

// Clean Output Directory
gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  require('run-sequence')(
    ['copy', 'styles'],
    'elements',
    ['jshint', 'images', 'fonts', 'html'],
    'vulcanize',
    'revreplace',
    'gzip',
    'build-size',
    cb);
});

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
try { require('web-component-tester').gulp.init(gulp); } catch (err) {}

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
