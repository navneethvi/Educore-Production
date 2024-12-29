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
const CustomError_1 = __importDefault(require("@envy-core/common/build/errors/CustomError"));
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield this.categoryRepository.findCategory(name);
            if (existingCategory) {
                throw new CustomError_1.default(common_1.HttpStatusCodes.BAD_REQUEST, "Category with this name already exists");
            }
            const newCategory = yield this.categoryRepository.createCategory(name);
            return newCategory;
        });
    }
    getCategories(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [categories, totalCount] = yield Promise.all([
                this.categoryRepository.getCategories(skip, limit),
                this.categoryRepository.getCategoryCount(),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return { categories, totalPages };
        });
    }
    deleteCategory(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.categoryRepository.deleteCategoryById(category_id);
            console.log("successsss", success);
            if (!success) {
                throw new CustomError_1.default(common_1.HttpStatusCodes.NOT_FOUND, "Category not found");
            }
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.categoryRepository.getAllCategories();
            return categories;
        });
    }
    getCategoryCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.totalCategoryCount();
        });
    }
}
exports.default = CategoryService;
