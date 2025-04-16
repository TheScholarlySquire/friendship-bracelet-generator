import { useState, useRef } from 'react'; //useRef to directly interact with the <canvas> DOM element.

function App() {
    const [text, setText] = useState('');
    const [color1, setColor1] = useState ('#ff69b4'); //pink
    const [color2, setColor2] = useState ('#9370DB'); //purple
    const [imageUrl, setImageUrl] = useState (null);
    const canvasRef = useRef(null);


    const generateBracelet = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const beadRadius = 20;
        const spacing = 10;
        const startX = 50;
        const centerY = 75;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        //each iteration will be a single bead on the bracelet
        for (let i = 0; i < text.length; i++) {
            const x = startX + i * (beadRadius * 2 + spacing);

            // Bead
            ctx.beginPath();
            ctx.arc(x, centerY, beadRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.stroke();

            // Text inside the bead
            ctx.fillStyle = '#000';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text[i], x, centerY);
        }

        // Convert canvas to image URL
        const url = canvas.toDataURL('image/png');
        setImageUrl(url);
    };


    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <h1>Friendship Bracelet Generator</h1>

            <input
                type='text'
                placeholder='Enter text or emojis'
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <div style={{ marginTop: '1rem' }}>
                <label>Colour 1: </label>
                <input type='color' value={color1} onChange={(e) => setColor1(e.target.value)} />
                <label style={{ marginLeft: '1rem' }}>Colour 2: </label>
                <input type='color' value={color2} onChange={(e) => setColor2(e.target.value)} />
            </div>

            <button onClick={generateBracelet}>Generate Bracelet</button>

            <canvas
                ref={canvasRef}
                width={800}
                height={150}
                style={{ display: 'none' }} //hidden because we're converting the canvas drawing to an image, displayed with <img> tag
            />


            {imageUrl &&  (
                <div style={{ marginTop: '2rem' }}>
                    <h2>Your bracelet</h2>
                    <img src={imageUrl} alt='bracelet' />
                </div>
            )}
        </div>
    );
}

export default App;
