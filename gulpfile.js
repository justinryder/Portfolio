'use strict';

var gulp = require('gulp'),
    handlebars = require('handlebars'),
    sass = require('gulp-sass'),
    File = require('vinyl'),
    mergeStream = require('merge-stream'),
    through = require('through2')

/**
* build tasks
*/

function buildCss() {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'))
}

gulp.task('build:css', buildCss)

function buildHandlebars() {
  return gulp.src('src/handlebars/*.handlebars')
  .pipe(through.obj(function(templateFile, templateEncoding, templateCallback) {
    var templateName = templateFile.relative.split('.')[0],
    template = handlebars.compile(templateFile.contents.toString())

    gulp.src('src/json/' + templateName + '/*.json')
    .pipe(through.obj(function(dataFile, dataEncoding, dataCallback) {
      var newFile = dataFile.clone()
      newFile.contents = new Buffer(template(JSON.parse(dataFile.contents.toString())))
      newFile.path = newFile.path.split('.')[0] + '.html'

      dataCallback(null, newFile)
    }))
    .pipe(gulp.dest('app/' + templateName))

    templateCallback()
  }))
}

gulp.task('build:handlebars', buildHandlebars)

function buildHtml() {
  return gulp.src('./src/html/**/*.html')
      .pipe(gulp.dest('./app'))
}

gulp.task('build:html', buildHtml)

function buildImg() {
  return gulp.src('./src/img/**/*')
  .pipe(gulp.dest('./app/img'))
}

gulp.task('build:img', buildImg)

function buildJs() {
  return gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./app/js'))
}

gulp.task('build:js', buildJs)

gulp.task('build', function () {
  return mergeStream(
    buildCss(),
    buildHandlebars(),
    buildHtml(),
    buildImg(),
    buildJs())
})

/**
* watch tasks
*/

function watchCss() {
  gulp.watch('./src/sass/**/*.scss', ['build:css'])
}

gulp.task('watch:css', watchCss)

function watchHandlebars() {
  gulp.watch('src/handlebars/*.handlebars', ['build:handlebars'])
}

gulp.task('watch:handlebars', watchHandlebars)

function watchHtml() {
  gulp.watch('./src/**/*.html', ['build:html'])
}

gulp.task('watch:html', watchHtml)

function watchImg() {
  gulp.watch('./src/img/**/*', ['build:img'])
}

gulp.task('watch:img', watchImg)

function watchJs() {
  gulp.watch('./src/js/**/*.js', ['build:js'])
}

gulp.task('watch:js', watchJs)

gulp.task('watch', function () {
  watchCss()
  watchHandlebars()
  watchHtml()
  watchImg()
  watchJs()
})

/**
* default task
*/

gulp.task('default', ['build'])
