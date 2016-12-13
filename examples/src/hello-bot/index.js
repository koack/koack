import 'nightingale-app-console';
import { createBot } from 'koack/src/bot';
import config from '../config';
import initBot from './bot';

const bot = createBot({ token: config.token });
initBot(bot);
