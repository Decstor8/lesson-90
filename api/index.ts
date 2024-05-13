import express from 'express';
import cors from 'cors';
import expressWs from 'express-ws';
import {IncomingMessage} from "http";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();
const activeConnections = {};

router.ws('/chat', (ws, req) => {
    const id = crypto.randomUUID();
    console.log('client connected', id);
    activeConnections[id] = ws;
    let username = 'Anonymous'

    ws.send('Hello you have connected to the chat! ')

    ws.on('message', (message) => {
        console.log(message.toString());
        const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;
        if (parsedMessage.type === 'SET_USERNAME') {
            username = parsedMessage.payload;
        } else if (parsedMessage.type === 'SEND_MESSAGE') {
            Object.values(activeConnections).forEach(connection => {
                const outgoingMessage = {type: 'NEW_MESSAGE', payload: connection};
                connection.send(JSON.stringify(outgoingMessage));
            })
        }
    });

    ws.on('close', () => {
        console.log('client desconnected! id = ', id)
        delete activeConnections[id];
    })
});