const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const { src, series, parallel, dest, watch } = require('gulp');

const jsPath = 'src/assets/js/**/*.js';
const cssPath = 'src/assets/css/**/*.css';
const scssPath = 'src/assets/scss/main.scss';

function copyHtml() {
  return src('src/*.html').pipe(gulp.dest('dist'));
}
// function copyWebfonts() {
//   return src([
//     'src/assets/vendor/fontawesome/webfonts/*.eot',
//     'src/assets/vendor/fontawesome/webfonts/*.svg',
//     'src/assets/vendor/fontawesome/webfonts/*.ttf',
//     'src/assets/vendor/fontawesome/webfonts/*.woff',
//     'src/assets/vendor/fontawesome/webfonts/*.woff2',
//   ]).pipe(gulp.dest('dist/assets/webfonts'));
// }

// npm install --save-dev gulp-imagemin
function imgTask() {
  return src('src/assets/img/**/*')
    .pipe(
      imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
        svgoPlugins: [
          {
            removeViewBox: true,
          },
        ],
      })
    )
    .pipe(gulp.dest('dist/assets/img'));
}

// npm install --save-dev gulp-sourcemaps gulp-concat gulp-terser
function jsTask() {
  return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('theme.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assets/js'));
}
function vendorTask() {
  return src([
    './src/assets/vendor/jquery/jquery.min.js',
    './src/assets/vendor/gsap/gsap.min.js',
    './src/assets/vendor/gsap/ScrollToPlugin.min.js',
    './src/assets/vendor/gsap/ScrollTrigger.min.js',
    './src/assets/vendor/smooth-scrollbar.js',
    './src/assets/vendor/bootstrap/bootstrap.bundle.min.js',
    './src/assets/vendor/swiper/js/swiper-bundle.min.js',
    './src/assets/vendor/isotope/imagesloaded.pkgd.min.js',
    './src/assets/vendor/isotope/isotope.pkgd.min.js',
    './src/assets/vendor/isotope/packery-mode.pkgd.min.js',
    './src/assets/vendor/lightgallery/js/lightgallery-all.min.js',
    './src/assets/vendor/jquery.mousewheel.min.js',
    './src/assets/vendor/jquery.matchHeight-min.js',
    './src/assets/vendor/superwheel/superwheel.js',
    './src/assets/vendor/sweetalert/sweetalert2.min.js',
    './src/assets/vendor/fontawesome/fontawesome.js',
  ])
    .pipe(concat('vendors.min.js'))
    .pipe(uglify()) // (Optional)
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(browserSync.reload({ stream: true }));
}
// npm install --save-dev gulp-postcss cssnano autoprefixer
function cssTask() {
  return src(cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat('theme.css'))
    .pipe(postcss([autoprefixer(), cssnano()])) //not all plugins work with postcss only the ones mentioned in their documentation
    .pipe(dest('dist/assets/css'));
}
function scssTask() {
  return src(scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('dist/assets/css'));
}
function cssVendor() {
  return src([
    './src/assets/vendor/bootstrap/bootstrap.min.css',
    './src/assets/vendor/normalize/normalize.min.css',
    // './src/assets/vendor/fontawesome/css/fontawesome-all.min.css',
    './src/assets/vendor/swiper/css/swiper-bundle.min.css',
    './src/assets/vendor/lightgallery/css/lightgallery.min.css',
    './src/assets/vendor/sweetalert/sweetalert2.min.css',
    './src/assets/vendor/superwheel/superwheel.css',
  ])
    .pipe(concat('vendors.min.css'))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.reload({ stream: true }));
}
function watchTask() {
  watch([scssPath, cssPath, jsPath], { interval: 1000 }, parallel(scssTask, cssTask, jsTask));
}

exports.cssVendor = cssVendor;
exports.vendorTask = vendorTask;
exports.scssTask = scssTask;
exports.cssTask = cssTask;
exports.scssTask = scssTask;
exports.jsTask = jsTask;
exports.imgTask = imgTask;
exports.copyHtml = copyHtml;
// exports.copyWebfonts = copyWebfonts;
exports.default = series(
  parallel(copyHtml, scssTask, imgTask, jsTask, cssTask, vendorTask, cssVendor),
  watchTask
);
