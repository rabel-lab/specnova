import { ParserCommander } from '@/core/parser/base';
import operationIdCommand from '@/core/parser/operationId/command';

const parserCommander = new ParserCommander();

parserCommander.push(...operationIdCommand);

export default parserCommander;
