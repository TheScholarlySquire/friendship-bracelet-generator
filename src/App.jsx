import React, { useState, useEffect, useRef } from 'react';
import { drawHeart, drawStar, drawSquircle } from './utils/canvasShapes';
import BeadCanvas from './components/BeadCanvas';
import BraceletControls from './components/BraceletControls';
import './App.css';

// Debounced effect custom hook
function useDebouncedEffect(callback, dependencies, delay) {
    const timeoutRef = useRef();

    useEffect(() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            callback();
        }, delay);

        return () => clearTimeout(timeoutRef.current);
    }, dependencies);
}

function App() {
    const [text, setText] = useState('');
    const [color1, setColor1] = useState('#ff69b4'); // pink
    const [color2, setColor2] = useState('#9370DB'); // purple
    const [backgroundStyle, setBackgroundStyle] = useState('gradient'); // 'gradient' | 'solid' | 'alternating'
    const [alternateColors, setAlternateColors] = useState(['#000000', '#ffffff']); // user-defined alternating colors
    const [font, setFont] = useState('Arial'); // font state for customization
    const [fontColor, setFontColor] = useState('#000000'); // font color state for customization
    const [beadShapes, setBeadShapes] = useState([]); // initialize to empty array
    const [imageUrl, setImageUrl] = useState(null);
    const canvasRef = useRef(null);
    const [leftCharm, setLeftCharm] = useState('');
    const [rightCharm, setRightCharm] = useState('');
    const [leftCharmShape, setLeftCharmShape] = useState('circle');
    const [rightCharmShape, setRightCharmShape] = useState('circle');

    // Effect to update bead shapes based on text length
    useEffect(() => {
        setBeadShapes((prevShapes) => {
            const newShapes = [...prevShapes];
            while (newShapes.length < text.length) {
                newShapes.push('circle');
            }
            return newShapes.slice(0, text.length);
        });
    }, [text]);

    return (
        <div id="bracelet-main">
            <h1>Friendship Bracelet Generator</h1>

            {/* Pass all necessary props to BraceletControls */}
            <BraceletControls
                text={text}
                setText={setText}
                font={font}
                setFont={setFont}
                fontColor={fontColor}
                setFontColor={setFontColor}
                leftCharm={leftCharm}
                setLeftCharm={setLeftCharm}
                rightCharm={rightCharm}
                setRightCharm={setRightCharm}
                leftCharmShape={leftCharmShape}
                setLeftCharmShape={setLeftCharmShape}
                rightCharmShape={rightCharmShape}
                setRightCharmShape={setRightCharmShape}
                beadShapes={beadShapes}
                setBeadShapes={setBeadShapes}
                backgroundStyle={backgroundStyle}
                setBackgroundStyle={setBackgroundStyle}
                color1={color1}
                setColor1={setColor1}
                color2={color2}
                setColor2={setColor2}
                alternateColors={alternateColors}
                setAlternateColors={setAlternateColors}
            />

            {/* Pass the necessary props to BeadCanvas for rendering */}
            <BeadCanvas
                text={text}
                color1={color1}
                color2={color2}
                backgroundStyle={backgroundStyle}
                alternateColors={alternateColors}
                beadShapes={beadShapes}
                fontColor={fontColor}
                font={font}
                leftCharm={leftCharm}
                rightCharm={rightCharm}
                leftCharmShape={leftCharmShape}
                rightCharmShape={rightCharmShape}
            />
        </div>
    );
}

export default App;
