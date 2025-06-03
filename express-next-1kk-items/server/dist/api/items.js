"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_store_1 = require("../services/session-store");
const generate_item_1 = require("../utils/generate-item");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    const sessionId = req.sessionId;
    const state = (0, session_store_1.getSessionState)(sessionId);
    const { offset = 0, limit = 20, search = '' } = req.query;
    const searchLower = search.toLowerCase();
    const filtered = state.order.filter(id => searchLower.length > 0
        ? `item ${id}`.toLowerCase().includes(searchLower)
        : true);
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));
    const items = paginated.map(generate_item_1.generateItem);
    res.json(items);
});
exports.default = router;
