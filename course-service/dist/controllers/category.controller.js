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
class CategoryController {
    constructor(categoryService) {
        this.addCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                console.log("name in controller ===>", name);
                const category = yield this.categoryService.createCategory(name);
                res.status(common_1.HttpStatusCodes.CREATED).json(category);
            }
            catch (error) {
                next(error);
            }
        });
        this.getCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                console.log("Fetching categories for page:", page);
                const { categories, totalPages } = yield this.categoryService.getCategories(page, limit);
                res.status(common_1.HttpStatusCodes.OK).json({
                    categories,
                    totalPages,
                    currentPage: page,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                console.log("hereeeeeee ===>", _id);
                yield this.categoryService.deleteCategory(_id);
                res
                    .status(common_1.HttpStatusCodes.OK)
                    .json({ message: "Category deleted successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                common_1.logger.info("Fetching all categories...");
                const response = yield this.categoryService.getAllCategories();
                res.status(common_1.HttpStatusCodes.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.categoryService = categoryService;
    }
}
exports.default = CategoryController;
