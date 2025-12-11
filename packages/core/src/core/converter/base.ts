import { SnapshotFileExtension } from '@/core/snapshot/config';

import { Element, toJSON, toYAML } from '@swagger-api/apidom-core';

type ConverterExtension = SnapshotFileExtension;

export class Converter {
  constructor() {}
  private getApiDomConverter(extension: ConverterExtension): typeof toJSON | typeof toYAML {
    switch (extension) {
      case 'yaml':
        return toYAML;
      case 'json':
      default:
        return toJSON;
    }
  }
  fromApiDom<T extends Element = Element>(element: T, extension: ConverterExtension): string {
    return this.getApiDomConverter(extension)(element);
  }
  fromJson<T extends Object>(json: T, readable: boolean = false): string {
    return JSON.stringify(json, null, readable ? 2 : 0);
  }
  fromText<T extends Object>(text: string, extension: ConverterExtension): T {
    let o: T;
    switch (extension) {
      case 'json':
      default:
        o = JSON.parse(text) as T;
        break;
    }
    return o;
  }
}
