import { useState } from 'react';
import axios from 'axios';

function App() {
    const [text, setText] = useState('');
    const [color1, setColor1] = useState ('#ff69b4'); //pink
    const [color2, setColor2] = useState ('#9370DB'); //purple
    const [imageUrl, setImageUrl] = useState (null);

    const handleGenerate = async () => {
        try {
            const response = await axios.post('http://localhost:5000/generate', {
                text,
                color1,
                color2,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            });

            const url = URL.createObjectURL(response.data);
            setImageUrl(url);
        } catch (error) {
            console.error('Failed to generate bracelet image', error.response || error);
        }
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

            <button style={{ marginTop: '1rem' }} onClick={handleGenerate}>
                Generate Bracelet
            </button>

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
