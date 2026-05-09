"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: (_a = process.env.DATABASE_URL) !== null && _a !== void 0 ? _a : "dev.db",
    },
});
//# sourceMappingURL=drizzle.config.js.map