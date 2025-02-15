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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var user1, user2, room1, room2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.users.upsert({
                        where: { email: 'user1@example.com' },
                        update: {},
                        create: {
                            username: 'user1',
                            password: 'password1',
                            email: 'user1@example.com',
                            first_name: 'User',
                            last_name: 'One',
                            age: 25,
                            address: '123 Main St',
                            sexe: 'male',
                            role: 'player',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    })];
                case 1:
                    user1 = _a.sent();
                    return [4 /*yield*/, prisma.users.upsert({
                            where: { email: 'user2@example.com' },
                            update: {},
                            create: {
                                username: 'user2',
                                password: 'password2',
                                email: 'user2@example.com',
                                first_name: 'User',
                                last_name: 'Two',
                                age: 30,
                                address: '456 Elm St',
                                sexe: 'female',
                                role: 'player',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 2:
                    user2 = _a.sent();
                    return [4 /*yield*/, prisma.rooms.create({
                            data: {
                                name: 'Room 1',
                                created_by: user1.id,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 3:
                    room1 = _a.sent();
                    return [4 /*yield*/, prisma.rooms.create({
                            data: {
                                name: 'Room 2',
                                created_by: user2.id,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 4:
                    room2 = _a.sent();
                    // Add messages to rooms
                    return [4 /*yield*/, prisma.messages.createMany({
                            data: [
                                {
                                    content: 'Hello from User 1 in Room 1',
                                    user_id: user1.id,
                                    room_id: room1.id,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                                {
                                    content: 'Hello from User 2 in Room 2',
                                    user_id: user2.id,
                                    room_id: room2.id,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                                {
                                    content: 'Another message from User 1 in Room 1',
                                    user_id: user1.id,
                                    room_id: room1.id,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                            ],
                        })];
                case 5:
                    // Add messages to rooms
                    _a.sent();
                    // Add user-room relationships
                    return [4 /*yield*/, prisma.userrooms.createMany({
                            data: [
                                {
                                    user_id: user1.id,
                                    room_id: room1.id,
                                    joined_at: new Date(),
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                                {
                                    user_id: user2.id,
                                    room_id: room2.id,
                                    joined_at: new Date(),
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                                {
                                    user_id: user1.id,
                                    room_id: room2.id,
                                    joined_at: new Date(),
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                            ],
                        })];
                case 6:
                    // Add user-room relationships
                    _a.sent();
                    console.log('Seed data created successfully');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
