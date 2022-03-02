const gulp = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const autoprefix = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');
const imageMin = require('gulp-imagemin');
const GulpClient = require('gulp');
const browserSync = require('browser-sync').create();

// compile to sass to css 
gulp.task('sass', () => {
    return gulp
    .src('src/scss/main.scss')
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(gulp.dest('src/css'));
});

gulp.task('watch', () => {
    gulp.watch('src/scss/**/*.scss', gulp.series('sass', 'watch'));
    gulp.watch('src/**/*.{html,css,js}', gulp.series('reload'));
});

// serve development server using browserSync 
gulp.task('serve', () => {
    browserSync.init({
        serve: './src',
        index: 'index.html',
        port: '4000',
        watchOptions: {
            awaitWriteFinish: true,
        },
    });
});

// Reload the development server 
gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

// default gulp function to serve our files 
gulp.task('default', gulp.parallel('sass', 'serve', 'watch')); 

// Minifying css and js 
gulp.task('asset-minify', () => {
    return gulp
    .src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', csso()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

// Minifying the images 
gulp.task('imgSquash', () => {
    return gulp
    .src('src/images/**/*')
    .pipe(imageMin())
    .pipe(gulp.dest('dist/images'));
});

// build the code for production 
gulp.task('build', gulp.series('sass', 'asset-minify', 'imgSquash'));