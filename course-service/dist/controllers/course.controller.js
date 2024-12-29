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
const mongoose_1 = __importDefault(require("mongoose"));
const S3_1 = require("../utils/S3");
class CourseController {
    constructor(courseService, categoryService, tutorService, consumerService) {
        this.createCourse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const { error } = courseSchema.validate(req.body);
                // if (error) {
                //   return res
                //     .status(HttpStatusCodes.BAD_REQUEST)
                //     .json({ message: error.message });
                // }
                console.log("req in controller ==>", req);
                if (!req.files || !Array.isArray(req.files)) {
                    return res
                        .status(common_1.HttpStatusCodes.BAD_REQUEST)
                        .json({ message: "No files uploaded" });
                }
                const createCourseRequest = {
                    body: req.body,
                    files: req.files,
                    tutor_id: req.tutor,
                };
                console.log("createCourseReq ====>", createCourseRequest);
                const message = yield this.courseService.createCourse(createCourseRequest);
                res.status(common_1.HttpStatusCodes.CREATED).json(message);
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        });
        this.getTutorCoursesByStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hit hit hit");
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const tutorId = req.params.tutorId;
                const status = req.params.status;
                let response;
                if (status == "true") {
                    response = yield this.courseService.getTutorCourses(tutorId, page, limit, true);
                }
                else if (status == "false") {
                    response = yield this.courseService.getTutorCourses(tutorId, page, limit, false);
                }
                else {
                    return res.status(common_1.HttpStatusCodes.BAD_REQUEST).json({
                        message: "Invalid status parameter. Use 'approved' or 'pending'.",
                    });
                }
                res.status(common_1.HttpStatusCodes.OK).json(response);
            }
            catch (error) {
                common_1.logger.error(`Failed to fetch courses for tutor: ${error}`);
                next(error);
            }
        });
        this.getAllCoursesForCards = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                common_1.logger.info("At getAllCourses controller");
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 100;
                const status = req.params.status === "true"; // Converts status to boolean
                common_1.logger.info(`Fetching courses with status: ${status}, page: ${page}, limit: ${limit}`);
                const response = yield this.courseService.getAllCoursesForCards(status, page, limit);
                common_1.logger.info("Courses fetched successfully");
                console.log(response);
                res.status(common_1.HttpStatusCodes.OK).json(response);
            }
            catch (error) {
                common_1.logger.error("Error in getAllCoursesForCards controller:", error);
                next(error);
            }
        });
        this.getCourseDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.courseId;
                common_1.logger.info(`Fetching course with ID: ${courseId}`);
                const courseDetails = yield this.courseService.getCourseDetails(courseId);
                if (!courseDetails) {
                    return res.status(404).json({ message: "Course not found" });
                }
                res.status(200).json(courseDetails);
            }
            catch (error) {
                common_1.logger.error(`Error in getCourseDetails controller: ${error}`);
                next(error);
            }
        });
        this.deleteCourse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const courseId = req.params.courseId;
            common_1.logger.info(`Deleting course with ID: ${courseId}`);
            try {
                const success = yield this.courseService.deleteCourse(courseId);
                if (success) {
                    res.status(200).json({ message: "Course deleted successfully" });
                }
                else {
                    res.status(404).json({ message: "Course not found" });
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.getS3UploadUrl = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { key, contentType } = req.query;
            common_1.logger.info(`${key}===> ${contentType}`);
            if (!key || !contentType) {
                return res
                    .status(400)
                    .json({ error: "Missing required query parameters: key, contentType" });
            }
            try {
                const uploadUrl = yield (0, S3_1.getUploadSignedUrl)(key, contentType);
                if (!uploadUrl) {
                    return res.status(500).json({ error: "Failed to generate upload URL" });
                }
                return res.status(200).json({ url: uploadUrl });
            }
            catch (error) {
                console.error("Error generating upload URL:", error);
                next(error);
            }
        });
        this.getS3PresignedUrl = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { filename } = req.query;
            common_1.logger.info(`${filename}`);
            if (!filename) {
                return res.status(400).json({ error: "Filename is required" });
            }
            try {
                const url = yield (0, S3_1.getObjectUrl)(filename);
                res.json({ url });
            }
            catch (error) {
                next(error);
            }
        });
        this.getLessonDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                common_1.logger.warn("here at getLessonDetails controlller");
                const { lessonIndex } = req.body;
                const { courseId } = req.params;
                console.log("courseId ===>", courseId, "lessonIndex===>", lessonIndex);
                const response = yield this.courseService.getLessonDetails(courseId, lessonIndex);
                console.log("res i con===>", response);
                return res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.approveCourse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                common_1.logger.info("hitted approve course controller");
                const { courseId } = req.params;
                const response = yield this.courseService.approveCourse(courseId);
                return res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.dataForHome = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info("Im here for fetching home page datas.......");
            try {
                const trendingCourses = yield this.courseService.getTrendingCourses();
                const newlyAddedCourses = yield this.courseService.getNewlyAddedCourses();
                const trendingCategories = yield this.categoryService.getAllCategories();
                res
                    .status(common_1.HttpStatusCodes.OK)
                    .json({ trendingCourses, newlyAddedCourses, trendingCategories });
            }
            catch (error) {
                next(error);
            }
        });
        this.editCourse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            common_1.logger.warn("Controller is ready to edit the course...");
            try {
                console.log("course for edit ===>", req.params);
                const { courseId } = req.params;
                const editedCourse = req.body;
                const updatedCourse = yield this.courseService.updateCourse(courseId, editedCourse);
                res.status(200).json({
                    message: "Course updated successfully",
                    updatedCourse,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.fetchCourses = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            common_1.logger.warn("Controller is fetch courses for store...");
            try {
                const { limit, offset, searchTerm, categories, sort } = req.query;
                console.log("Search term for courses:", req.query);
                const parsedLimit = parseInt(limit, 10) || 10;
                const parsedOffset = parseInt(offset, 10) || 0;
                const courses = yield this.courseService.fetchCourses(parsedLimit, parsedOffset, searchTerm, categories, sort);
                const allCategories = yield this.categoryService.getAllCategories();
                return res.status(200).json({ courses, categories: allCategories });
            }
            catch (error) {
                next(error);
            }
        });
        this.getDatasForAdminDashboard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                common_1.logger.info("im here for fetching admin dashboard datas");
                const numOfCourses = yield this.courseService.getCourseCount();
                common_1.logger.warn(`total courses count: ${numOfCourses}`);
                const numOfTutors = yield this.tutorService.totalTutorCount();
                common_1.logger.warn(`total tutors count: ${numOfTutors}`);
                const numOfStudents = yield this.consumerService.getStudentsCount();
                common_1.logger.warn(`total students count: ${numOfStudents}`);
                const numOfCategories = yield this.categoryService.getCategoryCount();
                common_1.logger.warn(`total category count: ${numOfCategories}`);
                res
                    .status(common_1.HttpStatusCodes.OK)
                    .json({ numOfStudents, numOfTutors, numOfCourses, numOfCategories });
            }
            catch (error) {
                next(error);
            }
        });
        this.getDatasForTutorDashboard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                common_1.logger.info("im here for fetching tutor dashboard datas");
                const tutorId = req.tutor;
                const numOfCourses = yield this.courseService.getCourseCountByTutor(tutorId);
                const avgRating = 0;
                res.status(common_1.HttpStatusCodes.OK).json({ numOfCourses, avgRating });
            }
            catch (error) {
                next(error);
            }
        });
        this.createReview = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                common_1.logger.info("Creating review for course");
                const { _id: studentId } = req.student;
                const { rating, review, tutorId, courseId } = req.body;
                // Log incoming data
                console.log("Incoming data:", {
                    studentId,
                    rating,
                    review,
                    tutorId,
                    courseId,
                });
                // Validate input
                if (!rating || !review || !tutorId) {
                    return res.status(common_1.HttpStatusCodes.BAD_REQUEST).json({
                        message: "All fields (rating, review, tutorId) are required.",
                    });
                }
                // Validate ObjectId
                if (!mongoose_1.default.Types.ObjectId.isValid(tutorId)) {
                    return res.status(common_1.HttpStatusCodes.BAD_REQUEST).json({
                        message: "Invalid tutor ID.",
                    });
                }
                const response = yield this.courseService.createReview({
                    studentId,
                    courseId,
                    rating,
                    review,
                    tutorId,
                });
                // Log response after creating the review
                console.log("Review saved:", response);
                res.status(common_1.HttpStatusCodes.CREATED).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.getReviewsByCourse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                if (!courseId || typeof courseId !== "string") {
                    return res.status(common_1.HttpStatusCodes.BAD_REQUEST).json({
                        message: "Valid Course Id required.",
                    });
                }
                console.log("courseId=====>", courseId);
                const response = yield this.courseService.getReviewsByCourse(courseId);
                res.status(common_1.HttpStatusCodes.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.getReviewsForHome = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseService.getReviewsForHome();
                res.status(common_1.HttpStatusCodes.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.getNewlyAddedCourses = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseService.getNewlyAddedCourses();
                res.status(common_1.HttpStatusCodes.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.courseService = courseService;
        this.categoryService = categoryService;
        this.tutorService = tutorService;
        this.consumerService = consumerService;
    }
}
exports.default = CourseController;
