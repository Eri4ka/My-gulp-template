import dartSass from 'sass';
import gulpSass from 'gulp-sass';

import cleanCss from "gulp-clean-css"; // Сжатие CSS файла
import webpCss from "gulp-webpcss"; // Вывод WEBP изображений
import autoprefixer from "gulp-autoprefixer"; // Добавление вендорных префиксов
import groupCss from "gulp-group-css-media-queries"; // Группировка медиа-запросов

const SASS = gulpSass(dartSass);

export const scss = (dartSass) => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "SCSS",
                message: "Error: <%= error.message %>",
            })
        ))
        .pipe(SASS({
            outputStyle: 'expanded',
        }))
        .pipe(
            app.plugins.if(
                app.isBuild,
                groupCss()
            )
        )
        .pipe(
            app.plugins.if(
                app.isBuild,
                autoprefixer({
                    grid: true,
                    overrideBrowserlist: ["last 3 versions"],
                    cascade: true,
                })
            )
        )   
        .pipe(
            app.plugins.if(
                app.isBuild,
                webpCss(
                    {
                        webpClass: ".webp",
                        noWebpClass: ".no-webp"
                    }
                )
            )
        )
        // Раскоментировать, если нужен не сжатый дубль файла стилей
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(
            app.plugins.if(
                app.isBuild,
                cleanCss()
            )
        )
        .pipe(rename({
            extname: ".min.css",
        }))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browserSync.stream());
}