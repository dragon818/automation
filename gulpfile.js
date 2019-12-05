const {src, watch, dest, parallel} = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

function watcher () {
  browserSync.init({
    server: {
      baseDir: './dest/'
    }
  })
  watch('./src/css/**/*.scss', style)
  watch('./src/images/**/*.png', copyimg)
  watch('./src/index.html', copyhtml)
  watch('./src/js/**/*.js', minjs)
}

function copyhtml () {
  return src('./src/index.html')
  .pipe(dest('./dest/'))
  .pipe(browserSync.reload);
}

function style () {
  return src('./src/css/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('style.css'))
  .pipe(cleanCss())
  .pipe(dest('./dest/css'))
  .pipe(browserSync.stream());
}

function copyimg () {
  return src('./src/images/**/*.png')
  .pipe(dest('./dest/imgs'))
  .pipe(browserSync.stream());
}

function minjpg () {
  return src('./src/images/**/*.jpg')
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(dest('./dest/imgs'))
  .pipe(browserSync.stream());
}

function minjs () {
  return src('./src/js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('all.js'))
  .pipe(dest('./dest/js'))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./dest/js'))
  .pipe(browserSync.stream());
}

exports.style = style;
exports.copyimg = copyimg;
exports.watcher = watcher;
exports.minjs = minjs;
exports.minjpg = minjpg;
exports.copyhtml = copyhtml;

exports.default = parallel(watcher, style, copyimg, minjs, minjpg, copyhtml);