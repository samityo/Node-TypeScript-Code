const gulp = require('gulp');

const run = require('run-sequence');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');

const rimraf = require('gulp-rimraf');

gulp.task('build', function () {

    const tsResult = tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write({
            // Return relative source map root directories per file.
            sourceRoot: function (file) {
                return file.cwd + '/src';
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(rimraf());
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('default', function (callback) {
    return run(/*'clean', */'build', callback);
});