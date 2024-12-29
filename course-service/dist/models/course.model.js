"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String },
    level: { type: String },
    thumbnail: { type: String },
    tutor_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Tutor", required: true },
    is_approved: { type: Boolean, default: false },
    enrollments: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    price: { type: Number },
    lessons: [{
            title: { type: String },
            goal: { type: String },
            video: { type: String },
            materials: { type: String },
            homework: { type: String },
        }],
});
const Course = (0, mongoose_1.model)("Course", courseSchema);
exports.default = Course;
