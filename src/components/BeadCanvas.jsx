import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import GraphemeSplitter from 'grapheme-splitter';
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
      drawSquircle(ctx, -size + 20, -size + 20, size * 2, size * 2, 10);
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

  ctx.fillStyle = fontColor;
  const isEmoji = /\p{Emoji}/u.test(char);
  ctx.font = isEmoji
    ? `20px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', system-ui, sans-serif`
    : `20px '${font}', system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  console.log('Rendering char:', char, '| Codepoint:', [...char].map(c => c.codePointAt(0).toString(16)).join(' '));
  ctx.fillText(char, 0, 0);
  ctx.restore();
}

// ===== Main Component =====
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
  const splitter = new GraphemeSplitter();

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
    const splitText = splitter.splitGraphemes(text);
    const totalBeads = splitText.length + (leftCharm ? 1 : 0) + (rightCharm ? 1 : 0);
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

    return { ctx, finalDisplayWidth, finalDisplayHeight, braceletWidth, splitText };
  };

  const drawBracelet = (ctx, finalDisplayWidth, braceletWidth, splitText) => {
    const beadWidth = 40;
    const spacing = 10;
    const totalBeads = splitText.length + (leftCharm ? 1 : 0) + (rightCharm ? 1 : 0);
    const isSingleBead = totalBeads === 1;
    const startX = isSingleBead
        ? finalDisplayWidth / 2 - beadWidth / 2
        : (finalDisplayWidth - braceletWidth) / 2;
    const centerY = 100;
    const curveAmplitude = 40;

    const allChars = [
      ...(leftCharm ? [leftCharm] : []),
      ...splitText,
      ...(rightCharm ? [rightCharm] : []),
    ];

    const allShapes = [
      ...(leftCharm ? [leftCharmShape] : []),
      ...beadShapes,
      ...(rightCharm ? [rightCharmShape] : []),
    ];

    const beadPositions = allChars.map((_, i) => {
        const x = isSingleBead
            ? startX + beadWidth / 2
            : startX + i * (beadWidth + spacing);
        const normalized = isSingleBead
            ? 0
            : (i / (totalBeads - 1)) * 2 - 1;
        const y = centerY - (normalized ** 2) * curveAmplitude;
        return { x, y };
    });

    for (let i = 0; i < beadPositions.length; i++) {
        if (isSingleBead) {
            beadPositions[i].angle = 0;
        } else {
            const prev = beadPositions[i - 1] || beadPositions[i];
            const next = beadPositions[i + 1] || beadPositions[i];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            beadPositions[i].angle = Math.atan2(dy, dx);
        }
    }

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
        angle,
      });
    });
  };

  useEffect(() => {
    if (backgroundImage && backgroundImage !== 'transparent') {
      setShouldRedrawBackground(true);
    }
  }, [backgroundImage]);

  useEffect(() => {
    Promise.all([
      document.fonts.load(`20px '${font}'`),
      document.fonts.load(`20px 'Apple Color Emoji'`),
      document.fonts.load(`20px 'Segoe UI Emoji'`),
      document.fonts.load(`20px 'Noto Color Emoji'`),
      document.fonts.ready,
    ]).then(() => {
      const { ctx, finalDisplayWidth, braceletWidth, splitText } = setupCanvas();
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (backgroundImage && backgroundImage.startsWith('solid:')) {
        const color = backgroundImage.split(':')[1] || '#ffffff';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawBracelet(ctx, finalDisplayWidth, braceletWidth, splitText);
      } else if (backgroundImage && backgroundImage !== 'transparent' && shouldRedrawBackground) {
        const img = new Image();
        const resolvedPath = import.meta.env.BASE_URL + backgroundImage.replace(/^\//, '');
        img.src = resolvedPath;
        img.onload = () => {
          const canvas = canvasRef.current;
          const imgRatio = img.width / img.height;
          const canvasRatio = canvas.width / canvas.height;

          let drawWidth, drawHeight, offsetX, offsetY;
          if (imgRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = img.width * (drawHeight / img.height);
            offsetX = -(drawWidth - canvas.width) / 2;
            offsetY = 0;
          } else {
            drawWidth = canvas.width;
            drawHeight = img.height * (drawWidth / img.width);
            offsetX = 0;
            offsetY = -(drawHeight - canvas.height) / 2;
          }

          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawBracelet(ctx, finalDisplayWidth, braceletWidth, splitText);
        };
        img.onerror = () => {
          drawBracelet(ctx, finalDisplayWidth, braceletWidth, splitText);
        };
      } else {
        drawBracelet(ctx, finalDisplayWidth, braceletWidth, splitText);
      }
    });
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
