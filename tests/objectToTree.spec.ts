import { expect, test } from "@jest/globals";
import { objectToTree, TreeObject } from "../src/objectToTree";

function expectTypeError(input: unknown, message: string) {
  const run = () => objectToTree(input as TreeObject);
  expect(run).toThrow(TypeError);
  expect(run).toThrow(new TypeError(message));
}

test.each([
  ["an array", [1, 2, 3]],
  ["a string", "not an object"],
  ["null", null],
  ["a Map", new Map()],
])("throws for %s as input", (_, input) => {
  expectTypeError(input, "Input must be a plain object");
});

test("handles an empty object", () => {
  const inputObject: TreeObject = {};
  const expectedOutput = "";

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("generates correct tree for root without branches or leaves", () => {
  const inputObject: TreeObject = {
    root: null,
  };

  const expectedOutput = `root
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("generates correct tree for root with branch and leaf", () => {
  const inputObject: TreeObject = {
    root: {
      branch: null,
      leaf: null,
    },
  };

  const expectedOutput = `root
├── branch
└── leaf
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("generates correct tree for root with branch of branch and leaf of branch", () => {
  const inputObject: TreeObject = {
    root: {
      branch: { "branch of branch": null, "leaf of branch": null },
      leaf: null,
    },
  };

  const expectedOutput = `root
├── branch
│   ├── branch of branch
│   └── leaf of branch
└── leaf
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("generates correct tree for root with branch of leaf and leaf of leaf", () => {
  const inputObject: TreeObject = {
    root: {
      leaf: { "branch of leaf": null, "leaf of leaf": null },
    },
  };

  const expectedOutput = `root
└── leaf
    ├── branch of leaf
    └── leaf of leaf
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("generates correct tree for real world scenario", () => {
  const inputObject: TreeObject = {
    "Stack 2/3": {
      "Data Stores": {
        Postgres: {
          Sequelize: null,
        },
        MongoDB: {
          Mongoose: null,
        },
        Redis: null,
      },
      Processes: {
        Agile: {
          Scrum: null,
        },
        Scripting: null,
        Engineering: null,
        Design: null,
        "Code Reviews": null,
        Testing: null,
        "CI/CD": null,
        TDD: null,
        Git: {
          Gitflow: null,
          GitHub: null,
          GitLab: null,
        },
      },
    },
  };

  const expectedOutput = `Stack 2/3
├── Data Stores
│   ├── Postgres
│   │   └── Sequelize
│   ├── MongoDB
│   │   └── Mongoose
│   └── Redis
└── Processes
    ├── Agile
    │   └── Scrum
    ├── Scripting
    ├── Engineering
    ├── Design
    ├── Code Reviews
    ├── Testing
    ├── CI/CD
    ├── TDD
    └── Git
        ├── Gitflow
        ├── GitHub
        └── GitLab
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test.each([
  ["string", "not an object"],
  ["number", 1],
  ["undefined", undefined],
  ["array", [1]],
  ["Map", new Map([["k", 1]])],
  ["Set", new Set([1])],
  ["Date", new Date(0)],
])("throws with the full key path for a nested %s value", (_, value) => {
  expectTypeError(
    { root: { branch: { bad: value } } },
    "Value for key 'root.branch.bad' must be a plain object or null",
  );
});

test.each([
  ["a.b", { a: { b: undefined } }],
  ['["a.b"]', { "a.b": undefined }],
  ['[""][""]', { "": { "": undefined } }],
  ['root["Data Stores"].x', { root: { "Data Stores": { x: undefined } } }],
])("reports the unambiguous key path %s", (path, input) => {
  expectTypeError(input, `Value for key '${path}' must be a plain object or null`);
});

test("throws for circular references", () => {
  const branch: Record<string, unknown> = { leaf: null };
  branch.self = branch;

  expectTypeError({ root: { branch } }, "Circular reference at key 'root.branch.self'");
});

test("throws for a circular reference to the input itself", () => {
  const input: Record<string, unknown> = {};
  input.self = input;

  expectTypeError(input, "Circular reference at key 'self'");
});

test("allows the same object in two branches (not a cycle)", () => {
  const shared = { leaf: null };
  const inputObject: TreeObject = { root: { a: shared, b: shared } };

  expect(objectToTree(inputObject)).toBe(`root
├── a
│   └── leaf
└── b
    └── leaf
`);
});

test("renders class instances by their own enumerable fields", () => {
  class Box {
    inner = null;
  }

  expect(objectToTree({ root: new Box() } as unknown as TreeObject)).toBe(`root
└── inner
`);
});

test("renders objects without a prototype", () => {
  const branch = Object.assign(Object.create(null), { leaf: null });

  expect(objectToTree({ root: branch })).toBe(`root
└── leaf
`);
});

test("renders multiple top-level keys as separate roots", () => {
  const inputObject: TreeObject = { a: { x: null, y: null }, b: { z: null } };

  expect(objectToTree(inputObject)).toBe(`a
├── x
└── y
b
└── z
`);
});

test("orders integer-like keys first, as JavaScript does", () => {
  const inputObject: TreeObject = { root: { b: null, "2": null, a: null, "1": null } };

  expect(objectToTree(inputObject)).toBe(`root
├── 1
├── 2
├── b
└── a
`);
});
