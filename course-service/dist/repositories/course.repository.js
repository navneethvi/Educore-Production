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
const common_1 = require("@envy-core/common");
class CourseRepository {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    save(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = new this.courseModel(courseData);
            return yield course.save();
        });
    }
    findById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseModel.findById(courseId);
        });
    }
    getCoursesByTutor(tutor_id, page, limit, isApproved) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.logger.info(`Fetching courses with params: tutorId: ${tutor_id}, page: ${page}, limit: ${limit}, isApproved: ${isApproved}`);
            return yield this.courseModel
                .aggregate([
                {
                    $match: {
                        is_approved: isApproved,
                        tutor_id: new mongoose_1.default.Types.ObjectId(tutor_id),
                    },
                },
                {
                    $project: {
                        _id: 1,
                        category: 1,
                        title: 1,
                        price: 1,
                        thumbnail: 1,
                        lessoncount: { $size: "$lessons" },
                        enrollments: 1,
                    },
                },
                {
                    $skip: (page - 1) * limit,
                },
                {
                    $limit: limit,
                },
            ])
                .exec();
        });
    }
    countCoursesByTutor(tutor_id, isApproved) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseModel
                .find({ tutor_id: tutor_id, is_approved: isApproved })
                .countDocuments()
                .exec();
        });
    }
    getAllCourses(isApproved, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            common_1.logger.info(isApproved);
            const courses = yield this.courseModel
                .aggregate([
                {
                    $match: { is_approved: isApproved }, // Filter by is_approved status
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        category: 1,
                        level: 1,
                        thumbnail: 1,
                        tutor_id: 1,
                        is_approved: 1,
                        enrollments: 1,
                        price: 1,
                        lessons: { $size: "$lessons" },
                    },
                },
                { $skip: skip },
                { $limit: limit },
            ])
                .exec();
            return courses;
        });
    }
    getCourseDetails(course_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseModel.findOne({ _id: course_id }).exec();
        });
    }
    deleteCourse(course_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.courseModel.deleteOne({ _id: course_id });
                return result.deletedCount > 0;
            }
            catch (error) {
                console.error("Error deleting course:", error);
                return false;
            }
        });
    }
    getLessonDetails(courseId, lessonIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessonDetails = yield this.courseModel
                    .aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(courseId),
                        },
                    },
                    {
                        $project: {
                            lesson: { $arrayElemAt: ["$lessons", lessonIndex] },
                        },
                    },
                    {
                        $project: {
                            title: "$lesson.title",
                            goal: "$lesson.goal",
                            video: "$lesson.video",
                            materials: "$lesson.materials",
                            homework: "$lesson.homework",
                        },
                    },
                ])
                    .exec();
                if (lessonDetails.length === 0 || !lessonDetails[0]) {
                    return null;
                }
                return lessonDetails[0];
            }
            catch (error) {
                console.error("Error fetching lesson details:", error);
                return null;
            }
        });
    }
    approveCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourse = yield this.courseModel.findByIdAndUpdate(courseId, { is_approved: true }, { new: true });
                if (!updatedCourse) {
                    console.log(`Course with ID ${courseId} not found.`);
                    return false;
                }
                console.log(`Course approved:`, updatedCourse);
                return true;
            }
            catch (error) {
                console.error("Error approving course:", error);
                return false;
            }
        });
    }
    getTrendingCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trendingCourses = yield this.courseModel
                    .find({ is_approved: true })
                    .sort({ enrollments: -1 })
                    .limit(4)
                    .select("_id title thumbnail price enrollments category tutor_id")
                    .lean();
                return trendingCourses;
            }
            catch (error) {
                console.error("Error fetching trending courses:", error);
                return undefined;
            }
        });
    }
    getNewlyAddedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newlyAddedCourses = yield this.courseModel
                    .find({ is_approved: true })
                    .sort({ _id: -1 })
                    .limit(4)
                    .select("_id title thumbnail price enrollments category tutor_id")
                    .lean();
                return newlyAddedCourses;
            }
            catch (error) {
                console.error("Error fetching newly added courses:", error);
                return undefined;
            }
        });
    }
    fetchCourses(limit, offset, searchTerm, categories, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchQuery = { is_approved: true };
            if (searchTerm) {
                searchQuery.title = { $regex: searchTerm, $options: 'i' };
            }
            if (typeof categories === 'string') {
                categories = categories.split(',');
            }
            if (Array.isArray(categories) && categories.length > 0) {
                searchQuery.category = { $in: categories };
            }
            const coursesQuery = this.courseModel.find(searchQuery).skip(offset).limit(limit);
            if (sort) {
                coursesQuery.sort(sort);
            }
            const courses = yield coursesQuery;
            return courses;
        });
    }
    totalCourseCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseModel.countDocuments();
        });
    }
}
exports.default = CourseRepository;
