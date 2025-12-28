import adapters from '@/core/logger/adapters';
import { Logger } from '@/core/logger/base';
const logger = new Logger();
logger.registerErrorAdapter(...adapters);
export default logger;
