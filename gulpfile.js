/**
 * @file
 * gulpfile.js
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var assign = require('lodash.assign');
var babel = require('babelify');

// @todo, move legacy css to sass.
gulp.task('styles', function(){
  gulp.src(['sass/*.scss'])
    .pipe(sass())
    .on('error', gutil.log)
    .on('error', gutil.log)
    .pipe(gulp.dest('css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css/'))
});

function compile(watch) {
  var bundler = watchify(browserify({
      entries: ['./src/borderPattern.js'],
      debug: true,
      standalone: 'borderPattern'
    }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('borderPattern.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
      // @todo, create .min version.
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);