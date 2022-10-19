import gulp from 'gulp';
import { path } from './gulp/config/path.js';
import { plugins } from './gulp/config/plugins.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js';
import { sprite } from './gulp/tasks/sprite.js';
import { zip } from './gulp/tasks/zip.js';

global.app = {
  isBuild: process.argv.includes('--build'),
	isDev: !process.argv.includes('--build'),
  path,
  gulp,
  plugins,
};

// Набл.датель за изменениями файлов
function watcher() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images, images);
}

export { sprite }

// Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(html, scss, js));

// Сценарии выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);

// Экспорт сценариев
export { 
  dev, 
  build,
  deployZIP, 
}

// Выполнение сценария по умолчанию
gulp.task('default', dev);
