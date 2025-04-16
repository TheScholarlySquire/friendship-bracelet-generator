import { useState, useRef } from 'react'; //useRef to directly interact with the <canvas> DOM element.
import { useEffect } from 'react';

function drawHeart(ctx, x, y, size) {
    ctx.beginPath();

    const verticalStretch = 1.8; // stretch heart height
    const offsetY = size * 0.9; // vertical offset to keep it centered

    const topY = y - offsetY;
    const bottomY = y + size * verticalStretch - offsetY;

    ctx.moveTo(x, topY + size * 0.4); // top center

    // Left half of the heart
    ctx.bezierCurveTo(
        x - size * 1.1, topY - size * 0.2,   // upper left curve
        x - size, topY + size * 1.0,        // lower left curve
        x, bottomY                          // point
    );

    // Right half of the heart
    ctx.bezierCurveTo(
        x + size, topY + size * 1.0,        // lower right curve
        x + size * 1.1, topY - size * 0.2,  // upper right curve
        x, topY + size * 0.4                // back to top center
    );

    ctx.closePath();
}


function drawStar(ctx, cx, cy, outerRadius, points = 5) {
    const step = Math.PI / points;
    const innerRadius = outerRadius / 2;

    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
        const angle = i * step - Math.PI / 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
}

function drawSquircle(ctx, x, y, width, height, radius) {
    const left = x - width / 2;
    const top = y - height / 2;
    const right = x + width / 2;
    const bottom = y + height / 2;

    ctx.beginPath();
    ctx.moveTo(left + radius, top);
    ctx.lineTo(right - radius, top);
    ctx.quadraticCurveTo(right, top, right, top + radius);
    ctx.lineTo(right, bottom - radius);
    ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
    ctx.lineTo(left + radius, bottom);
    ctx.quadraticCurveTo(left, bottom, left, bottom - radius);
    ctx.lineTo(left, top + radius);
    ctx.quadraticCurveTo(left, top, left + radius, top);
    ctx.closePath();
}

