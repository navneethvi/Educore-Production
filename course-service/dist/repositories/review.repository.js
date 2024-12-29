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
const mongoose_1 = __importDefault(require("mongoose"));
class ReviewRepository {
    constructor(reviewModel, tutorModel, studentModel, courseModel) {
        this.reviewModel = reviewModel;
        this.courseModel = courseModel;
        this.studentModel = studentModel;
        this.tutorModel = tutorModel;
    }
    createReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Log incoming review data
                console.log("Creating review with data:", reviewData);
                // Check if student (reviewBy) exists
                const student = yield this.studentModel.findById(reviewData.reviewBy);
                if (!student) {
                    throw new Error(`Student with ID ${reviewData.reviewBy} does not exist.`);
                }
                console.log("Student found:", student);
                // Check if tutor exists
                const tutor = yield this.tutorModel.findById(reviewData.tutorId);
                if (!tutor) {
                    throw new Error(`Tutor with ID ${reviewData.tutorId} does not exist.`);
                }
                console.log("Tutor found:", tutor);
                // Check if course exists
                const course = yield this.courseModel.findById(reviewData.courseId);
                if (!course) {
                    throw new Error(`Course with ID ${reviewData.courseId} does not exist.`);
                }
                console.log("Course found:", course);
                // Create and save the review
                const newReview = new this.reviewModel({
                    courseId: reviewData.courseId,
                    rating: reviewData.rating,
                    review: reviewData.review,
                    courseBy: reviewData.tutorId,
                    reviewBy: reviewData.reviewBy,
                    createdAt: new Date(),
                });
                // Log before saving
                console.log("Saving review:", newReview);
                const savedReview = yield newReview.save();
                // Log saved review
                console.log("Saved review:", savedReview);
                return savedReview;
            }
            catch (error) {
                console.error("Error in creating review:", error);
                throw error;
            }
        });
    }
    getReviewsByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trimmedCourseId = courseId.trim();
            if (!mongoose_1.default.Types.ObjectId.isValid(trimmedCourseId)) {
                throw new Error("Invalid courseId format");
            }
            const objectId = new mongoose_1.default.Types.ObjectId(trimmedCourseId);
            return yield this.reviewModel
                .find({ courseId: objectId })
                .populate("reviewBy", "name image")
                .exec();
        });
    }
    getReviewsForHome() {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield this.reviewModel
                .find()
                .sort({ createdAt: -1 }) // Sort reviews by creation date in descending order
                .limit(3) // Limit to 3 most recent reviews
                .populate("reviewBy", "name image") // Populate the reviewBy field with name and image
                .populate("courseId", "title")
                .exec(); // Execute the query
            return reviews;
        });
    }
}
exports.default = ReviewRepository;
