export function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const verticalStretch = 1.8;
    const offsetY = size * 0.9;
    const topY = y - offsetY;
    const bottomY = y + size * verticalStretch - offsetY;

    ctx.moveTo(x, topY + size * 0.4);

    ctx.bezierCurveTo(
        x - size * 1.1, topY - size * 0.2,
        x - size, topY + size * 1.0,
        x, bottomY
    );

    ctx.bezierCurveTo(
        x + size, topY + size * 1.0,
        x + size * 1.1, topY - size * 0.2,
        x, topY + size * 0.4
    );

    ctx.closePath();
}

export function drawStar(ctx, cx, cy, outerRadius, points = 5) {
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

export function drawSquircle(ctx, x, y, width, height, radius = 10) {
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
