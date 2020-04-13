var gulp = require('gulp'),
    clean = require('gulp-clean');

gulp.task('clean', function () {
  return gulp.src(['dist/*'], {read: false, allowEmpty: true})
    .pipe(clean({force: true}));
});

gulp.task('copy', function () {
  return gulp.src(['package.json', 'README.md'])
    .pipe(gulp.dest('dist/'));
});

// gulp.series：按照顺序执行
// gulp.paralle：可以并行计算
gulp.task('default', gulp.series('clean', 'copy', done => done()));
