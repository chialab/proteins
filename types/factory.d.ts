/**
 * Symbol for Factory context.
 * @type {Symbolic}
 */
export const CONTEXT_SYM: typeof Symbolic;
/**
 * Symbol for Factory configuration.
 * @type {Symbolic}
 */
export const CONFIG_SYM: typeof Symbolic;
/**
 * Symbol for Factory listeners.
 * @type {Symbolic}
 */
export const LISTENERS_SYM: typeof Symbolic;
export function FactoryMixin(SuperClass: Function): Function;
export function EmitterMixin(SuperClass: Function): Function;
export function ConfigurableMixin(SuperClass: Function): Function;
export function InjectableMixin(SuperClass: Function): Function;
declare const BaseFactory_base: any;
export class BaseFactory extends BaseFactory_base {
    [x: string]: any;
}
declare const Emitter_base: any;
export class Emitter extends Emitter_base {
    [x: string]: any;
}
declare const Configurable_base: any;
export class Configurable extends Configurable_base {
    [x: string]: any;
}
declare const Factory_base: any;
export class Factory extends Factory_base {
    [x: string]: any;
}
import Symbolic from "./symbolic.js";
export {};
