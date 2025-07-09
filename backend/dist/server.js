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
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const messageModel = new mongoose_1.default.Schema({
    msg: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    }
});
const Message = mongoose_1.default.model('Message', messageModel);
app.use((0, cors_1.default)());
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.clear();
        yield mongoose_1.default.connect('mongodb://localhost:27017/messages');
        server.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}))();
io.on('connection', (socket) => {
    socket.on('myMessage', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Frontenddan keldi:', msg);
        try {
            const dbMsg = yield Message.create(msg);
            console.log('db', dbMsg);
            socket.emit('serverMessage', 'Xabaringiz qabul qilindi: ' + JSON.stringify(msg));
        }
        catch (err) {
            console.error('Xatolik:', err);
            socket.emit('serverMessage', 'Xatolik yuz berdi');
        }
    }));
});
app.get('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message.find();
        res.json(messages);
    }
    catch (err) {
        console.error('Xatolik:', err);
        res.status(500).send('Xatolik yuz berdi');
    }
}));
