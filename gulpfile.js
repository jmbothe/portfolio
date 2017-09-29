const gulp = require('gulp');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const del = require('del');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const htmlReplace = require('gulp-html-replace')
const minify = require('gulp-babel-minify');
const access = require('gulp-accessibility');
const reload = browserSync.reload;

gulp.task('test', () => {
  gulp.src('app/**/*.html')
    .pipe(access({ force: true }))
    .on('error', console.log)
    .pipe(access.report({reportType: 'txt'}))
    .pipe(rename({ extname: '.txt' }))
    .pipe(gulp.dest('reports/txt'));
})

gulp.task('postcss', () => {
    gulp.src('app/styles/post.css')
    .pipe(plumber())
    .pipe(postcss([require('precss')(), require('autoprefixer')({ browsers: 'last 2 versions, > 5%' })]))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('app/styles/'))
    .pipe(reload({stream: true}));
})

gulp.task('css', ['postcss'], () => {
  gulp.src([
    'app/styles/normalize.css',
    'app/styles/styles.css'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  gulp.src([
    'app/scripts/jquery-3.2.1.js',
    'app/scripts/scrollto.js',
    'app/scripts/waypoints.js',
    'app/scripts/relax.js',
    'app/scripts/main.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(minify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload({stream: true}));
});

gulp.task('html', () => {
  gulp.src('app/**/*.html')
  .pipe(htmlReplace({
    'js': '<script src="scripts/app.min.js" defer></script>',
    'css': '<link rel="stylesheet" href="styles/styles.css">',
  }))
  .pipe(gulp.dest('dist'))
  .pipe(reload({stream: true}));
})

gulp.task('assets:cleanfolder', () => del(['dist/assets/**']));

gulp.task('assets:copy', ['assets:cleanfolder'], () => {
  gulp.src(['app/assets/**/*', '!app/assets/psd/*'])
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('browser-sync', () => {
  browserSync ({
    server: {
      baseDir: './app'
    }
  })
})

gulp.task('watch', () => {
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/styles/**/*css', ['css']);
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/assets/**/*', ['assets:copy'])
})

gulp.task('default', ['scripts', 'css', 'html', 'assets:copy', 'browser-sync', 'watch']);