import React, { useState } from 'react';
import '../styles/BraceletControls.css';
import GraphemeSplitter from 'grapheme-splitter';

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

    const splitter = new GraphemeSplitter();
    const graphemes = splitter.splitGraphemes(text);

    const handleApplyShapePattern = () => {
        const newShapes = [];

        if (beadShapePatternMode === 'alternate-every-n') {
            for (let i = 0; i < graphemes.length; i++) {
                if (Math.floor(i / patternStep) % 2 === 0) {
                    newShapes.push(shapeA);
                } else {
                    newShapes.push(shapeB);
                }
            }
        } else if (beadShapePatternMode === 'alternating') {
            for (let i = 0; i < graphemes.length; i++) {
                newShapes.push(i % 2 === 0 ? shapeA : shapeB);
            }
        } else if (beadShapePatternMode === 'custom-pattern') {
            const customShapes = customPatternText.split(',').map(s => s.trim().toLowerCase());
            for (let i = 0; i < graphemes.length; i++) {
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
            for (let i = 0; i < graphemes.length; i++) {
                if ((i + 1) % patternInterval === 0) {
                    newShapes.push(patternShapeB);
                } else {
                    newShapes.push(patternShapeA);
                }
            }
        } else if (beadShapePatternMode === 'alternating') {
            for (let i = 0; i < graphemes.length; i++) {
                newShapes.push(i % 2 === 0 ? patternShapeA : patternShapeB);
            }
        }
        setBeadShapes(newShapes);
    };

    return (
        <>
            <div id="controls-container" className="flex flex-wrap">
                <div id="beadText" className="optionsContainer flex gap-8">
                    <div className="flex-[2] flex rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-slate-400 transition p-1">
                        <input
                            id="main-input"
                            className="flex-1 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm px-3 py-2 focus:outline-none"
                            type='text'
                            placeholder='Enter text or emojis'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={30}
                        />
                        <select
                            id="fontSelect"
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
                    <div className="flex-[1] justify-center flex items-center gap-2">
                        <label htmlFor="font-color" className="text-sm text-slate-700 whitespace-nowrap font-label">
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

                <div id="beadCharms" className="optionsContainer controlsInner grow-1 flex align-center">
                    <div className="optionsContainerInner w-full">
                        {/*Charm options*/}
                        <div className="charmOptions flex flex-nowrap">
                            <div className="flex justify-between w-55 items-center">
                                <label className="font-label">Left Charm Bead: </label>
                                <input
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow text-center"
                                    type="text"
                                    maxLength="2"
                                    value={leftCharm}
                                    onChange={(e) => setLeftCharm(e.target.value)}
                                    style={{ width: '50px'}}
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="font-label">Left Charm Shape: </label>
                                <select className="shapeDropdown" value={leftCharmShape} onChange={(e) => setLeftCharmShape(e.target.value)}>
                                    <option className="material-symbols-outlined" value="circle" >&#xe836;</option>
                                    <option className="material-symbols-outlined" value="heart">&#xe87d;</option>
                                    <option className="material-symbols-outlined" value="star">&#xe838;</option>
                                </select>
                            </div>
                        </div>
                        <div className="charmOptions w-full">
                            <div className="flex justify-between w-55 items-center">
                                <label className="font-label">Right Charm Bead: </label>
                                <input
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow text-center"
                                    type="text"
                                    maxLength="2"
                                    value={rightCharm}
                                    onChange={(e) => setRightCharm(e.target.value)}
                                    style={{ width: '50px' }}
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="font-label">Right Charm Shape: </label>
                                <select className="shapeDropdown" value={rightCharmShape} onChange={(e) => setRightCharmShape(e.target.value)}>
                                    <option className="material-symbols-outlined" value="circle" >&#xe836;</option>
                                    <option className="material-symbols-outlined" value="heart">&#xe87d;</option>
                                    <option className="material-symbols-outlined" value="star">&#xe838;</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="beadBackground" className="optionsContainer controlsInner grow-3 flex flex-col align-center">
                    <div className="optionsContainerInner flex flex-wrap justify-evenly">
                        <label className="font-label">Bead background style:</label>
                        <select
                            className="font-label font-label rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition w-max"
                            value={backgroundStyle}
                            onChange={(e) => setBackgroundStyle(e.target.value)}
                        >
                            <option value="gradient">Gradient</option>
                            <option value="solid">Solid</option>
                            <option value="alternating">Alternating</option>
                        </select>
                    </div>
                    <div className="optionsContainerInner flex flex-wrap justify-evenly">
                        {backgroundStyle === 'alternating' && (
                            <div className="">
                                <div className="labelAndOption">
                                    <label className="font-label">Alternate colour 1: </label>
                                    <input
                                        className="h-6 w-6 rounded-md border border-slate-300 cursor-pointer"
                                        type="color"
                                        value={alternateColors[0]}
                                        onChange={(e) =>
                                            setAlternateColors([e.target.value, alternateColors[1]])
                                        }
                                    />
                                </div>
                                <div className="labelAndOption">
                                    <label className="font-label">Alternate colour 2: </label>
                                    <input
                                        className="h-6 w-6 rounded-md border border-slate-300 cursor-pointer"
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
                            <div className="labelAndOption ">
                                <div>
                                    <div className="labelAndOption">
                                        <label className="font-label">Background colour 1: </label>
                                        <input
                                                className="h-6 w-6 rounded-md border border-slate-300 cursor-pointer"
                                                type='color'
                                                value={color1}
                                                onChange={(e) => setColor1(e.target.value)}
                                            />
                                    </div>
                                    {backgroundStyle === 'gradient' && (
                                        <div className="labelAndOption">
                                            <label className="font-label">Background colour 2: </label>
                                            <input
                                                className="h-6 w-6 rounded-md border border-slate-300 cursor-pointer"
                                                type='color'
                                                value={color2}
                                                onChange={(e) => setColor2(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="optionsContainer ">
                            <div className="optionsContainerInner flex flex-col items-center">
                                <label className="font-label">Canvas Background:</label>
                                <div className="flex flex-nowrap">
                                    <select
                                        className="font-label font-label rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition w-max"
                                        value={backgroundImage}
                                        onChange={(e) => {
                                            console.log('Selected background image:', e.target.value);
                                            setBackgroundImage(e.target.value)
                                            setShouldRedrawBackground(true);
                                        }}>
                                        <option className="font-label" value="transparent">Transparent</option>
                                        <option className="font-label" value="solid:#ffffff">Solid Colour</option>
                                        <option className="font-label" value="/img/meadow.jpg">Meadow</option>
                                        <option className="font-label" value="/img/hilti1.jpg">hilti1</option>
                                        <option className="font-label" value="/img/hilti2.png">hilti2</option>
                                        <option className="font-label" value="/img/hilti3.jpg">hilti3</option>
                                        <option className="font-label" value="/img/hilti4.png">hilti4</option>
                                    </select>

                                    {backgroundImage?.startsWith('solid:') && (
                                        <input
                                            className="h-6 w-6 rounded-md border border-slate-300 cursor-pointer"
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

                <div id="beadShapes" className="optionsContainer controlsInner w-full flex flex-col flex-nowrap ">
                    <label className="font-label">Shape Patterns: </label>
                    <select
                        className="font-label rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition"
                        value={beadShapePatternMode}
                        onChange={(e) => setBeadShapePatternMode(e.target.value)}>
                            <option value="manual">Manual (each bead)</option>
                            <option value="alternate-every-n">Alternate every N beads</option>
                            <option value="alternating">Alternating shapes (A/B)</option>
                            <option value="custom-pattern">Custom pattern</option>
                    </select>

                    {/* Conditional rendering of options based on selected pattern mode */}
                    {beadShapePatternMode === 'manual' && (
                        <div className="optionsContainerInner scrollable overflow-y-auto">
                            {graphemes.map((_, index) => (
                                <select
                                    className="shapeDropdown rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition"
                                    key={index}
                                    value={beadShapes[index] || 'circle'}
                                    onChange={(e) => {
                                        const newShapes = [...beadShapes];
                                        newShapes[index] = e.target.value;
                                        setBeadShapes(newShapes);
                                    }}
                                >
                                    <option className="material-symbols-outlined" value="circle" >&#xe836;</option>
                                    <option className="material-symbols-outlined" value="square">&#xeb36;</option>
                                    <option className="material-symbols-outlined" value="hexagon">&#xeb39;</option>
                                    <option className="material-symbols-outlined" value="squircle">&#xe841;</option>
                                    <option className="material-symbols-outlined" value="star">&#xe838;</option>
                                    <option className="material-symbols-outlined" value="heart">&#xe87d;</option>
                                </select>
                            ))}
                        </div>
                    )}

                    {beadShapePatternMode === 'alternate-every-n' && (
                        <div className="optionsContainerInner flex flex-wrap justify-center gap-2 mt-[10px]">
                            <div className="shapeControls flex align-center items-center">
                                <label className="font-label">Every </label>
                                <input
                                    className="font-label w-10 text-center rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition"
                                    type="number"
                                    min="1"
                                    value={patternStep}
                                    onChange={(e) => setPatternStep(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="shapeControls flex align-center items-center">
                                <label className="font-label"> beads use </label>
                                <select className="shapeDropdown rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition" value={shapeA} onChange={(e) => setShapeA(e.target.value)}>
                                    <option className="material-symbols-outlined" value="circle" >&#xe836;</option>
                                    <option className="material-symbols-outlined" value="square">&#xeb36;</option>
                                    <option className="material-symbols-outlined" value="hexagon">&#xeb39;</option>
                                    <option className="material-symbols-outlined" value="squircle">&#xe841;</option>
                                    <option className="material-symbols-outlined" value="star">&#xe838;</option>
                                    <option className="material-symbols-outlined" value="heart">&#xe87d;</option>
                                </select>
                            </div>
                            <div className="shapeControls flex align-center items-center">
                                <label className="font-label"> and then </label>
                                <select className="shapeDropdown rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition" value={shapeB} onChange={(e) => setShapeB(e.target.value)}>
                                    <option className="material-symbols-outlined" value="circle" >&#xe836;</option>
                                    <option className="material-symbols-outlined" value="square">&#xeb36;</option>
                                    <option className="material-symbols-outlined" value="hexagon">&#xeb39;</option>
                                    <option className="material-symbols-outlined" value="squircle">&#xe841;</option>
                                    <option className="material-symbols-outlined" value="star">&#xe838;</option>
                                    <option className="material-symbols-outlined" value="heart">&#xe87d;</option>
                                </select>
                            </div>
                            <button
                                className="patternButton shadow-[inset_0_0_0_2px_#616467] text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:text-white dark:text-neutral-200 transition duration-200"
                                onClick={handleApplyShapePattern}
                            >
                                Apply Pattern
                            </button>
                        </div>
                    )}

                    {beadShapePatternMode === 'alternating' && (
                        <div className="optionsContainerInner flex justify-center gap-2 align-center items-center mt-[10px]">
                            <div>
                                <label className="font-label">First Shape:</label>
                                <select className="shapeDropdown rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition" value={shapeA} onChange={(e) => setShapeA(e.target.value)}>
                                    <option className="material-symbols-outlined" value="circle" >&#xe836;</option>
                                    <option className="material-symbols-outlined" value="square">&#xeb36;</option>
                                    <option className="material-symbols-outlined" value="hexagon">&#xeb39;</option>
                                    <option className="material-symbols-outlined" value="squircle">&#xe841;</option>
                                    <option className="material-symbols-outlined" value="star">&#xe838;</option>
                                    <option className="material-symbols-outlined" value="heart">&#xe87d;</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-label">Second Shape:</label>
                                <select className="shapeDropdown rounded-md shadow-sm border border-slate-200 overflow-hidden focus-within:ring-slate-400 transition" value={shapeB} onChange={(e) => setShapeB(e.target.value)}>
                                    <option className="material-symbols-outlined" value="circle" >&#xe836;</option>
                                    <option className="material-symbols-outlined" value="square">&#xeb36;</option>
                                    <option className="material-symbols-outlined" value="hexagon">&#xeb39;</option>
                                    <option className="material-symbols-outlined" value="squircle">&#xe841;</option>
                                    <option className="material-symbols-outlined" value="star">&#xe838;</option>
                                    <option className="material-symbols-outlined" value="heart">&#xe87d;</option>
                                </select>
                            </div>
                            <button
                                className="patternButton shadow-[inset_0_0_0_2px_#616467] text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:text-white dark:text-neutral-200 transition duration-200"
                                onClick={handleApplyShapePattern}
                            >
                                Apply Pattern
                            </button>
                        </div>
                    )}

                    {beadShapePatternMode === 'custom-pattern' && (
                        <div className="optionsContainerInner flex flex-wrap justify-center gap-2 mt-[10px]">
                            <div>
                                <label className="font-label">Custom Pattern (comma-separated):</label>
                                <input
                                    className="font-label w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    type="text"
                                    value={customPatternText}
                                    onChange={(e) => setCustomPatternText(e.target.value)}
                                    placeholder="e.g., circle,circle,hexagon,star"
                                />
                            </div>
                            <button
                                className="patternButton shadow-[inset_0_0_0_2px_#616467] text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:text-white dark:text-neutral-200 transition duration-200"
                                onClick={handleApplyShapePattern}
                            >
                                Apply Pattern
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BraceletControls;
