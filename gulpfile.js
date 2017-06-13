var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  overridePattern: false,
  pattern: ['browser-sync']
});

gulp.task('serve', ['jshint'], function() {
  $.browserSync.init({
    server: '.'
  });
  gulp.watch(['src/**/*.js', 'demo/**/*.js'], ['jshint']);
  gulp.watch(['src/**/*.*', 'demo/**/*.*', 'index.html'])
    .on('change', $.browserSync.reload);
});

gulp.task('clean', function() {
  return gulp.src('dist')
    .pipe($.clean());
});

gulp.task('jshint', function() {
  return gulp.src(['src/**/*.js', 'demo/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('copy', ['jshint'], function() {
  return gulp.src(['src/**/*.js', 'src/**/*.css'])
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', ['jshint', 'copy'], function() {
  return gulp.src('dist/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.uglify())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.sourcemaps.write('.', {
      includeContent: false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', ['copy'], function() {
  return gulp.src('dist/**/*.css')
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.init())
    .pipe($.csso())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.sourcemaps.write('.', {
      includeContent: false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean'], function() {
  gulp.start('jshint', 'copy', 'scripts', 'styles');
});

gulp.task('default', ['build']);