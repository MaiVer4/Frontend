import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';
import { logError } from './app/shared/services/logger.service';

platformBrowser().bootstrapModule(AppModule, {
  
})
  .catch(err => logError(err));
