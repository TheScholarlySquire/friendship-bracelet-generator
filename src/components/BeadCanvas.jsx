import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { drawHeart, drawStar, drawSquircle } from '../utils/canvasShapes';
import '../styles/BeadCanvas.css';

// ===== Helper functions =====
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getLuminance(r, g, b) {
    const a = [r, g, b].map(x => {
        x /= 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1, hex2) {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    const lum1 = getLuminance(r1, g1, b1);
    const lum2 = getLuminance(r2, g2, b2);
    return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
}

function getContrastingTextColor(bgHex) {
    const [r, g, b] = hexToRgb(bgHex);
    const lum = getLuminance(r, g, b);
    return lum < 0.5 ? '#ffffff' : '#000000';
}

function interpolateColor(color1, color2, t) {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
}

function drawBead(ctx, options) {
    const { char, shape, backgroundColor, fontColor, font, color1, angle } = options;
    ctx.save();

    ctx.translate(options.x, options.y);
    ctx.rotate(angle);

    ctx.fillStyle = backgroundColor;
    const size = 20;
    switch (shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'square':
            ctx.fillRect(-size, -size, size * 2, size * 2);
            break;
        case 'hexagon':
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i;
                const px = size * Math.cos(a);
                const py = size * Math.sin(a);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            break;
        case 'squircle':
            drawSquircle(ctx, -size, -size, size * 2, size * 2, 10);
            ctx.fill();
            break;
        case 'heart':
            drawHeart(ctx, 0, 0, size);
            ctx.fill();
            break;
        case 'star':
            drawStar(ctx, 0, 0, size, 5);
            ctx.fill();
            break;
        default:
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, 2 * Math.PI);
            ctx.fill();
    }

    let finalFontColor = fontColor;
    if (typeof backgroundColor === 'string') {
        const contrast = getContrastRatio(backgroundColor, fontColor);
        if (contrast < 4.5) {
            finalFontColor = getContrastingTextColor(backgroundColor);
        }
    }

    ctx.fillStyle = finalFontColor;
    ctx.font = `20px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, 0, 0);

    ctx.restore();
}

// ===== Component =====
const BeadCanvas = forwardRef(({
    text,
    color1,
    color2,
    backgroundStyle,
    alternateColors,
    beadShapes,
    fontColor,
    font,
    leftCharm,
    rightCharm,
    leftCharmShape,
    rightCharmShape,
    backgroundImage
}, ref) => {
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({
        downloadImage(filename = 'bracelet.png') {
            const canvas = canvasRef.current;
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const img = new Image();
        const beadWidth = 40;
        const spacing = 10;
        const padding = 60;
        const totalBeads = text.length + (leftCharm ? 1 : 0) + (rightCharm ? 1 : 0);
        const braceletWidth = totalBeads * (beadWidth + spacing) - spacing;
        const desiredWidth = braceletWidth + padding;
        const minWidth = window.innerWidth * 0.9;
        const finalDisplayWidth = Math.max(minWidth, desiredWidth);
        const finalDisplayHeight = 200;

        canvas.width = finalDisplayWidth * pixelRatio;
        canvas.height = finalDisplayHeight * pixelRatio;
        canvas.style.width = `${finalDisplayWidth}px`;
        canvas.style.height = `${finalDisplayHeight}px`;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const allChars = [
            ...(leftCharm ? [leftCharm] : []),
            ...text.split(''),
            ...(rightCharm ? [rightCharm] : []),
        ];

        const allShapes = [
            ...(leftCharm ? [leftCharmShape] : []),
            ...beadShapes,
            ...(rightCharm ? [rightCharmShape] : []),
        ];

        const startX = (finalDisplayWidth - braceletWidth) / 2;
        const centerY = finalDisplayHeight / 2;
        const curveAmplitude = 40;

        const beadPositions = allChars.map((_, i) => {
            const x = startX + i * (beadWidth + spacing);
            const normalized = (i / (totalBeads - 1)) * 2 - 1;
            const y = centerY + -(normalized ** 2) * curveAmplitude;
            return { x, y };
        });

        for (let i = 0; i < beadPositions.length; i++) {
            const prev = beadPositions[i - 1] || beadPositions[i];
            const next = beadPositions[i + 1] || beadPositions[i];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            beadPositions[i].angle = Math.atan2(dy, dx);
        }

        const drawBracelet = () => {
            if (beadPositions.length >= 2) {
                ctx.beginPath();
                ctx.moveTo(beadPositions[0].x, beadPositions[0].y);
                for (let i = 1; i < beadPositions.length; i++) {
                    ctx.lineTo(beadPositions[i].x, beadPositions[i].y);
                }
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            const gradStartX = startX;
            const gradEndX = startX + braceletWidth;

            allChars.forEach((char, i) => {
                const { x, y, angle } = beadPositions[i];
                let backgroundColor = color1;

                if (backgroundStyle === 'alternating') {
                    backgroundColor = i % 2 === 0 ? alternateColors[0] : alternateColors[1];
                } else if (backgroundStyle === 'gradient') {
                    const t = (x - gradStartX) / (gradEndX - gradStartX);
                    backgroundColor = interpolateColor(color1, color2, t);
                }

                drawBead(ctx, {
                    char,
                    shape: allShapes[i] || 'circle',
                    x, y,
                    backgroundColor,
                    fontColor,
                    font,
                    color1,
                    angle,
                });
            });
        };

        console.log('Received backgroundImage prop:', backgroundImage);

        if (backgroundImage && backgroundImage !== 'transparent') {
            const img = new Image();
            console.log('backgroundImage value:', backgroundImage);
            console.log('Canvas size:', canvas.width, canvas.height);
            console.log('Full image path:', import.meta.env.BASE_URL + backgroundImage.replace(/^\//, ''));
                console.log('BASE_URL:', import.meta.env.BASE_URL);

            img.src = import.meta.env.BASE_URL + backgroundImage.replace(/^\//, '');
            console.log('Resolved image path:', img.src);
            img.onload = () => {
                console.log('Background image loaded:', img.src);

                //Preserve image aspect ratio and center-crop
                const imgRatio = img.width / img.height;
                const canvasRatio = canvas.width / canvas.height;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (imgRatio > canvasRatio) {
                    // Image is wider than canvas
                    drawHeight = canvas.height;
                    drawWidth = img.width * (canvas.height / img.height);
                    offsetX = -(drawWidth - canvas.width) / 2;
                    offsetY = 0;
                } else {
                    // Image is taller than canvas
                    drawWidth = canvas.width;
                    drawHeight = img.height * (canvas.width / img.width);
                    offsetX = 0;
                    offsetY = -(drawHeight - canvas.height) / 2;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                //Optional translucent white overlay for readability (adjust opacity as needed)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                drawBracelet();
            };
            img.onerror = (err) => {
                console.warn('Failed to load background image:', img.src, err);
                drawBracelet();
            };
        } else {
            drawBracelet();
        }

    }, [backgroundImage, text, beadShapes, font, fontColor, color1, color2, backgroundStyle, alternateColors, leftCharm, rightCharm, leftCharmShape, rightCharmShape]);

    return (
        <div className="canvasWrapper">
            <canvas ref={canvasRef} />
        </div>
    );
});

export default BeadCanvas;
