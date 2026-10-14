const fs = require("fs");
const path = require("path");

// strip-json-comments is ESM-only, so it has to be imported dynamically
const loadJsonData = async (file) => {
  const { default: stripJsonComments } = await import("strip-json-comments");
  const text = fs.readFileSync(path.join(__dirname, "../src/data", file), "utf8");
  return JSON.parse(stripJsonComments(text));
};

module.exports = { loadJsonData };
