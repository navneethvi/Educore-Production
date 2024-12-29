"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    interests: {
        type: [String],
    },
    is_blocked: {
        type: Boolean,
        required: true,
        default: false
    },
    image: {
        type: String,
        default: 'https://freesvg.org/img/abstract-user-flat-4.png'
    },
    following: {
        type: [String]
    }
});
const Student = (0, mongoose_1.model)('Student', studentSchema);
exports.default = Student;