function App() {
    const [text, setText] = useState('');
    const [color1, setColor1] = useState ('#ff69b4'); //pink
    const [color2, setColor2] = useState ('#9370DB'); //purple
    const [backgroundStyle, setBackgroundStyle] = useState('gradient'); // 'gradient' | 'solid' | 'alternating'
    const [alternateColors, setAlternateColors] = useState(['#000000', '#ffffff']); // user-defined alternating colors, default black and white
    const [font, setFont] = useState('Arial'); //font state for customizaton
    const [fontColor, setFontColor] = useState('#000000'); //font colour state for customizaton
    const [beadShapes, setBeadShapes] = useState([]); //initialize to empty array so we can have multiple bead shapes
    const [imageUrl, setImageUrl] = useState (null);
    const canvasRef = useRef(null);
    const [leftCharm, setLeftCharm] = useState('');
    const [rightCharm, setRightCharm] = useState('');
    const [leftCharmShape, setLeftCharmShape] = useState('circle');
    const [rightCharmShape, setRightCharmShape] = useState('circle');


    const generateBracelet = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const fullText = `${leftCharm}${text}${rightCharm}`;
        const fullLength = fullText.length;

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
        for (let i = 0; i < fullText.length; i++) {
            const char = fullText[i];
            const x = startX + i * (beadRadius * 2 + spacing);
            let shape = beadShapes[i] || 'circle';  // Default to 'circle' if no shape is selected

            //check if current index is a Charm
            if (i < leftCharm.length) {
                shape = leftCharmShape;
            } else if (i >= leftCharm.length + text.length) {
                shape = rightCharmShape;
            }

            //draw the bead shape
            ctx.beginPath();

            let fillStyle;

            if (backgroundStyle === 'gradient') {
                fillStyle = gradient;
            } else if (backgroundStyle === 'solid') {
                fillStyle = color1;
            } else if (backgroundStyle === 'alternating') {
                fillStyle = alternateColors[i % alternateColors.length];
            }
            ctx.fillStyle = fillStyle;

            switch (shape) {
                case 'circle':
                    ctx.arc(x, centerY, beadRadius, 0, Math.PI * 2);
                    break;
                case 'square':
                    ctx.rect(x - beadRadius, centerY - beadRadius, beadRadius * 2, beadRadius * 2);
                    break;
                case 'diamond':
                    ctx.moveTo(x, centerY - beadRadius);
                    ctx.lineTo(x + beadRadius, centerY);
                    ctx.lineTo(x, centerY + beadRadius);
                    ctx.lineTo(x - beadRadius, centerY);
                    ctx.closePath();
                    break;
                case 'squircle':
                    drawSquircle(ctx, x, centerY, beadRadius * 2, beadRadius * 2, 10);
                    break;
                case 'heart':
                    drawHeart(ctx, x, centerY, beadRadius);
                    break;
                case 'star':
                    drawStar(ctx, x, centerY, beadRadius, 5);
                    break;
                default:
                    ctx.arc(x, centerY, beadRadius, 0, Math.PI * 2);
            }

            ctx.fill();
            ctx.stroke();

            // Draw the text in the center of each bead
            ctx.fillStyle = fontColor;
            ctx.font = `20px ${font}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char, x, centerY);
        }


        // Convert canvas to image URL
        const url = canvas.toDataURL('image/png');
        setImageUrl(url);
    };

//effect allows dynamic loading
//using debounce behaviour for smooth loading (changes take effect once user 'pauses' action for 100ms)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (text) {
                generateBracelet();
            } else {
                setImageUrl(null);
            }
        }, 100); // 150ms debounce delay

        return () => clearTimeout(timeout); // cleanup to prevent stacking
        }, [
        text,
        color1,
        color2,
        font,
        fontColor,
        beadShapes,
        leftCharm,
        rightCharm,
        leftCharmShape,
        rightCharmShape,
        backgroundStyle,
        alternateColors
    ]);

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
        <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <h1>Friendship Bracelet Generator</h1>

            <input
                type='text'
                placeholder='Enter text or emojis'
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div style={{ marginTop: '1rem' }}>
                <label>Left Charm Bead: </label>
                <input
                    type="text"
                    maxLength="2"
                    value={leftCharm}
                    onChange={(e) => setLeftCharm(e.target.value)}
                    style={{ width: '50px', marginRight: '1rem' }}
                />
                <label>Right Charm Bead: </label>
                <input
                    type="text"
                    maxLength="2"
                    value={rightCharm}
                    onChange={(e) => setRightCharm(e.target.value)}
                    style={{ width: '50px' }}
                />

                <div style={{ marginTop: '1rem' }}>
                    <label>Left Charm Shape: </label>
                    <select value={leftCharmShape} onChange={(e) => setLeftCharmShape(e.target.value)}>
                        <option value="circle">Circle</option>
                        <option value="heart">Heart</option>
                        <option value="star">Star</option>
                    </select>

                    <label style={{ marginLeft: '1rem' }}>Right Charm Shape: </label>
                    <select value={rightCharmShape} onChange={(e) => setRightCharmShape(e.target.value)}>
                        <option value="circle">Circle</option>
                        <option value="heart">Heart</option>
                        <option value="star">Star</option>
                    </select>
                </div>

            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Font: </label>
                <select value={font} onChange={(e) => setFont(e.target.value)}>
                    <option value="Arial">Arial</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier</option>
                    <option value="Verdana">Verdana</option>
                </select>

                <label style={{marginLeft: '1rem' }}>Font colour: </label>
                <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                />
            </div>
            <div style={{ marginTop: '1rem' }}>
                <label>Select Shapes for Each Bead: </label>
                <div>
                    {Array.from({ length: text.length }).map((_, index) => (//maps an array from the options so beads can have multiple shapes; lists dropdown for each bead for LOTS of customization
                        <select
                            key={index}
                            value={beadShapes[index] || 'circle'}
                            onChange={(e) => {
                                const newShapes = [...beadShapes];
                                newShapes[index] = e.target.value;
                                setBeadShapes(newShapes);
                            }}
                        >
                            <option value="circle">Circle</option>
                            <option value="square">Square</option>
                            <option value="hexagon">Hexagon</option>
                            <option value="squircle">Squircle</option>
                        </select>
                    ))}
                </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <label>Background style:</label>
                <select value={backgroundStyle} onChange={(e) => setBackgroundStyle(e.target.value)}>
                    <option value="gradient">Gradient</option>
                    <option value="solid">Solid</option>
                    <option value="alternating">Alternating</option>
                </select>
            </div>

            {backgroundStyle === 'alternating' && (
                <div style={{ marginTop: '0.5rem' }}>
                    <label>Alternate colour 1: </label>
                    <input
                        type="color"
                        value={alternateColors[0]}
                        onChange={(e) =>
                            setAlternateColors([e.target.value, alternateColors[1]])
                        }
                    />
                    <label style={{ marginLeft: '1rem' }}>Alternate colour 2: </label>
                    <input
                        type="color"
                        value={alternateColors[1]}
                        onChange={(e) =>
                            setAlternateColors([alternateColors[0], e.target.value])
                        }
                    />
                </div>
            )}

            {(backgroundStyle === 'gradient' || backgroundStyle === 'solid') && (
                <div style={{ marginTop: '1rem' }}>
                    <label>Background colour 1: </label>
                    <input type='color' value={color1} onChange={(e) => setColor1(e.target.value)} />
                    {backgroundStyle === 'gradient' && (
                        <>
                            <label style={{ marginLeft: '1rem' }}>Background colour 2: </label>
                            <input type='color' value={color2} onChange={(e) => setColor2(e.target.value)} />
                        </>
                    )}
                </div>
            )}


            <canvas
                ref={canvasRef}
                width={800}
                height={150}
                style={{ display: 'none' }} //hidden because we're converting the canvas drawing to an image, displayed with <img> tag
            />


            {imageUrl &&  (
                <div>
                    <h2>Your bracelet</h2>
                    <img src={imageUrl} alt='bracelet' />
                </div>
            )}
        </div>
    );
}

export default App;
