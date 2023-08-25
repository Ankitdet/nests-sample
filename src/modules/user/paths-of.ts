import { Logger } from '@nestjs/common'

type CombineAll<T> = T extends { [name in keyof T]: infer Type } ? Type : never

export type PropertyNameMap<T, IncludeIntermediate extends boolean> = {
  [name in keyof T]: T[name] extends object
    ?
        | SubPathsOf<name, T, IncludeIntermediate>
        | (IncludeIntermediate extends true ? name : never)
    : name
}

type SubPathsOf<
  key extends keyof T,
  T,
  IncludeIntermediate extends boolean,
> = `${string & key}.${string & PathsOf<T[key], IncludeIntermediate>}`

/**
 * Extracts out the keys of the given type as dot separated paths.
 * For example:
 * {
 *   key1: string;
 *   key2: {
 *      sub1: string;
 *      sub2: string
 *   }
 * }
 *
 * Will be extracted as:
 *   'key1' | 'key2.sub1' | 'key2.sub2'
 *
 * If you provide a value of `true` for the IncludeIntermediate parameter, then it will
 * also include the object keys by themselves:
 *   'key1' | 'key2' | 'key2.sub1' | 'key2.sub2'
 *
 * This works to any depth, so you can have objects within objects, within objects, etc.
 *
 * NOTE: You cannot have circular types in this. ie. A child key cannot reference its own
 * type or a parent type.
 */
export type PathsOf<T, IncludeIntermediate extends boolean = false> = CombineAll<
  PropertyNameMap<T, IncludeIntermediate>
>

// Example types
interface LeafInterface {
  end: string
  finish: string
  complete: string
}

interface ChildInterface {
  leaf: LeafInterface
  deadEnd: true
}

interface ParentInterface {
  child1: ChildInterface
  child2: ChildInterface
  child3: ChildInterface
}
/* 
function onlyPathsOf(key: PathsOf<ParentInterface>) {
    console.log(key);
} */

function onlyPathsOfWithIntermediaries(key: PathsOf<ParentInterface, true>) {
  Logger.log(key)
}

onlyPathsOfWithIntermediaries('child1')
