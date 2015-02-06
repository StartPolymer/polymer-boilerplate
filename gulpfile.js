/*global -$ */
'use strict';

// GitHub Pages
var ghPagesOrigin = 'origin';
var ghPagesBranch = 'gh-pages';

// PageSpeed Insights
var pageSpeedSite = 'https://startpolymer.org'; // change it
var pageSpeedStrategy = 'mobile'; // desktop
var pageSpeedKey = ''; // nokey is true

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pageSpeed = require('psi');
var streamqueue = require('streamqueue');

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

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  // LibSass
  //return gulp.src([
  //    'app/styles/**/*.css',
  //    'app/styles/**/*.scss'
  /*  ])
    .pipe($.changed('styles', {extension: '.scss'}))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      onError: console.error.bind(console)
    }))
    .pipe($.sourcemaps.write())*/
  return streamqueue({ objectMode: true },
      $.rubySass('app/styles/', {
        container: 'gulp-ruby-sass-styles',
        style: 'expanded',
        precision: 10,
        loadPath: ['.']
        //sourcemap: true
      })
      .on('error', function (err) {
        console.error('Error!', err.message);
      }),
      $.rubySass('app/elements/', {
        container: 'gulp-ruby-sass-elements',
        style: 'expanded',
        precision: 10,
        loadPath: ['.']
        //sourcemap: true
      })
      .on('error', function (err) {
        console.error('Error!', err.message);
      })
    )
    .pipe($.concat('main.css'))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: AUTOPREFIXER_BROWSERS})
    ]))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size({title: 'styles'}));
});

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

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', ['views', 'styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src(['app/**/*.html', '.tmp/*.html', '!app/{elements,test}/**/*.html'])
    // Replace path for vulcanized assets
    .pipe($.if('*.html', $.replace('elements/elements.html', 'elements/elements.vulcanized.html')))
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    // Concatenate And Minify Styles
    // Issue https://github.com/css/csso/issues/209
    //.pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
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
  return gulp.src('app/elements/elements.html')
    .pipe($.vulcanize({
      dest: 'dist/elements',
      strip: true
    }))
    .pipe($.rename("elements.vulcanized.html"))
    .pipe(gulp.dest('dist/elements'))
    .pipe($.size({title: 'vulcanize'}));
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

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Copy All Files At The Root Level (app)
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    '!app/*.jade'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
  .pipe($.size({title: 'extras'}));
});

// Clean Output Directory
gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

// Watch Files For Changes & Reload
gulp.task('serve', ['views', 'styles', 'fonts'], function () {
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
    '.tmp/**/*.html',
    '.tmp/styles/**/*.css',
    '.tmp/elements/**/*.css',
    'app/images/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.jade', ['views', reload]);
  gulp.watch('app/styles/**/*.scss', ['styles', reload]);
  gulp.watch('app/elements/**/*.scss', ['styles', reload]);
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

// Build Production Files
gulp.task('build', ['jshint', 'html', 'vulcanize', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

// Default Task
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
