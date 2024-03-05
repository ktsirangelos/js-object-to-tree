export type TreeNode = {
  [key: string]: null | TreeNode;
} | null;

/**
 * Converts a JavaScript object into a visual tree-like representation.
 * @param inputObject - The JavaScript object to convert into a tree.
 * @param linePrefix - The prefix to use for each line in the tree.
 * @param isRootNode - Whether the current object is the root node.
 * @returns The visual representation of the object as a tree.
 * @throws If the input object is not a non-null object,
 *         if keys in the input object are not unique,
 *         or if the value for any key is neither an object nor null.
 */
export const objectToTree = function (
  inputObject: TreeNode,
  linePrefix = "",
  isRootNode = true,
): string {
  if (Array.isArray(inputObject)) {
    throw new Error("Arrays are not allowed as input");
  }

  if (typeof inputObject !== "object" || inputObject === null) {
    throw new Error("Input object must be a non-null object");
  }

  let tree = "";
  const currentKeys = Object.keys(inputObject);

  currentKeys.forEach((key, index) => {
    const isLast = index === currentKeys.length - 1;

    tree += `${linePrefix}${isRootNode ? "" : isLast ? "└── " : "├── "}${key}\n`;

    if (inputObject[key] !== null && typeof inputObject[key] === "object") {
      let childPrefix = isRootNode
        ? linePrefix
        : linePrefix + (isLast ? "    " : "│   ");

      try {
        tree += objectToTree(inputObject[key], childPrefix, false);
      } catch (error) {
        throw new Error(
          `Error processing key '${key}': ${(error as Error).message}`,
        );
      }
    } else if (inputObject[key] !== null) {
      throw new Error(
        `Value for key '${key}' must be either an object or null`,
      );
    }
  });

  return tree;
};
