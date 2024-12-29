"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tutorSchema = new mongoose_1.Schema({
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
    password: {
        type: String,
    },
    bio: {
        type: String,
        default: ""
    },
    is_blocked: {
        type: Boolean,
        required: true,
        default: false
    },
    is_verified: {
        type: Boolean,
        required: true,
        default: false
    },
    image: {
        type: String,
        default: 'https://freesvg.org/img/abstract-user-flat-4.png'
    },
    followers: {
        type: [String],
        default: []
    }
});
const Tutor = (0, mongoose_1.model)('Tutor', tutorSchema);
exports.default = Tutor;
