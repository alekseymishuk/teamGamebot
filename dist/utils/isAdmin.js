"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = isAdmin;
const ADMIN_IDS = [123456789]; // ← твой Telegram ID
function isAdmin(userId) {
    return ADMIN_IDS.includes(userId);
}
