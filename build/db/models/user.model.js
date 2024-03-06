var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique, } from 'sequelize-typescript';
let UserModel = class UserModel extends Model {
};
__decorate([
    PrimaryKey,
    Default(DataType.UUIDV4),
    Column(DataType.UUID),
    __metadata("design:type", String)
], UserModel.prototype, "id", void 0);
__decorate([
    AllowNull(false),
    Unique,
    Column(DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    AllowNull(false),
    Unique,
    Column(DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "phone", void 0);
__decorate([
    AllowNull(false),
    Unique,
    Column(DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    Column(DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "role", void 0);
__decorate([
    Column(DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "name", void 0);
__decorate([
    Column(DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "surname", void 0);
__decorate([
    Default(''),
    Column(DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "personalUrl", void 0);
__decorate([
    Default({}),
    Column(DataType.JSONB),
    __metadata("design:type", Object)
], UserModel.prototype, "paymentInfo", void 0);
UserModel = __decorate([
    Table({
        timestamps: true,
    })
], UserModel);
export { UserModel };
//# sourceMappingURL=user.model.js.map