const gulp = require('gulp');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

gulp.task('css', () => {
  const postcss = require('gulp-postcss');

  return gulp.src('app/styles/**/*.css')
    .pipe(plumber())
    .pipe(postcss([require('precss')(), require('autoprefixer')({ browsers: 'last 2 versions, > 5%' })]))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  const uglify = require('gulp-uglify');
  const rename = require('gulp-rename');
  gulp.src('app/scripts/**/*.js')
    .pipe(plumber())
    // .pipe(uglify())
    // .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload({stream: true}));
});

gulp.task('html', () => {
  const htmlReplace = require('gulp-html-replace')
  gulp.src('app/**/*.html')
  // .pipe(htmlReplace({'jsmini': '<script src="scripts/main.min.js" defer></script>'}))
  .pipe(gulp.dest('dist'))
  .pipe(reload({stream: true}));
})

gulp.task('assets:cleanfolder', (cb) => {
  const del = require('del');
  return del([
    'dist/assets/**',
  ], cb)
})

gulp.task('assets:copy', ['assets:cleanfolder'], () => {
  return gulp.src(['app/assets/**/*', '!app/assets/psd/'])
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('browser-sync', () => {
  browserSync ({
    server: {
      baseDir: './dist'
    }
  })
})

gulp.task('watch', () => {
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/styles/**/*css', ['css']);
  gulp.watch('app/**/*.html', ['html']);
})

gulp.task('default', ['scripts', 'css', 'html', 'assets:copy', 'browser-sync', 'watch']);