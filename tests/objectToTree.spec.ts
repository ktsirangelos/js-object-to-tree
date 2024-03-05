import { expect, test } from "@jest/globals";
import { objectToTree, TreeNode } from "../src/objectToTree";

test("throws error for input: array", () => {
  const inputObject = [1, 2, 3];

  expect(() => {
    objectToTree(inputObject as any);
  }).toThrow("Arrays are not allowed as input");
});

test("throws error for input: non-object", () => {
  const inputObject = "not an object";

  expect(() => {
    objectToTree(inputObject as any);
  }).toThrow("Input object must be a non-null object");
});

test("throws error for input: null", () => {
  const inputObject = null;

  expect(() => {
    objectToTree(inputObject as any);
  }).toThrow("Input object must be a non-null object");
});

test("throws error for non-object or non-null value", () => {
  const inputObject = {
    root: "not an object or not null",
  };

  expect(() => {
    objectToTree(inputObject as any);
  }).toThrow("Value for key 'root' must be either an object or null");
});

test("handles an empty object", () => {
  const inputObject: TreeNode = {};
  const expectedOutput = "";

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("generates correct tree for root without branches or leaves", () => {
  const inputObject: TreeNode = {
    root: null,
  };

  const expectedOutput = `root
`;

  expect(objectToTree(inputObject)).toBe(expectedOutput);
});

test("generates correct tree for root with branch and leaf", () => {
  const inputObject: TreeNode = {
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
  const inputObject: TreeNode = {
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
  const inputObject: TreeNode = {
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
  const inputObject: TreeNode = {
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
