var gulp = require('gulp'),
    config = require('../config').css,
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename');

gulp.task('cssmin', function () {
    return gulp.src(config.src)
               .pipe(rename({ suffix: '.min' }))
               .pipe(minifyCss())
               .pipe(gulp.dest(config.dest));
})