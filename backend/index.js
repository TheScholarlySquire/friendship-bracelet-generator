const expres = require('express');
const { createCanvas } = require('canvas');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

//Middleware
app.use(cors()); //allow cross-origin requests
app.use(bodyParser.json());

//POST /generate - generate bracelet image
app.post('/generate', (req, res) => {
    const { text, color1, color2 } = req.body;

    const canvas = createCanvas(800, 150);
    const ctx = canvas.getContext('2d');

    const beadRadius = 20;
    const spacing = 10;
    const startX = 50;
    const centerY = 75;

    const gradient = ctx.createLinearGradient (0, 0, 800, 0);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    for (let i = 0; i < text.length; i++) {
        const x = startX + i * (beadRadius * 2 + spacing);
        ctx.beginPath();
        ctx.arc(x, centerY, beadRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text[i], x, centerY);
    }

    const buffer = canvas.toBuffer('image/png');
    res.set('Content Type', 'image/png');
    res.send(buffer);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
