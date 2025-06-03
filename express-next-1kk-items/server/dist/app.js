"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const items_1 = __importDefault(require("./api/items"));
const state_1 = __importDefault(require("./api/state"));
const session_1 = __importDefault(require("./middleware/session"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(session_1.default);
app.use('/api/items', items_1.default);
app.use('/api/state', state_1.default);
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
