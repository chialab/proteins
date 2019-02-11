declare module '@chialab/proteins' {
    // clone.js
    export { default as clone } from '@chialab/proteins/src/clone';

    // equivalent.js
    export { default as equivalent } from '@chialab/proteins/src/equivalent';

    // events.js
    export * from '@chialab/proteins/src/events';

    // factory.js
    import * as Factory from '@chialab/proteins/src/factory';

    export { Factory };

    // keypath.js
    import * as keypath from '@chialab/proteins/src/keypath';

    export { keypath };

    // merge.js
    export { default as merge } from '@chialab/proteins/src/merge';

    // mixin.js
    export { default as mix, Mixin } from '@chialab/proteins/src/mixin';

    // observable.js
    export { default as Observable } from '@chialab/proteins/src/observable';

    // proto.js
    import * as Proto from '@chialab/proteins/src/proto';

    export { Proto };

    // symbolic.js
    export { default as Symbolic } from '@chialab/proteins/src/symbolic';

    // types.js
    export * from '@chialab/proteins/src/types';

    // url.js
    import * as Url from '@chialab/proteins/src/url';

    export { Url };
}

declare module '@chialab/proteins/src/clone' {
    export default function clone<T>(obj: T, callback?: Function): T;
}

declare module '@chialab/proteins/src/equivalent' {
    export default function equivalent(obj1: any, obj2: any): boolean;
}

declare module '@chialab/proteins/src/events' {
    export function on(scope: any, event: string, callback: Function): Function;
    export function off(scope: any, event: string, callback?: Function): void;
    export function trigger(scope: any, event: string, ...args): void;
}

declare module '@chialab/proteins/src/factory' {
    import { Mixin } from '@chialab/proteins/src/mixin';

    export const CONTEXT_SYM: Symbol;
        export const CONFIG_SYM: Symbol;
        export const LISTENERS_SYM: Symbol;

        export interface IFactory {
            CONTEXT_SYM: Symbol;

            initialize(...args): any;
            init(Factory: { new(...args): BaseFactory }, ...args: any[]): BaseFactory;
            destroy(): any;
        }

        export interface IEmitter extends IFactory {
            LISTENERS_SYM: Symbol;

            on(event: string, callback: Function): Function;
            off(event: string, callback: Function): void;
            trigger(event: string, ...args: any[]): Promise<any>;
            listen(object: BaseFactory, event: string, callback: Function): Function;
            unlisten(object: BaseFactory, event: string, callback: Function): void;
        }

        export interface IConfigurable extends IFactory {
            CONFIG_SYM: Symbol;

            readonly defaultConfig: Object;

            config(configuration: Object): Object;
            config(option: string, value: any): Object;
        }

        export interface IInjectable extends IFactory {
            readonly inject: BaseFactory[];
        }

        export const FactoryMixin: Mixin<IFactory>;
        export const EmitterMixin: Mixin<IEmitter>;
        export const ConfigurableMixin: Mixin<IConfigurable>;
        export const InjectableMixin: Mixin<IInjectable>;

        export class BaseFactory implements IFactory {
            static readonly SYM: Symbol;

            CONTEXT_SYM: Symbol;

            public initialize(...args): any;
            public init(Factory: { new(...args): BaseFactory }, ...args: any[]): BaseFactory;
            public destroy(): any;
        }

        export class Emitter implements IEmitter {
            static readonly SYM: Symbol;

            CONTEXT_SYM: Symbol;
            LISTENERS_SYM: Symbol;

            public initialize(...args): any;
            public init(Factory: { new(...args): BaseFactory }, ...args: any[]): BaseFactory;
            public destroy(): any;

            public on(event: string, callback: Function): Function;
            public off(event: string, callback: Function): void;
            public trigger(event: string, ...args: any[]): Promise<any>;
            public listen(object: BaseFactory, event: string, callback: Function): Function;
            public unlisten(object: BaseFactory, event: string, callback: Function): void;
        }

        export class Configurable implements IConfigurable {
            static readonly SYM: Symbol;

            CONTEXT_SYM: Symbol;
            CONFIG_SYM: Symbol;
            readonly defaultConfig: Object;

            public initialize(...args): any;
            public init(Factory: { new(...args): BaseFactory }, ...args: any[]): BaseFactory;
            public destroy(): any;

            public config(configuration: Object): Object;
            public config(option: string, value: any): Object;
        }

        export class Factory implements IFactory, IEmitter, IConfigurable, IInjectable {
            static readonly SYM: Symbol;

