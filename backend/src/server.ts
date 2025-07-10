import express, { Express, Router } from 'express'
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors'
import http, { Server as HttpServer } from 'http'


const app: Express = express();
const server: HttpServer = http.createServer(app);
const io: Server = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const messageModel = new mongoose.Schema({
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
})
const Message = mongoose.model('Message', messageModel)


app.use(cors());

(async (): Promise<void> => {
    try {
        console.clear();
        try {
            await mongoose.connect("mongodb+srv://asadbekrajabov1337:ASADBEK1337@cluster0.vcopo4u.mongodb.net/chat/messages");
        } catch (error) {
            console.error('Error while connecting to db: ',error);
        }
        server.listen(5000, (): void => {
            console.log('Server is running on port 5000');
        });
    } catch (err) {
        console.error(err);
        process.exit(1)
    }
})()



io.on('connection', (socket: Socket): void => {
    interface Message {
        msg: string,
        username: string,
        date: Date,
    }
    socket.on('myMessage', async (msg: Message): Promise<void> => {
        console.log('Frontenddan keldi:', msg);
        try {
            const dbMsg = await Message.create(msg);
            console.log('db', dbMsg);
            io.emit('serverMessage', JSON.stringify(msg));
        } catch (err) {
            console.error('Xatolik:', err);
            socket.emit('serverMessage', 'Xatolik yuz berdi');
        }
    });
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        console.error('Xatolik:', err);
        res.status(500).send('Xatolik yuz berdi');
    }
});
