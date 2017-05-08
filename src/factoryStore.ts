export interface FactoryMap {
  factory: Function;
  isExported: boolean;
}

export default new Map<string, FactoryMap>();
