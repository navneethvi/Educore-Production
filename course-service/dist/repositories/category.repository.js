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
class CategoryRepository {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    findCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryModel.findOne({ name }).exec();
        });
    }
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("name in repository ===>", name);
            const category = new this.categoryModel({ name });
            return yield category.save();
        });
    }
    getCategories(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryModel.find().skip(skip).limit(limit).exec();
        });
    }
    getCategoryCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryModel.countDocuments().exec();
        });
    }
    deleteCategoryById(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.categoryModel.findByIdAndDelete(category_id);
            return result !== null;
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryModel.find();
        });
    }
    totalCategoryCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryModel.countDocuments();
        });
    }
}
exports.default = CategoryRepository;
