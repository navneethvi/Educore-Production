"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@envy-core/common");
class StudentRepository {
    constructor(StudentModel) {
        this.studentModel = StudentModel;
    }
    findStudent(student_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.studentModel.findOne({ _id: student_id }).exec();
            }
            catch (error) {
                common_1.logger.error(`Error finding Student: ${error}`);
                throw new Error("Error finding Student");
            }
        });
    }
    createStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("student=>", studentData);
                const student = new this.studentModel(studentData);
                return yield student.save();
            }
            catch (error) {
                common_1.logger.error(`Error creating Student: ${error}`);
                throw new Error("Error creating Student");
            }
        });
    }
    totalStudentsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentModel.countDocuments();
        });
    }
}
exports.default = StudentRepository;
