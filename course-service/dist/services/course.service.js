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
const kafkaClient_1 = require("../events/kafkaClient");
const mongoose_1 = __importDefault(require("mongoose"));
class CourseService {
    constructor(courseRepository, tutorRepository, reviewRepository) {
        this.courseRepository = courseRepository;
        this.tutorRepository = tutorRepository;
        this.reviewRepository = reviewRepository;
    }
    createCourse(req) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Request in service:", req.body);
            const uploadedFiles = this.extractUploadedFiles(req.body);
            const courseData = this.prepareCourseData(req, uploadedFiles);
            console.log("Before saving in service");
            const newCourse = yield this.courseRepository.save(courseData);
            const edited = newCourse;
            yield (0, kafkaClient_1.sendMessage)("course-created", {
                edited,
            });
            return "Course created successfully";
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extractUploadedFiles(body) {
        return [
            { filename: body.thumbnail },
            ...body.lessons.map((lesson) => ({
                video: lesson.video,
                materials: lesson.materials,
                homework: lesson.homework,
            })),
        ];
    }
    prepareCourseData(req, uploadedFiles) {
        const thumbnailFile = uploadedFiles[0].filename;
        return {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            level: req.body.level,
            thumbnail: thumbnailFile,
            tutor_id: req.tutor_id,
            price: req.body.price,
            lessons: req.body.lessons.map((lesson) => ({
                title: lesson.title,
                goal: lesson.goal,
                video: lesson.video || "",
                materials: lesson.materials || "",
                homework: lesson.homework || "",
            })),
        };
    }
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = (yield this.courseRepository.findById(courseId));
                if (!course) {
                    throw new Error("Course not found");
                }
                const courseData = {
                    _id: course._id,
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    level: course.level,
                    thumbnail: course.thumbnail,
                    tutor_id: course.tutor_id,
                    price: course.price,
                    lessons: course.lessons.map((lesson) => ({
                        title: lesson.title,
                        goal: lesson.goal,
                        video: lesson.video,
                        materials: lesson.materials,
                        homework: lesson.homework,
                    })),
                };
                return courseData;
            }
            catch (error) {
                common_1.logger.error(`Error fetching course by ID ${courseId}: ${error}`);
                throw new Error("Error fetching course details");
            }
        });
    }
    getTutorCourses(tutorId, page, limit, isApproved) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info(`Fetching ${isApproved ? "approved" : "pending"} courses for tutor with ID ${tutorId}`);
            try {
                const courses = yield this.courseRepository.getCoursesByTutor(tutorId, page, limit, isApproved);
                console.log(courses);
                if (!courses || courses.length === 0) {
                    return {
                        data: [],
                        totalPages: 0,
                        loading: false,
                        error: `No ${isApproved ? "approved" : "pending"} courses found for this tutor`,
                    };
                }
                const totalCourses = yield this.courseRepository.countCoursesByTutor(tutorId, isApproved);
                const totalPages = Math.ceil(totalCourses / limit);
                return {
                    data: courses,
                    totalPages: totalPages,
                    loading: false,
                    error: "",
                };
            }
            catch (error) {
                common_1.logger.error(`Error fetching courses: ${error}`);
                throw new Error(`Unable to fetch ${isApproved ? "approved" : "pending"} courses for this tutor`);
            }
        });
    }
    getAllCoursesForCards(isApproved, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info(`Fetching courses for admin with status ${isApproved}`);
            try {
                const skip = (page - 1) * limit;
                const courses = yield this.courseRepository.getAllCourses(isApproved, page, limit, skip);
                if (!courses || courses.length === 0) {
                    throw new Error("No courses found");
                }
                // Process courses to add tutor data
                const processedCourses = yield Promise.all(courses.map((course) => __awaiter(this, void 0, void 0, function* () {
                    const thumbnailUrl = course.thumbnail;
                    const tutorData = yield this.tutorRepository.findTutor(course.tutor_id);
                    return Object.assign(Object.assign({}, course), { thumbnail: thumbnailUrl, tutor_data: tutorData ? [tutorData] : [] });
                })));
                return processedCourses;
            }
            catch (error) {
                common_1.logger.error(`Error fetching courses: ${error}`);
                throw new Error("Error fetching courses");
            }
        });
    }
    getCourseDetails(course_id) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info(`Fetching a course.....${course_id}`);
            try {
                const courseData = yield this.courseRepository.getCourseDetails(course_id);
                if (!courseData) {
                    throw new Error("No course found");
                }
                const tutorData = yield this.tutorRepository.findTutor(courseData.tutor_id);
                if (!tutorData) {
                    throw new Error("Tutor not found");
                }
                const courseWithTutor = {
                    course_id: courseData._id,
                    title: courseData.title,
                    description: courseData.description,
                    category: courseData.category,
                    level: courseData.level,
                    thumbnail: courseData.thumbnail,
                    tutor_id: courseData.tutor_id,
                    is_approved: courseData.is_approved,
                    price: courseData.price,
                    lessons: courseData.lessons,
                    tutor_name: tutorData.name,
                    tutor_image: tutorData.image,
                    tutor_bio: tutorData.bio,
                };
                return courseWithTutor;
            }
            catch (error) {
                common_1.logger.error(`Error fetching course: ${error}`);
                throw new Error("Error fetching course");
            }
        });
    }
    deleteCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info(`Deleting a course with ID: ${courseId}`);
            try {
                const result = yield this.courseRepository.deleteCourse(courseId);
                return result;
            }
            catch (error) {
                common_1.logger.error(`Error deleting course: ${error}`);
                throw new Error("Error deleting course");
            }
        });
    }
    getLessonDetails(courseId, lessonIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info(`Fetching lesson details for courseId: ${courseId}, lessonIndex: ${lessonIndex}`);
            try {
                const response = yield this.courseRepository.getLessonDetails(courseId, lessonIndex);
                console.log(response);
                return response;
            }
            catch (error) {
                common_1.logger.error(`Error fetching lesson details: ${error}`);
                throw new Error("Error fetching lesson details");
            }
        });
    }
    approveCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info(`Approving course...`);
            try {
                const approve = yield this.courseRepository.approveCourse(courseId);
                return approve;
            }
            catch (error) {
                common_1.logger.error(`Error approving course${error}`);
                throw new Error("Error approving course");
            }
        });
    }
    getTrendingCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trendingCourses = yield this.courseRepository.getTrendingCourses();
                if (!trendingCourses) {
                    throw new Error("No trending courses found.");
                }
                const processedCourses = yield Promise.all(trendingCourses.map((course) => __awaiter(this, void 0, void 0, function* () {
                    const tutorData = yield this.tutorRepository.findTutor(course.tutor_id);
                    return Object.assign(Object.assign({}, course), { tutor_data: tutorData ? [tutorData] : [] });
                })));
                return processedCourses;
            }
            catch (error) {
                common_1.logger.error(`Error fetching trending courses${error}`);
                throw new Error("Error fetching trending courses");
            }
        });
    }
    getNewlyAddedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newlyAddedCourses = yield this.courseRepository.getNewlyAddedCourses();
                if (!newlyAddedCourses) {
                    throw new Error("No newly added courses found.");
                }
                console.log(newlyAddedCourses);
                const processedCourses = yield Promise.all(newlyAddedCourses.map((course) => __awaiter(this, void 0, void 0, function* () {
                    const tutorData = yield this.tutorRepository.findTutor(course.tutor_id);
                    return Object.assign(Object.assign({}, course), { tutor_data: tutorData ? [tutorData] : [] });
                })));
                return processedCourses;
            }
            catch (error) {
                common_1.logger.error(`Error fetching newly added courses: ${error}`);
                throw new Error("Error fetching newly added courses");
            }
        });
    }
    updateCourse(courseId, editedCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info("Updating course...");
            console.log(editedCourse);
            const existingCourse = yield this.courseRepository.findById(courseId);
            if (!existingCourse) {
                throw new Error("Course not found");
            }
            existingCourse.title = editedCourse.title || existingCourse.title;
            existingCourse.description =
                editedCourse.description || existingCourse.description;
            existingCourse.category = editedCourse.category || existingCourse.category;
            existingCourse.level = editedCourse.level || existingCourse.level;
            existingCourse.price = editedCourse.price || existingCourse.price;
            existingCourse.createdAt =
                editedCourse.createdAt || existingCourse.createdAt;
            if (editedCourse.lessons && Array.isArray(editedCourse.lessons)) {
                existingCourse.lessons = editedCourse.lessons.map((editedLesson) => ({
                    title: editedLesson.title,
                    goal: editedLesson.goal,
                    video: editedLesson.video || "",
                    materials: editedLesson.materials || "",
                    homework: editedLesson.homework || "",
                }));
            }
            if (editedCourse.thumbnail) {
                existingCourse.thumbnail = editedCourse.thumbnail;
            }
            const edited = yield existingCourse.save();
            yield (0, kafkaClient_1.sendMessage)("course-updated", { edited });
            return edited;
        });
    }
    fetchCourses(limit, offset, searchTerm, categories, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this.courseRepository.fetchCourses(limit, offset, searchTerm, categories, sort);
            if (!courses) {
                throw new Error("No courses found.");
            }
            const simplifiedCourses = yield Promise.all(courses.map((course) => __awaiter(this, void 0, void 0, function* () {
                const tutorData = yield this.tutorRepository.findTutor(course.tutor_id);
                return {
                    _id: course._id,
                    title: course.title,
                    category: course.category,
                    description: course.description,
                    enrollments: course.enrollments,
                    is_approved: course.is_approved,
                    level: course.level,
                    price: course.price,
                    thumbnail: course.thumbnail,
                    lessonsCount: course.lessons.length,
                    tutor: tutorData
                        ? {
                            _id: tutorData._id,
                            image: tutorData.image,
                            name: tutorData.name,
                            email: tutorData.email,
                            phone: tutorData.phone,
                        }
                        : null,
                };
            })));
            return simplifiedCourses;
        });
    }
    getCourseCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseRepository.totalCourseCount();
        });
    }
    getCourseCountByTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseRepository.countCoursesByTutor(tutorId, true);
        });
    }
    createReview(_a) {
        return __awaiter(this, arguments, void 0, function* ({ studentId, courseId, rating, review, tutorId, }) {
            const newReview = yield this.reviewRepository.createReview({
                reviewBy: new mongoose_1.default.Types.ObjectId(studentId),
                tutorId: new mongoose_1.default.Types.ObjectId(tutorId),
                courseId: new mongoose_1.default.Types.ObjectId(courseId),
                rating,
                review,
            });
            return newReview;
        });
    }
    getReviewsByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewRepository.getReviewsByCourse(courseId);
        });
    }
    getReviewsForHome() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewRepository.getReviewsForHome();
        });
    }
}
exports.default = CourseService;
