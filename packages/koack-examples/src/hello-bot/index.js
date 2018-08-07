import 'nightingale-app-console';
import { createBot } from 'koack-bot';
import config from '../config';
import initBot from './bot';

const bot = createBot(config.token);
initBot(bot);
