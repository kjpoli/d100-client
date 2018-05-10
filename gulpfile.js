//
// All compiling task minifys all files

const gulp = require('gulp');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const handlebars = require('gulp-handlebars');
const defineModule = require('gulp-define-module');
// Compile Bootstrap 4 Sass Files To CSS Minified Directory
gulp.task('compile-bs-sass', function(){
    return gulp.src("./public/scss/boostrap-scss/bootstrap.scss")
    .pipe(maps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('boostrap.min.css'))
    .pipe(maps.write('./public/'))
    .pipe(gulp.dest('./public/css'));
});

// Compile Custom Sass Files To CSS Minified Directory
gulp.task('compile-custom-sass', function(){
    return gulp.src("./public/scss/custom-scss/main.scss")
    .pipe(maps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('main.min.css'))
    .pipe(maps.write('./public/'))
    .pipe(gulp.dest('./public/css'));
});

// Concats Boostrap 4, jQuery, and Tether ALREADY Javascript Files
gulp.task('concat-js-script', function () {
    return gulp.src([
        './public/js/jquery-3.1.1.slim.min.js',
        './public/js/tether.min.js',
        './public/js/bootstrap.min.js'
    ])
        .pipe(concat('bootstrap-4-bundle.min.js'))
        .pipe(gulp.dest('./public/js'));
});
gulp.task('compile-templates', function(){
    return gulp.src(['./public/templates/*.handlebars'])
        .pipe(handlebars())
        .pipe(defineModule('plain'))
        .pipe(gulp.dest('./public/js/templates/'));
});
// Transpile ES6 JS into plain javascript,
// you can still use regular javascript and just switch it out in index.html script src
gulp.task('transpile-compile-es6', () => {
   return gulp.src('./public/js/index.js')
       .pipe(babel({ presets: ['es2015'] }))
       .pipe(uglify())
       .pipe(rename('index.min.js'))
       .pipe(gulp.dest('./public/js/es2015'));
});
gulp.task('fonts', function() {
    return gulp.src('node_modules/font-awesome/fonts/*').pipe(gulp.dest('public/fonts'));
});

// If you add a new file to either bootstrap 4 or custom dir,
// run compile-boostrap OR custom-sass first then this task
gulp.task('watchFile', ['compile-bs-sass', 'compile-custom-sass'], function() {
    gulp.watch('./public/scss/boostrap-scss/**.*', ['compile-bs-sass']);
    gulp.watch('./public/scss/custom-scss/**.*', ['compile-custom-sass']);
    //gulp.watch('./js/public/js/index.js', ['transpile-compile-es6']);
    //gulp.watch('./js/public/templates/**.*', ['compile-templates']);
});

gulp.task('serve', ['watchFile']);

