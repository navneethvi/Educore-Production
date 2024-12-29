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
class TutorRepository {
    constructor(tutorModel) {
        this.tutorModel = tutorModel;
    }
    findTutor(tutor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.tutorModel.findOne({ _id: tutor_id }).exec();
            }
            catch (error) {
                common_1.logger.error(`Error finding tutor: ${error}`);
                throw new Error("Error finding tutor");
            }
        });
    }
    createTutor(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = new this.tutorModel(tutorData);
                return yield tutor.save();
            }
            catch (error) {
                common_1.logger.error(`Error creating tutor: ${error}`);
                throw new Error("Error creating tutor");
            }
        });
    }
    totalTutorCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tutorModel.countDocuments();
        });
    }
}
exports.default = TutorRepository;
