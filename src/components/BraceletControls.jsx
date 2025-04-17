import React from 'react';

const BraceletControls = ({
    text,
    setText,
    font,
    setFont,
    fontColor,
    setFontColor,
    leftCharm,
    setLeftCharm,
    rightCharm,
    setRightCharm,
    leftCharmShape,
    setLeftCharmShape,
    rightCharmShape,
    setRightCharmShape,
    beadShapes,
    setBeadShapes,
    backgroundStyle,
    setBackgroundStyle,
    color1,
    setColor1,
    color2,
    setColor2,
    alternateColors,
    setAlternateColors
}) => {
    return (
        <>
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
            </div>

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

            <div style={{ marginTop: '1rem' }}>
                <label>Font: </label>
                <select value={font} onChange={(e) => setFont(e.target.value)}>
                    <option value="Arial">Arial</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier</option>
                    <option value="Verdana">Verdana</option>
                </select>

                <label style={{ marginLeft: '1rem' }}>Font colour: </label>
                <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                />
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Select Shapes for Each Bead: </label>
                <div>
                    {Array.from({ length: text.length }).map((_, index) => (
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
        </>
    );
};

export default BraceletControls;
