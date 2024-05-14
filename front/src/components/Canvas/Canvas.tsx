import {useEffect, useRef} from "react";
import {Pixel} from "../../types";

const Canvas = () => {
    const data = useRef(new WebSocket('ws://localhost:8000/chat'));

    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const drawPixels = (pixelBold: Pixel[]) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pixelBold.forEach(({x, y}) => ctx.fillRect(x, y, 1, 1));
        };

        data.current.addEventListener('message', (event) => {
            const {type, pixels} = JSON.parse(event.data);

            if (type === 'init' || type === 'update') {
                drawPixels(pixels);
            }
        });

        canvas.addEventListener('mousemove', (event) => {
            if (event.buttons === 1) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const pixel = {x, y};
                data.current.send(JSON.stringify({ type: 'newPixel', pixel }));
            }
        });

    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ border: '3px solid black', borderRadius: '4px', overflow: 'hidden' }}>
                <canvas id="canvas" width="1000" height="700" style={{ border: '1px solid black' }}></canvas>
            </div>
        </div>
    );
};

export default Canvas;