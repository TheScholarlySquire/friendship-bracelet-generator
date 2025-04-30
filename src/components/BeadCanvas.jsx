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
  const { char, shape, backgroundColor, fontColor, font, angle, x, y } = options;
  ctx.save();
  ctx.translate(x, y);
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
  backgroundImage,
  shouldRedrawBackground,
  setShouldRedrawBackground
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

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
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

    return { ctx, finalDisplayWidth, finalDisplayHeight, braceletWidth };
  };

  const drawBracelet = (ctx, finalDisplayWidth, braceletWidth) => {
    const beadWidth = 40;
    const spacing = 10;
    const totalBeads = text.length + (leftCharm ? 1 : 0) + (rightCharm ? 1 : 0);
    const startX = (finalDisplayWidth - braceletWidth) / 2;
    const centerY = 200 / 2;
    const curveAmplitude = 40;

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

    // Draw string
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
        angle,
      });
    });
  };

  // Set flag to redraw background if image was selected
  useEffect(() => {
    if (backgroundImage && backgroundImage !== 'transparent') {
      setShouldRedrawBackground(true);
    }
  }, [backgroundImage]);

  // Always redraw beads, optionally draw background image
  useEffect(() => {
    const { ctx, finalDisplayWidth, finalDisplayHeight, braceletWidth } = setupCanvas();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (backgroundImage?.startsWith('solid:')) {
        const color = backgroundImage.split(':')[1] || '#ffffff';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawBracelet(ctx, finalDisplayWidth, braceletWidth);
        return;
    }

    if (backgroundImage && backgroundImage !== 'transparent' && shouldRedrawBackground) {
      const img = new Image();
      const resolvedPath = import.meta.env.BASE_URL + backgroundImage.replace(/^\//, '');
      img.src = resolvedPath;
      img.onload = () => {
        const imgRatio = img.width / img.height;
        const canvasRatio = canvasRef.current.width / canvasRef.current.height;

        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgRatio > canvasRatio) {
          drawHeight = canvasRef.current.height;
          drawWidth = img.width * (drawHeight / img.height);
          offsetX = -(drawWidth - canvasRef.current.width) / 2;
          offsetY = 0;
        } else {
          drawWidth = canvasRef.current.width;
          drawHeight = img.height * (drawWidth / img.width);
          offsetX = 0;
          offsetY = -(drawHeight - canvasRef.current.height) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawBracelet(ctx, finalDisplayWidth, braceletWidth);
      };
      img.onerror = () => {
        drawBracelet(ctx, finalDisplayWidth, braceletWidth);
      };
    } else {
      drawBracelet(ctx, finalDisplayWidth, braceletWidth);
    }
  }, [
    text, beadShapes, font, fontColor,
    color1, color2, backgroundStyle, alternateColors,
    leftCharm, rightCharm, leftCharmShape, rightCharmShape,
    backgroundImage, shouldRedrawBackground
  ]);

  return (
    <div className="canvasWrapper">
      <canvas ref={canvasRef} />
    </div>
  );
});

export default BeadCanvas;
