import express from 'express';
import cors from 'cors';
import expressWs from 'express-ws';
import {Pixel} from "./types";

const app = express();
const getWs = expressWs(app);
const port = 8000;

app.use(cors());

const router = express.Router();
app.use(router);
const pixelTyp: Pixel[] = [];

const pixelUpdate = () => {
    const wss = getWs.getWss();
    const payload = JSON.stringify({type: 'update', pixels: pixelTyp});

    wss.clients.forEach((user) => {
        if (user.readyState === WebSocket.OPEN) {
            user.send(payload);
        }
    });
};

router.ws('/chat', (ws, _req) => {
    ws.send(JSON.stringify({type: 'init', pixels: pixelTyp}));

    ws.on('message', (message: string) => {
        const {type, pixel} = JSON.parse(message);

        if (type === 'newPixel') {
            pixelTyp.push(pixel);
            pixelUpdate();
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected!!');
    });
});

app.listen(port, () => {
    console.log(`Сервер стартовал на ${port} порту!`);
});