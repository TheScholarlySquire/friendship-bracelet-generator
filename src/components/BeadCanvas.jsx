import { useRef, useEffect } from 'react';
import { drawHeart, drawStar, drawSquircle } from '../utils/canvasShapes';

function hexToRgb(hex) {
  if (typeof hex !== 'string') throw new Error('Expected a string value for hex color');
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map((x) => {
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
  return lum1 > lum2
    ? (lum1 + 0.05) / (lum2 + 0.05)
    : (lum2 + 0.05) / (lum1 + 0.05);
}

function getContrastingTextColor(bgHex) {
  const [r, g, b] = hexToRgb(bgHex);
  const lum = getLuminance(r, g, b);
  return lum < 0.5 ? '#ffffff' : '#000000';
}

function BeadCanvas({
  text, color1, color2, backgroundStyle, alternateColors,
  beadShapes, fontColor, font, leftCharm, rightCharm,
  leftCharmShape, rightCharmShape
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const beadWidth = 40;
    const beadHeight = 40;
    const spacing = 10;
    const totalBeads = text.length + (leftCharm ? 1 : 0) + (rightCharm ? 1 : 0);
    const totalWidth = totalBeads * (beadWidth + spacing) - spacing;
    const startX = (canvas.width - totalWidth) / 2;
    const centerY = canvas.height / 2;
    const curveAmplitude = 20;
    const curveFrequency = Math.PI / Math.max(totalBeads - 1, 1); // Ensure even 1 bead gets 0 angle

    const drawBead = (char, shape, x, y, backgroundColor) => {
      ctx.save();

      // Background color
      ctx.fillStyle = backgroundColor;
      switch (shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(x, y, beadWidth / 2, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(x - beadWidth / 2, y - beadHeight / 2, beadWidth, beadHeight);
          break;
        case 'hexagon':
          const size = beadWidth / 2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          break;
        case 'squircle':
          drawSquircle(ctx, x, y, beadWidth, beadHeight, 10);
          ctx.fill();
          break;
      }

      // Text: Check for low contrast and adjust if needed
      let actualFontColor = fontColor;

      if (typeof backgroundColor === 'string') {
          const contrast = getContrastRatio(backgroundColor, fontColor);
          if (contrast < 4.5) {
              actualFontColor = getContrastingTextColor(backgroundColor);
          }
      } else if (backgroundColor instanceof CanvasGradient) {
          // For gradients, use color1 to approximate contrast
          const fallbackColor = color1;
          const contrast = getContrastRatio(fallbackColor, fontColor);
          if (contrast < 4.5) {
              actualFontColor = getContrastingTextColor(fallbackColor);
          }
      }

      ctx.fillStyle = actualFontColor;
      ctx.font = `20px ${font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, x, y);

      ctx.restore();
    };

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

    const beadPositions = allChars.map((_, i) => {
      const x = startX + i * (beadWidth + spacing);
      const angle = i * curveFrequency;
      const y = centerY + Math.sin(angle) * curveAmplitude;
      return { x, y };
    });

    // Draw string *only* if there are at least 2 beads
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

    // Draw beads
    allChars.forEach((char, i) => {
      const { x, y } = beadPositions[i];

      let bgColor = color1;
      if (backgroundStyle === 'alternating') {
        bgColor = i % 2 === 0 ? alternateColors[0] : alternateColors[1];
      } else if (backgroundStyle === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        bgColor = grad;
      } else if (backgroundStyle === 'solid') {
        bgColor = color1;
      }

      drawBead(char, allShapes[i] || 'circle', x, y, bgColor);
    });

  }, [
    text, beadShapes, font, fontColor,
    color1, color2, backgroundStyle, alternateColors,
    leftCharm, rightCharm, leftCharmShape, rightCharmShape
  ]);

  return <canvas ref={canvasRef} width="800" height="200" />;
}

export default BeadCanvas;
