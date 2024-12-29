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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@envy-core/common");
const consumer_service_1 = __importDefault(require("../services/consumer.service"));
const tutor_repository_1 = __importDefault(require("../repositories/tutor.repository"));
const tutor_model_1 = __importDefault(require("../models/tutor.model"));
const student_repository_1 = __importDefault(require("../repositories/student.repository"));
const student_model_1 = __importDefault(require("../models/student.model"));
class ConsumerController {
    constructor(consumerService) {
        this.consumerService = consumerService;
    }
    handleTutorCreated(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = message.value ? message.value.toString() : null;
                if (value) {
                    common_1.logger.info(`Received message: ${value}`);
                    const tutorData = JSON.parse(value);
                    yield this.consumerService.createTutor(tutorData);
                    common_1.logger.info(`Successfully processed tutor: ${tutorData.id}`);
                }
                else {
                    common_1.logger.error("Received empty message in 'tutor-created' topic.");
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    common_1.logger.error(`Error in handleTutorCreated: ${error.message}`);
                }
                else {
                    common_1.logger.error(`Unexpected error in handleTutorCreated: ${String(error)}`);
                }
            }
        });
    }
    handleStudentCreated(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = message.value ? message.value.toString() : null;
                if (value) {
                    common_1.logger.info(`Received message: ${value}`);
                    const studentData = JSON.parse(value);
                    yield this.consumerService.createStudent(studentData);
                    common_1.logger.info(`Successfully processed tutor: ${studentData.id}`);
                }
                else {
                    common_1.logger.error("Received empty message in 'student-created' topic.");
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    common_1.logger.error(`Error in handleTutorCreated: ${error.message}`);
                }
                else {
                    common_1.logger.error(`Unexpected error in handleTutorCreated: ${String(error)}`);
                }
            }
        });
    }
}
const tutorRepository = new tutor_repository_1.default(tutor_model_1.default);
const studentRepository = new student_repository_1.default(student_model_1.default);
const consumerService = new consumer_service_1.default(tutorRepository, studentRepository);
exports.default = new ConsumerController(consumerService);
