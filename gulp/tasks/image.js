var gulp = require('gulp'),
    config = require('../config').img,
    imagemin = require('gulp-imagemin');

gulp.task('imagemin', function () {
    return gulp.src(config.src)
               .pipe(imagemin())
               .pipe(gulp.dest(config.dest));
});