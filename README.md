# Object to Tree

A utility function to convert JavaScript objects into visually-formatted tree structures.

## Features

- Clear tree visualization: Provides an easy-to-read representation of nested object structures.
- Error handling: Validates input data and offers informative error messages for potential issues (duplicate keys, non-object values).
- Flexibility: Works with objects of varying complexity and depth.

## Installation

```bash
$ npm i js-object-to-tree
```

## Usage

```typescript
import { objectToTree } from ('js-object-to-tree');

const exampleObject= {
  "a": {
    "b": {
      "c": null,
      "d": {
        "e": null
      },
    },
    "f": null
  }
};

const exampleTree = objectToTree(exampleObject);

console.log(exampleTree)

// Expected Output:
// a
// ├── b
// │   ├── c
// │   └── d
// │       └── e
// └── f
```

## Input Object Format

- Keys: Must be strings. JavaScript/TypeScript automatically ensure that keys within an object are unique.
- Values: Must be either objects or null. Other primitive types (string, number, boolean, etc.) are not allowed.

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
