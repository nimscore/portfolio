"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_store_1 = require("../services/session-store");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const sessionId = req.sessionId;
    const state = (0, session_store_1.getSessionState)(sessionId);
    res.json({
        order: state.order,
        selected: Array.from(state.selected),
    });
});
router.post('/', (req, res) => {
    const sessionId = req.sessionId;
    const state = (0, session_store_1.getSessionState)(sessionId);
    const { order, selected } = req.body;
    if (Array.isArray(order)) {
        state.order = order;
    }
    if (Array.isArray(selected)) {
        state.selected = new Set(selected);
    }
    res.json({ success: true });
});
router.post('/reorderFiltered', (req, res) => {
    const sessionId = req.sessionId;
    const state = (0, session_store_1.getSessionState)(sessionId);
    const { filteredOrder } = req.body;
    if (!Array.isArray(filteredOrder)) {
        res.status(400).json({ error: 'filteredOrder must be an array of IDs' });
        return;
    }
    const fullOrder = state.order;
    const filteredSet = new Set(filteredOrder);
    const positions = [];
    for (let i = 0; i < fullOrder.length; i++) {
        if (filteredSet.has(fullOrder[i])) {
            positions.push(i);
        }
    }
    positions.sort((a, b) => a - b);
    if (positions.length !== filteredOrder.length) {
        res.status(400).json({
            error: 'filteredOrder содержит ID, которые отсутствуют в общей order',
        });
        return;
    }
    const newFullOrder = [...fullOrder];
    for (let idx = 0; idx < positions.length; idx++) {
        const slot = positions[idx];
        const newId = filteredOrder[idx];
        newFullOrder[slot] = newId;
    }
    state.order = newFullOrder;
    res.json({ success: true });
});
exports.default = router;
