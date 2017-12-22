import Api from "./api.class";

// Initialize with null for trying to get singleton method
let g = null;
if (typeof global !== "undefined" && typeof global === "object") {
  g = global;
} else if (typeof window !== "undefined") {
  g = window;
} else {
  g = {};
}


if (!g.ApiInstance) {
  g.ApiInstance = new Api();
}

export default g.ApiInstance;
