"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    courses: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Course" }],
});
const Category = (0, mongoose_1.model)("Category", categorySchema);
exports.default = Category;
