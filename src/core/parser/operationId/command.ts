import { ParserCommandHandler } from '@/core/parser/command';
import { refractorPluginOperationIdParser } from '@/core/parser/operationId/ns/combined';
import { refractableParser } from '@/core/parser/types/refractable';
import { isOpenApi2, isOpenApi3x } from '@/core/predicate';

const operationIdCommand: ParserCommandHandler[] = [
  refractableParser('operationId', isOpenApi2, refractorPluginOperationIdParser),
  refractableParser('operationId', isOpenApi3x, refractorPluginOperationIdParser),
];
export default operationIdCommand;
