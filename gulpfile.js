'use strict';

var gulp = require('gulp'),
    del = require('del'),
    handlebars = require('handlebars'),
    sass = require('gulp-sass'),
    File = require('vinyl'),
    fs = require('fs'),
    mergeStream = require('merge-stream'),
    through = require('through2')

/**
* helper methods
*/

function logException(exception, message) {
  console.log(message)
  console.log('==== Exception Details ====')
  console.log(exception)
}

function replaceCodeLinks(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (prop == 'code') {
        return obj[prop].text = fs.readFileSync('./src/code/' + obj[prop].src, 'utf8').toString()
      }
      if (typeof obj[prop] == "object") {
        replaceCodeLinks(obj[prop])
      }
    }
  }
}

/**
* build tasks
*/

function buildCss() {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'))
}

gulp.task('build:css', buildCss)

gulp.task('register:partials', function() {
  return gulp.src('src/handlebars/partials/*.handlebars')
    .pipe(through.obj(function(partialFile, partialEncoding, partialCallback) {
      var partialName = partialFile.relative.split('.')[0],
          partial = partialFile.contents.toString()
      handlebars.registerPartial(partialName, partial)
      partialCallback()
    }))
})

// TODO: Once this implementation is settled move it to a separate package
// TODO: Add default options
function generateHandlebarsPipe(options) {
  return through.obj(function(templateFile, templateEncoding, templateCallback) {
    var templateName = templateFile.relative.split('.')[0],
        template = handlebars.compile(templateFile.contents.toString(), {
          preventIndent: true
        }),
        dest = 'app'

    if (options.pageFolder) {
      dest += '/' + templateName
    }

    gulp.src('src/json/' + templateName + '/*.json')
    .pipe(through.obj(function(dataFile, dataEncoding, dataCallback) {
      var newFile = dataFile.clone()

      try {
        var templateData = JSON.parse(dataFile.contents.toString())
      } catch (ex) {
        logException(ex, 'Error parsing ' + dataFile.relative)
        return dataCallback()
      }

      try {
        replaceCodeLinks(templateData)
      } catch (ex) {
        logException(ex, 'Error replacing code links in ' + dataFile.relative)
        return dataCallback()
      }

      try {
        newFile.contents = new Buffer(template(templateData))
      } catch (ex) {
        logException(ex, 'Error compiling template ' + templateFile.relative + ' with ' + dataFile.relative)
        return dataCallback()
      }

      newFile.path = newFile.path.split('.')[0] + '.html'

      dataCallback(null, newFile)
    }))
    .pipe(gulp.dest(dest))

    templateCallback()
  })
}

function buildHandlebars() {
  return mergeStream(
    gulp.src('src/handlebars/pages/*.handlebars')
      .pipe(generateHandlebarsPipe({
        pageFolder: false
      })),
    gulp.src('src/handlebars/pageFolders/*.handlebars')
      .pipe(generateHandlebarsPipe({
        pageFolder: true
      })))
}

gulp.task('build:handlebars', ['register:partials'], buildHandlebars)

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

function buildRoot() {
  return gulp.src('./src/root/**/*')
    .pipe(gulp.dest('./app'))
}

gulp.task('build:root', buildRoot)

gulp.task('build', ['clean', 'register:partials'], function () {
  return mergeStream(
    buildCss(),
    buildHandlebars(),
    buildImg(),
    buildJs(),
    buildRoot())
})

/**
* clean tasks
*/

function clean() {
  return del(['./app/**/*'])
}

gulp.task('clean', clean)

/**
* watch tasks
*/

function watchCss() {
  gulp.watch('./src/sass/**/*.scss', ['build:css'])
  .on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  })
}

gulp.task('watch:css', watchCss)

function watchHandlebars() {
  gulp.watch([
    'src/handlebars/**/*.handlebars',
    'src/json/**/*.json'
  ],
  ['build:handlebars'])
  .on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  })
}

gulp.task('watch:handlebars', watchHandlebars)

function watchImg() {
  gulp.watch('./src/img/**/*', ['build:img'])
  .on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  })
}

gulp.task('watch:img', watchImg)

function watchJs() {
  gulp.watch('./src/js/**/*.js', ['build:js'])
  .on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  })
}

gulp.task('watch:js', watchJs)

function watchRoot() {
  gulp.watch('./src/root/**/*', ['build:root'])
  .on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
  })
}

gulp.task('watch', function () {
  watchCss()
  watchHandlebars()
  watchImg()
  watchJs()
  watchRoot()
})

/**
* default task
*/

gulp.task('default', ['build'])
