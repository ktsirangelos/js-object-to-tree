export type TreeObject = { [key: string]: TreeNode };
export type TreeNode = TreeObject | null;

/**
 * Recursively converts an object into a tree-like string, one line per key.
 * @throws {TypeError} If the input or any value is not a plain object (values may also be `null`),
 *         or if the object contains a circular reference.
 */
export function objectToTree(input: TreeObject): string {
  if (!isPlainObject(input)) {
    throw new TypeError("Input must be a plain object");
  }

  const ancestors = new Set<object>([input]);

  function render(node: TreeObject, prefix: string, path: string, isRoot: boolean): string {
    const keys = Object.keys(node);

    return keys
      .map((key, index) => {
        const isLast = index === keys.length - 1;
        const value: unknown = node[key];
        const keyPath = appendKey(path, key);
        const line = `${isRoot ? key : `${prefix}${isLast ? "└── " : "├── "}${key}`}\n`;

        if (value === null) {
          return line;
        }

        if (!isPlainObject(value)) {
          throw new TypeError(`Value for key '${keyPath}' must be a plain object or null`);
        }

        if (ancestors.has(value)) {
          throw new TypeError(`Circular reference at key '${keyPath}'`);
        }

        ancestors.add(value);
        const childPrefix = isRoot ? "" : prefix + (isLast ? "    " : "│   ");
        const children = render(value, childPrefix, keyPath, false);
        ancestors.delete(value);

        return line + children;
      })
      .join("");
  }

  return render(input, "", "", true);
}

function appendKey(path: string, key: string): string {
  if (!/^[A-Za-z_$][\w$]*$/.test(key)) {
    return `${path}[${JSON.stringify(key)}]`;
  }
  return path ? `${path}.${key}` : key;
}

function isPlainObject(value: unknown): value is TreeObject {
  return Object.prototype.toString.call(value) === "[object Object]";
}
