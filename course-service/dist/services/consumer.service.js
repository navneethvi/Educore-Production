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
class ConsumerService {
    constructor(tutorRepository, studentRepository) {
        this.tutorRepository = tutorRepository;
        this.studentRepository = studentRepository;
    }
    createTutor(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(tutorData);
            yield this.tutorRepository.createTutor(tutorData);
        });
    }
    createStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(studentData);
            yield this.studentRepository.createStudent(studentData);
        });
    }
    getStudentsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentRepository.totalStudentsCount();
        });
    }
}
exports.default = ConsumerService;
