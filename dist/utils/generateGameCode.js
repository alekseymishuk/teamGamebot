"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGameCode = generateGameCode;
function generateGameCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
