'use strict';
// init
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),        // Наблюдение за изменениями файлов
    prefixer    = require('gulp-autoprefixer'), // Автоматически добавляет вендорные префиксы к CSS свойствам
    pug = require('gulp-pug'),
    rigger      = require('gulp-rigger'),       // Позволяет импортировать один файл в другой
    uglify      = require('gulp-uglify'),       // Сжимать наш JS
    sass        = require('gulp-sass'),         // для компиляции нашего SCSS кода
    sourcemaps  = require('gulp-sourcemaps'),   // Для генерации css sourscemaps, помогает нам при отладке кода
    cssmin      = require('gulp-minify-css'),   // Сжатие CSS кода
    plumber     = require('gulp-plumber'),      // Ловим ошибки, чтобы не прервался watch
    svgSprite   = require('gulp-svg-sprite'),   // Создаем спрайт из svg
    svgmin      = require('gulp-svgmin'),       // оптимизируем наш svg
    cheerio     = require('gulp-cheerio'),      // Удаляем атрибуты svg
    replace     = require('gulp-replace'),
    spritesmith = require('gulp.spritesmith'),  // Создание png спрайтов
    imagemin    = require('gulp-imagemin'),     // Сжатие картинок
    pngquant    = require('imagemin-pngquant'), // Сжатие картинок | работа с PNG
    cache       = require('gulp-cache'), // Подключаем библиотеку кеширования
    notify = require('gulp-notify'),
    browserSync = require("browser-sync"),      // // Подключаем Browser Sync это для локальной сборки
    reload      = browserSync.reload;
  // write routs
  var path = {
      build: {
          html: 'build/',
          js: 'build/js/',
          styles: 'build/css/',
          images: 'build/images/',
          fonts: 'build/fonts/'
      },
      src: {
          html: 'src/*.pug',
          htmlTemplate: 'src/template/',
          js:                'src/js/*.js',
          jsMainFile:        'src/js/partials/app.js',
          styles:            'src/scss/*.*',
          stylesPartials:    'src/scss/partials/',
          images:            'src/images/**/*.{png,jpg,jpeg}',
          sprite:            'src/sprite/*.*',
          spriteSvg:         'src/sprite-svg/*.*',
          spriteSvgNoConvert:'src/sprite-svg-no-convert/*.*',
          spriteSvgTemplate: 'src/sprite-svg-template.scss',
          fonts:             'src/fonts/**/*.*',
      },
      watch: {
          html: 'src/**/*.pug',
          js:        'src/js/**/*.js',
          styles:    'src/scss/**/*.scss',
          images:    'src/images/**/*.*',
          spriteSvg: 'src/sprite-svg/*.*',
          spriteSvgNoConvert:'src/sprite-svg-no-convert/*.*',
          sprite:    'src/sprite/*.*',
          fonts:     'src/fonts/**/*.*'
      }
  };


  gulp.task('browser-sync', function() {
      browserSync.init({
          server: {
              baseDir: "./build"
          }
      });
  });

  gulp.task('html:build', function(){
    gulp.src(path.src.html)
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest(path.build.html))
      .pipe(plumber.stop())
      .pipe(browserSync.stream());
  })

  gulp.task('js:build', function () {
      gulp.src(path.src.js)               // Найдем наш main файл
          .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
          .pipe(rigger())                 // Прогоним через rigger
          // .pipe(sourcemaps.init())        // Инициализируем sourcemap
          .pipe(uglify())                 // Сожмем наш js
          // .pipe(sourcemaps.write())       // Пропишем карты
          .pipe(plumber.stop())
          .pipe(gulp.dest(path.build.js)) // Выплюнем готовый файл в build
          gulp.src(path.src.jsMainFile)               // Найдем наш main файл
          .pipe(gulp.dest(path.build.js)) // Выплюнем готовый файл в build
          .pipe(reload({stream: true}));
  });

  // svg sprite
  // gulp.task('spriteSvg:build', function () {
  //   gulp.src(path.src.spriteSvg)
  //     .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  //     // minify svg
  //     .pipe(svgmin({
  //       js2svg: {
  //         pretty: true
  //       }
  //     }))
  //     // remove all fill and style declarations in out shapes
  //     .pipe(cheerio({
  //       run: function ($) {
  //         $('[fill]').removeAttr('fill');
  //         $('[stroke]').removeAttr('stroke');
  //         $('[style]').removeAttr('style');
  //       },
  //       parserOptions: {xmlMode: true}
  //     }))
  //     // cheerio plugin create unnecessary string '&gt;', so replace it.
  //     .pipe(replace('&gt;', '>'))
  //     // build svg sprite
  //     .pipe(svgSprite({
  //       mode: {
  //         symbol: {
  //           sprite: "../"+path.build.images+"sprite-svg.svg",
  //           render: {
  //             scss: {
  //               "dest": '../'+path.src.stylesPartials+'sprite-svg.scss',
  //               "template": path.src.spriteSvgTemplate
  //             }
  //           },
  //           example: true
  //         }
  //       }
  //     }))
  //     .pipe(plumber.stop())
  //     .pipe(gulp.dest("./"));

  // });

  // gulp.task('spriteSvgNoConvert:build', function () {
  //   gulp.src(path.src.spriteSvgNoConvert)
  //     .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  //     // minify svg
  //     .pipe(svgmin({
  //       js2svg: {
  //         pretty: true
  //       }
  //     }))
  //     // remove all fill and style declarations in out shapes
  //     .pipe(cheerio({
  //       run: function ($) {

  //       },
  //       parserOptions: {xmlMode: true}
  //     }))
  //     // cheerio plugin create unnecessary string '&gt;', so replace it.
  //     .pipe(replace('&gt;', '>'))
  //     // build svg sprite
  //     .pipe(svgSprite({
  //       mode: {
  //         symbol: {
  //           sprite: "../"+path.build.images+"sprite-svg-no-convert.svg",
  //           render: {
  //             scss: {
  //               "dest": '../'+path.src.stylesPartials+'sprite-svg-no-convert.scss',
  //               "template": path.src.spriteSvgTemplate
  //             }
  //           },
  //           example: true
  //         }
  //       }
  //     }))
  //     .pipe(plumber.stop())
  //     .pipe(gulp.dest("./"));

  // });

  gulp.task('sprite:build', function() {
      var spriteData =
          gulp.src(path.src.sprite)
              .pipe(spritesmith({
                  imgName: 'sprite.png',
                  cssName: 'sprite.scss',
                  imgPath: '../images/sprite.png',
                  cssFormat: 'scss',
                  algorithm: 'binary-tree',
                  padding: 5,
                  // cssTemplate: path.src.spriteTemplate,
                  cssVarMap: function(sprite) {
                      sprite.name = sprite.name
                  }
              }));
      spriteData.img.pipe(gulp.dest(path.build.images));
      spriteData.css.pipe(gulp.dest(path.src.stylesPartials));
  });
  // images
  gulp.task('image:build', function () {
      gulp.src(path.src.images)
          .pipe(cache(imagemin({
              progressive: true,
              svgoPlugins: [{removeViewBox: false}],
              use: [pngquant()],
              interlaced: true
          })))
          .pipe(gulp.dest(path.build.images))
          .pipe(browserSync.stream());
  });

  // move custom fonts to build
  gulp.task('fonts:build', function() {
      gulp.src(path.src.fonts)
          .pipe(gulp.dest(path.build.fonts))
  });
  // styles
  gulp.task('styles:build', function () {
      gulp.src(path.src.styles)               // Выберем наш main.scss
          .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
          // .pipe(sourcemaps.init())            // То же самое что и с js
          .pipe(sass())                       // Скомпилируем
          .pipe(prefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))                   // Добавим вендорные префиксы
          .pipe(cssmin())                     // Сожмем
          // .pipe(sourcemaps.write())           // Пропишем карты
          .pipe(plumber.stop())
          .pipe(gulp.dest(path.build.styles)) // И в build
          .pipe(reload({stream: true}));
  });


  gulp.task('build', [
      'html:build',
      'js:build',
      'image:build',
      'fonts:build',
      'sprite:build',
      // 'spriteSvg:build',
      // 'spriteSvgNoConvert:build',
      'styles:build',

  ]);

  gulp.task('watch', function(){
      watch([path.watch.html], function(event, cb) {
          gulp.start('html:build');
      });

      watch([path.watch.js], function(event, cb) {
          gulp.start('js:build');
      });

      watch([path.watch.images], function(event, cb) {
          gulp.start('image:build');
      });

      watch([path.watch.sprite], function(event, cb) {
          gulp.start('sprite:build');
      });

      // watch([path.watch.spriteSvg], function(event, cb) {
      //     gulp.start('spriteSvg:build');
      // });

      // watch([path.watch.spriteSvgNoConvert], function(event, cb) {
      //     gulp.start('spriteSvgNoConvert:build');
      // });

      watch([path.watch.fonts], function(event, cb) {
          gulp.start('fonts:build');
      });

      watch([path.watch.styles], function(event, cb) {
          gulp.start('styles:build');
      });

  });

  gulp.task('default', ['build', 'browser-sync', 'watch']);