            CONTEXT_SYM: Symbol;
            LISTENERS_SYM: Symbol;
            CONFIG_SYM: Symbol;
            readonly defaultConfig: Object;
            readonly inject: BaseFactory[];

            public initialize(...args): any;
            public init(Factory: { new(...args): BaseFactory }, ...args: any[]): BaseFactory;
            public destroy(): any;

            public on(event: string, callback: Function): Function;
            public off(event: string, callback: Function): void;
            public trigger(event: string, ...args: any[]): Promise<any>;
            public listen(object: BaseFactory, event: string, callback: Function): Function;
            public unlisten(object: BaseFactory, event: string, callback: Function): void;
            public config(configuration: Object): Object;
            public config(option: string, value: any): Object;
        }
}

declare module '@chialab/proteins/src/keypath' {
    export function get(object: any, path: string): any;
    export function set(object: any, path: string, value: any, ensure?: boolean): any;
    export function has(object: any, path: string): boolean;
    export function ensure(object: any, path: string, value: any): any;
    export function insert(object: any, path: string, value: any, index: number): any[];
    export function empty(object: any, path: string): any;
    export function del(object: any, path: string): any;
}

declare module '@chialab/proteins/src/merge' {
    export default function merge(...objects: any[]): any;
}

declare module '@chialab/proteins/src/mixin' {
    export type Mixin<T> = (constructor: { new(...args): any }) => { new (...args): T };

    export default function mix(constructor: new(...args) => any): {
        has(mixin: Mixin<any>): boolean;
        with(...mixins: Array<Mixin<any>>): new(...args) => any;
    }
}

declare module '@chialab/proteins/src/observable' {
    export default class Observable {
        static reobserve(data: any): void;

        constructor(data: any);
    }
}

declare module '@chialab/proteins/src/proto' {
    export interface IPropertyDescriptor {
        get?: () => any;
        set?: (value: any) => any;
        value?: any;
    }

    export function walk(constructor: Function, callback: Function): void;
    export function entries(constructor: Function, filter?: () => boolean): {
        [key: string]: IPropertyDescriptor,
    };
    export function methods(constructor: Function): {
        [key: string]: IPropertyDescriptor,
    };
    export function properties(constructor: Function): {
        [key: string]: IPropertyDescriptor,
    };
    export function reduce(constructor: Function, property: string): IPropertyDescriptor[];
    export function has(constructor: Function, property: string): boolean;
    export function get(constructor: Function): any;
    export function set(constructor: Function, proto: any): void;
    export function extend(proto1: any, proto2: any): Object;
    export function reconstruct(constructor: Function): Object;
}

declare module '@chialab/proteins/src/symbolic' {
    export default function Symbolic(name: string): Symbol;
}

declare module '@chialab/proteins/src/types' {
    export function isFunction(ref: any): boolean;
    export function isString(ref: any): boolean;
    export function isNumber(ref: any): boolean;
    export function isBoolean(ref: any): boolean;
    export function isDate(ref: any): boolean;
    export function isObject(ref: any): boolean;
    export function isUndefined(ref: any): boolean;
    export function isArray(ref: any): boolean;
    export function isFalsy(ref: any): boolean;
}

declare module '@chialab/proteins/src/url' {
    export interface IUrl {
        origin: string;
        host: string;
        hostname: string;
        port: string;
        username: string;
        password: string;
        pathname: string;
        search: string;
        hash: string;
    }

    export function parse(url: string): IUrl;
    export function serialize(object: any, prefix?: string, chunkFn?: Function): string;
    export function unserialize(search: string): {
        [key: string]: string | string[];
    };
    export function join(...paths: string[]): string;
    export function resolve(base: string, relative: string): string;
    export function isAbsoluteUrl(url: string): boolean;
    export function isDataUrl(url: string): boolean;
    export function isLocalUrl(url: string): boolean;

    export class SearchParams {
        public readonly url: Url;

        public keys(): string[];
        public values(): string[] | Array<string[]>;
        public entries(): Array<{
            0: string;
            1: any;
        }>;
        public get(param: string): string | string[];
        public has(param: string): boolean;
        public set(param: string, value: any): void;
        public delete(param: string): void;
        public sort(): void;
        public toString: string;
    }

    export class Url {
        public href: string;

        constructor(path: string, baseUrl?: string);
        join(...paths: string[]): Url;
        resolve(path: string[]): Url;
        isAbsoluteUrl(): boolean;
        isDataUrl(): boolean;
        isLocalUrl(): boolean;
        toString(): string;
    }
}