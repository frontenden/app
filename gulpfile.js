var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

gulp.task('sass', function() {
    gulp.src('src/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('javascript', function() {
    gulp.src(
            'src/js/vendor/**/*.js'
        )
        .pipe(gulp.dest('dist/js/vendor'));

    gulp.src(
            'src/js/plugin/**/*.js'
        )
        .pipe(gulp.dest('dist/js/plugin'));

    return gulp.src([
            'src/js/**/*.js', '!src/js/vendor/*.js', '!src/js/plugin/scripts.js'
        ])
        .pipe(gulp.dest('dist/js'))
});

gulp.task('images', function() {
    gulp.src(
            'src/assets/img/*.{png,gif,svg,jpg}'
        )
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['javascript']);
    gulp.watch('src/assets/img/**', ['images']);
});

gulp.task('browser-sync', function() {
    var files = [
        '**/*.php',
        'dist/css/**/*.css',
        'dist/js/**/*.js'
    ];
    browserSync.init(files, {
        proxy: 'http://localhost:8888'
    });
});

gulp.task('deploy', function() {

    var conn = ftp.create({
        host: 'ftp.fiskerioghavjagt.dk',
        user: 'fiskerioghavjagt.dk',
        password: 'nx9m3zfw',
        parallel: 6,
        log: gutil.log
    });

    var globs = [
        'src/assets/**',
        'dist/**',
        'includes/**',
        '*.php'
    ];

    return gulp.src(globs, { base: '.', buffer: false })
        .pipe(conn.newer('/public_html')) // only upload newer files
        .pipe(conn.dest('/public_html'));

});

gulp.task('dev', ['sass', 'javascript', 'images', 'watch', 'browser-sync']);
