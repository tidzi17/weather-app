const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); 
const rename = require('gulp-rename');

function compileSass() {
  return gulp
    .src('src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('src/css'));
}

function watchSass() {
  gulp.watch('src/scss/**/*.scss', compileSass);
}

exports.compileSass = compileSass;
exports.watchSass = watchSass;
exports.default = gulp.series(compileSass, watchSass);

