# JS Object to Tree

A utility function to convert JavaScript objects into visually-formatted tree structures.

## Features

- Clear tree visualization: Provides an easy-to-read representation of nested object structures.
- Error handling: Throws a `TypeError` naming the key path of invalid values and circular references.
- Flexibility: Works with objects of varying complexity and depth.
- Typed: Ships TypeScript declarations (`TreeObject`, `TreeNode`).

## Installation

```bash
$ npm i js-object-to-tree
```

## Usage

```typescript
import { objectToTree } from 'js-object-to-tree';
// or, with CommonJS: const { objectToTree } = require('js-object-to-tree');

const exampleObject = {
  "a": {
    "b": {
      "c": null,
      "d": {
        "e": null
      }
    },
    "f": null
  }
};

const exampleTree = objectToTree(exampleObject);

console.log(exampleTree);

// Output:
// a
// ├── b
// │   ├── c
// │   └── d
// │       └── e
// └── f
```

## Input Object Format

- The input and every non-`null` value must be a plain object. Anything else (arrays, primitives, `Map`, `Set`, `Date`, ...) throws a `TypeError`. For nested values the message names the key path, e.g. `Value for key 'a.b' must be a plain object or null`; keys that aren't identifiers are bracketed, e.g. `a["b.c"]`.
- Circular references throw `Circular reference at key 'a.self'`.
- Keys appear in `Object.keys` order.
- Keys are printed as-is, so sanitize untrusted input.
- Each line ends in `\n`, and `{}` returns `""`.

## Information

The `objectToTree()` function takes a JavaScript object as input and builds a string representation of its structure in a tree format. There are 6 + 1 cases to cover, all other variations of smaller or larger trees can be derived from these recursively:

```txt
0. root

root
├── 1. branch
└── 2. leaf

root
├── branch
│   ├── 3. branch of branch
│   └── 4. leaf of branch
└── leaf

root
└── leaf
    ├── 5. branch of leaf
    └── 6. leaf of leaf
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
