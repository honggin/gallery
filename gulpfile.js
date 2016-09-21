var gulp = require('gulp'),
    requireDir = require('require-dir');
    config = require('./gulp/config');

requireDir('./gulp/tasks', { recurse: true });

gulp.task('default', ['jsmin', 'cssmin', 'imagemin']);

gulp.task('watch', function () {
    gulp.watch(config.css.src, ['cssmin']);
    gulp.watch(config.img.src, ['imagemin']);
    gulp.watch(config.js.src, ['jsmin']);
})