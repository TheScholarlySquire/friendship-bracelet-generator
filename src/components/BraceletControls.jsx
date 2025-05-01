import React, { useState } from 'react';
import '../styles/BraceletControls.css';

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
    setAlternateColors,
    backgroundImage,
    setBackgroundImage,
    shouldRedrawBackground,
    setShouldRedrawBackground
}) => {
    const [beadShapePatternMode, setBeadShapePatternMode] = useState('manual');
    const [patternStep, setPatternStep] = useState(2); // For 'alternate-every-n'
    const [shapeA, setShapeA] = useState('circle');
    const [shapeB, setShapeB] = useState('square');
    const [customPatternText, setCustomPatternText] = useState('circle,square,hexagon,star,heart');

    const handleApplyShapePattern = () => {
        const newShapes = [];
        if (beadShapePatternMode === 'alternate-every-n') {
            for (let i = 0; i < text.length; i++) {
                if (Math.floor(i / patternStep) % 2 === 0) {
                    newShapes.push(shapeA);
                } else {
                    newShapes.push(shapeB);
                }
            }
        } else if (beadShapePatternMode === 'alternating') {
            for (let i = 0; i < text.length; i++) {
                newShapes.push(i % 2 === 0 ? shapeA : shapeB);
            }
        } else if (beadShapePatternMode === 'custom-pattern') {
            const customShapes = customPatternText.split(',').map(s => s.trim().toLowerCase());
            for (let i = 0; i < text.length; i++) {
                newShapes.push(customShapes[i % customShapes.length]);
            }
        }
        setBeadShapes(newShapes);
    };

    const generateBeadShapes = () => {
        let newShapes = [];
        if (beadShapePatternMode === 'manual') {
            // Do nothing, manual user input
            return;
        } else if (beadShapePatternMode === 'alternate-every-n') {
            for (let i = 0; i < text.length; i++) {
                if ((i + 1) % patternInterval === 0) {
                    newShapes.push(patternShapeB);
                } else {
                    newShapes.push(patternShapeA);
                }
            }
        } else if (beadShapePatternMode === 'alternating') {
            for (let i = 0; i < text.length; i++) {
                newShapes.push(i % 2 === 0 ? patternShapeA : patternShapeB);
            }
        }
        setBeadShapes(newShapes);
    };

    return (
        <>
            <div id="controls-container" className="grid auto-rows-max">
                <div id="beadText" className="optionsContainer flex justify-evenly gap-8">
                    <div className="flex-[2] flex rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-slate-400 transition p-1">
                        <input
                            id="main-input"
                            className="flex-1 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm px-3 py-2 focus:outline-none"
                            type='text'
                            placeholder='Enter text or emojis'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={20}
                        />
                        <select
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            className="bg-slate-100 text-slate-700 text-sm px-2 border-l border-slate-200 focus:outline-none"
                        >
                            <option value="Delius Swash Caps" style={{ fontFamily: 'Delius Swash Caps' }}>Option 1</option>
                            <option value="Suez One" style={{ fontFamily: 'Suez One' }}>Option 2</option>
                            <option value="Tagesschrift" style={{ fontFamily: 'Tagesschrift' }}>Option 3</option>
                            <option value="Fredericka the Great" style={{ fontFamily: 'Fredericka the Great' }}>Option 4</option>
                            <option value="Emilys Candy" style={{ fontFamily: 'Emilys Candy' }}>Option 5</option>
                            <option value="Rubik Doodle Shadow" style={{ fontFamily: 'Rubik Doodle Shadow' }}>Option 6</option>
                            <option value="Berkshire Swash" style={{ fontFamily: 'Berkshire Swash' }}>Option 7</option>
                        </select>
                    </div>
                    {/* Colour Picker */}
                    <div className="flex-[1] justify-center flex items-center gap-2 flex-[1] bg-slate-50 border border-slate-200 rounded-md px-3 py-2 p-1">
                        <label htmlFor="font-color" className="text-sm text-slate-700 whitespace-nowrap">
                            Font color:
                        </label>
                        <input
                            id="font-color"
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            className="h-6 w-6 rounded-md border border-slate-300 cursor-pointer"
                        />
                    </div>
                </div>

                <div id="beadCharms" className="optionsContainer controlsInner h-fit max-w-50%">
                    <div className="optionsContainerInner">
                        {/*Charm options*/}
                        <div className="charmOptions">
                            <div>
                                <label>Left Charm Bead: </label>
                                <input
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    type="text"
                                    maxLength="2"
                                    value={leftCharm}
                                    onChange={(e) => setLeftCharm(e.target.value)}
                                    style={{ width: '50px', marginRight: '1rem' }}
                                />
                            </div>
                            <div>
                                <label>Left Charm Shape: </label>
                                <select value={leftCharmShape} onChange={(e) => setLeftCharmShape(e.target.value)}>
                                    <option value="circle">Circle</option>
                                    <option value="heart">Heart</option>
                                    <option value="star">Star</option>
                                </select>
                            </div>
                        </div>
                        <div className="charmOptions">
                            <div>
                                <label>Right Charm Bead: </label>
                                <input
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    type="text"
                                    maxLength="2"
                                    value={rightCharm}
                                    onChange={(e) => setRightCharm(e.target.value)}
                                    style={{ width: '50px' }}
                                />
                            </div>
                            <div>
                                <label>Right Charm Shape: </label>
                                <select value={rightCharmShape} onChange={(e) => setRightCharmShape(e.target.value)}>
                                    <option value="circle">Circle</option>
                                    <option value="heart">Heart</option>
                                    <option value="star">Star</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="beadShapes" className="optionsContainer controlsInner h-fit max-w-50%">
                    <label>Shape Pattern Mode: </label>
                    <select value={beadShapePatternMode} onChange={(e) => setBeadShapePatternMode(e.target.value)}>
                        <option value="manual">Manual (each bead)</option>
                        <option value="alternate-every-n">Alternate every N beads</option>
                        <option value="alternating">Alternating shapes (A/B)</option>
                        <option value="custom-pattern">Custom pattern</option>
                    </select>

                    {/* Conditional rendering of options based on selected pattern mode */}
                    {beadShapePatternMode === 'manual' && (
                        <div className="optionsContainerInner scrollable">
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
                                    <option value="star">Star</option>
                                    <option value="heart">Heart</option>
                                </select>
                            ))}
                        </div>
                    )}

                    {beadShapePatternMode === 'alternate-every-n' && (
                        <div className="optionsContainerInner">
                            <label>Every </label>
                            <input
                                type="number"
                                min="1"
                                value={patternStep}
                                onChange={(e) => setPatternStep(parseInt(e.target.value))}
                            />
                            <label> beads use </label>
                            <select value={shapeA} onChange={(e) => setShapeA(e.target.value)}>
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                                <option value="hexagon">Hexagon</option>
                                <option value="squircle">Squircle</option>
                                <option value="star">Star</option>
                                <option value="heart">Heart</option>
                            </select>
                            <label> and then </label>
                            <select value={shapeB} onChange={(e) => setShapeB(e.target.value)}>
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                                <option value="hexagon">Hexagon</option>
                                <option value="squircle">Squircle</option>
                                <option value="star">Star</option>
                                <option value="heart">Heart</option>
                            </select>
                            <button onClick={handleApplyShapePattern}>Apply Pattern</button>
                        </div>
                    )}

                    {beadShapePatternMode === 'alternating' && (
                        <div className="optionsContainerInner">
                            <label>First Shape:</label>
                            <select value={shapeA} onChange={(e) => setShapeA(e.target.value)}>
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                                <option value="hexagon">Hexagon</option>
                                <option value="squircle">Squircle</option>
                                <option value="star">Star</option>
                                <option value="heart">Heart</option>
                            </select>
                            <label>Second Shape:</label>
                            <select value={shapeB} onChange={(e) => setShapeB(e.target.value)}>
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                                <option value="hexagon">Hexagon</option>
                                <option value="squircle">Squircle</option>
                                <option value="star">Star</option>
                                <option value="heart">Heart</option>
                            </select>
                            <button onClick={handleApplyShapePattern}>Apply Pattern</button>
                        </div>
                    )}

                    {beadShapePatternMode === 'custom-pattern' && (
                        <div className="optionsContainerInner">
                            <label>Custom Pattern (comma-separated):</label>
                            <input
                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                type="text"
                                value={customPatternText}
                                onChange={(e) => setCustomPatternText(e.target.value)}
                                placeholder="e.g., circle,circle,hexagon,star"
                            />
                            <button onClick={handleApplyShapePattern}>Apply Pattern</button>
                        </div>
                    )}
                </div>

                <div id="beadBackground" className="optionsContainer controlsInner">
                    <div className="optionsContainerInner">
                        <label>Bead background style:</label>
                        <select value={backgroundStyle} onChange={(e) => setBackgroundStyle(e.target.value)}>
                            <option value="gradient">Gradient</option>
                            <option value="solid">Solid</option>
                            <option value="alternating">Alternating</option>
                        </select>
                    </div>
                    <div className="optionsContainerInner">
                        {backgroundStyle === 'alternating' && (
                            <div>
                                <div className="labelAndOption">
                                    <label>Alternate colour 1: </label>
                                    <input
                                        type="color"
                                        value={alternateColors[0]}
                                        onChange={(e) =>
                                            setAlternateColors([e.target.value, alternateColors[1]])
                                        }
                                    />
                                </div>
                                <div className="labelAndOption">
                                    <label>Alternate colour 2: </label>
                                    <input
                                        type="color"
                                        value={alternateColors[1]}
                                        onChange={(e) =>
                                            setAlternateColors([alternateColors[0], e.target.value])
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {(backgroundStyle === 'gradient' || backgroundStyle === 'solid') && (
                            <div className="labelAndOption">
                                <div>
                                    <div className="labelAndOption">
                                        <label>Background colour 1: </label>
                                        <input type='color' value={color1} onChange={(e) => setColor1(e.target.value)} />
                                    </div>
                                    {backgroundStyle === 'gradient' && (
                                        <div className="labelAndOption">
                                            <label>Background colour 2: </label>
                                            <input type='color' value={color2} onChange={(e) => setColor2(e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="optionsContainer">
                            <div className="optionsContainerInner">
                                <label>Canvas Background:</label>
                                <select
                                value={backgroundImage}
                                onChange={(e) => {
                                    console.log('Selected background image:', e.target.value);
                                    setBackgroundImage(e.target.value)
                                    setShouldRedrawBackground(true);
                                }}>
                                    <option value="transparent">Transparent</option>
                                    <option value="solid:#ffffff">Solid Colour</option>
                                    <option value="/img/lake.jpg">Lake</option>
                                    <option value="/img/meadow.jpg">Meadow</option>
                                    <option value="/img/hilti1.jpg">hilti1</option>
                                    <option value="/img/hilti2.png">hilti2</option>
                                    <option value="/img/hilti3.jpg">hilti3</option>
                                    <option value="/img/hilti4.png">hilti4</option>
                                </select>

                                {backgroundImage?.startsWith('solid:') && (
                                  <input
                                    type="color"
                                    value={backgroundImage.split(':')[1] || '#ffffff'}
                                    onChange={(e) => {
                                      const color = e.target.value;
                                      setBackgroundImage(`solid:${color}`);
                                      setShouldRedrawBackground(true);
                                    }}
                                    style={{ marginLeft: '1rem' }}
                                  />
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default BraceletControls;
