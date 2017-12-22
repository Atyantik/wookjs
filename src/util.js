import _ from "lodash";

export const defaultPriority = 10;

export const sanitizeTag = function(tag) {
  if (!tag || !_.isString(tag)) {
    throw new Error(`Please provide a valid tag. Provided: ${tag}`);
  }
  return tag;
};

export const sanitizeFunction = function(func) {
  // Throw error if invalid function
  if (!func || !_.isFunction(func)) {
    throw new Error(`Please provide a valid function to add to hook. Provided: ${func}`);
  }
  return func;
};

export const sanitizePriority = function(priority) {
  // Parse Priority
  let p = parseInt(priority);

  // Throw error if not a valid priority
  if (_.isNaN(p)) throw new Error(`Invalid priority provided for hook: ${priority}`);
  if (!p) throw new Error("Priority value can be any integer except 0");
  return p;
};

export const generateHash = (str = "", namespace = "id") => {
  // Conver everything to string first
  str = (new String(str)).toString();
  namespace = namespace || "";
  let hash = 0, i, chr;
  if (str.length === 0) return `${namespace}__${hash}`;
  str = `${namespace}_${str}`;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 15) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return `${namespace}__${hash}`;
};