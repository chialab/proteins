/**
 * Merge two objects into a new one.
 *
 * @method merge
 * @param {...Object|Array} objects The objects to merge.
 * @return {Object} The merged object.
 */
declare function merge(...objects: (Object | any[])[]): Object;
declare namespace merge {
    function config(options?: {
        mergeObjects: boolean;
        joinArrays: boolean;
        strictMerge: boolean;
    }): Function;
}
export default merge;
