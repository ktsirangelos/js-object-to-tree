import { expect, test } from "@jest/globals";
import { objectToTree } from "./";

test("objectToTree function correctly converts object to tree format", () => {
  const inputObject = {
    a: {
      b: {
        c: null,
        d: {
          e: null,
        },
      },
      f: null,
    },
  };

  const expectedOutput = `a
├── b
│   ├── c
│   └── d
│       └── e
└── f
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("objectToTree throws error for non-object input", () => {
  // Non-object input
  const inputObject = "not an object";

  expect(() => {
    objectToTree(inputObject as any); // Casting to any to bypass TypeScript error
  }).toThrow("Input object must be a non-null object");
});

test("objectToTree throws error for non-object or null value", () => {
  // Non-object or null value
  const inputObject = {
    a: "not an object or null",
  };

  expect(() => {
    objectToTree(inputObject);
  }).toThrow("Value for key 'a' must be either an object or null");
});

test("objectToTree generates correct tree for root with branches and leaves", () => {
  // Root with branches and leaves
  const inputObject = {
    root: {
      branch1: null,
      branch2: {
        leaf1: null,
      },
    },
  };

  const expectedOutput = `root
├── branch1
└── branch2
    └── leaf1
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("objectToTree generates correct tree for root with nested branches and leaves", () => {
  // Root with nested branches and leaves
  const inputObject = {
    root: {
      branch1: {
        branchOfBranch1: null,
      },
      leaf1: null,
    },
  };

  const expectedOutput = `root
├── branch1
│   └── branchOfBranch1
└── leaf1
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("objectToTree generates correct tree for root with nested leaves", () => {
  // Root with nested leaves
  const inputObject = {
    root: {
      leaf1: {
        branchOfLeaf1: null,
      },
      leaf2: null,
    },
  };

  const expectedOutput = `root
├── leaf1
│   └── branchOfLeaf1
└── leaf2
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});
