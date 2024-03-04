/**
 * Converts a JavaScript object into a visual tree-like representation.
 * @param {Object} object - The JavaScript object to convert into a tree.
 * @returns {string} The visual representation of the object as a tree.
 * @throws {Error} If the input object is not a non-null object,
 *                 if keys in the input object are not unique,
 *                 or if the value for any key is neither an object nor null.
 */
export const objectToTree = function (
  object: { [key: string]: any },
  prefix = "",
  isRoot = true,
): string {
  let tree = "";

  if (typeof object !== "object" || object === null) {
    throw new Error("Input object must be a non-null object");
  }

  const currentKeys = Object.keys(object);

  const uniqueKeys = new Set(currentKeys);
  if (uniqueKeys.size !== currentKeys.length) {
    throw new Error("Keys in the input object must be unique");
  }

  currentKeys.forEach((key, index) => {
    const isLast = index === currentKeys.length - 1;

    tree += `${prefix}${isRoot ? "" : isLast ? "└── " : "├── "}${key}\n`;

    if (object[key] !== null && typeof object[key] === "object") {
      let childPrefix = isRoot ? prefix : prefix + (isLast ? "    " : "│   ");

      try {
        tree += objectToTree(object[key], childPrefix, false);
      } catch (error) {
        throw new Error(
          `Error processing key '${key}': ${(error as Error).message}`,
        );
      }
    } else if (object[key] !== null) {
      throw new Error(
        `Value for key '${key}' must be either an object or null`,
      );
    }
  });

  return tree;
};
