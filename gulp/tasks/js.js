var gulp = require('gulp'),
    config = require('../config').js,
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');


gulp.task('jshint', function () {
    return gulp.src(config.src)
               .pipe(jshint())
               .pipe(jshint.reporter('default'));
});

gulp.task('jsmin', function () {
    return gulp.src(config.src)
               .pipe(rename({ suffix: '.min' })) 
               .pipe(uglify())
               .pipe(gulp.dest(config.dest));
});