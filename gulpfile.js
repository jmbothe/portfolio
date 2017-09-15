const gulp = require('gulp');

gulp.task('css', () => {
  const postcss = require('gulp-postcss');

  return gulp.src('styles/styles.css')
    .pipe(postcss([require('autoprefixer')]))
    .pipe(gulp.dest('dist/styles/'));
});
