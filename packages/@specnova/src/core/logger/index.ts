import adapters from '@/core/logger/adapters';
import { Logger } from '@/core/logger/writer';
const logger = new Logger();
logger.registerErrorAdapter(...adapters);
export default logger;
