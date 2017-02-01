import 'nightingale-app-console/src';
import { createBot } from 'koack/src/bot';
import config from '../config';
import initBot from './bot';

const bot = createBot(config.token);
initBot(bot);
