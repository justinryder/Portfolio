'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    mergeStream = require('merge-stream')

/**
* build tasks
*/

function buildCss () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/css'))
}

gulp.task('build:css', buildCss)

function buildHtml () {
  return gulp.src('./src/html/**/*.html')
    .pipe(gulp.dest('./app'))
}

gulp.task('build:html', buildHtml)

function buildJs() {
  return gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./app/js'))
}

gulp.task('build:js', buildJs)

gulp.task('build', function () {
  return mergeStream(
    buildCss(),
    buildHtml(),
    buildJs())
})

/**
* watch tasks
*/

function watchCss () {
  gulp.watch('./src/sass/**/*.scss', ['build:css'])
}

gulp.task('watch:css', watchCss)

function watchHtml () {
  gulp.watch('./src/**/*.html', ['build:html'])
}

gulp.task('watch:html', watchHtml)

function watchJs() {
  gulp.watch('./src/js/**/*.js', ['build:js'])
}

gulp.task('watch:js', watchJs)

gulp.task('watch', function () {
  watchCss()
  watchHtml()
  watchJs()
})

/**
* default task
*/

gulp.task('default', ['build'])
