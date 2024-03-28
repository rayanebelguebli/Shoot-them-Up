export default function draw(canvas, context, image, x, y) {
	if (
		x <= canvas.width - image.width &&
		y <= canvas.height &&
		x >= 0 &&
		y >= 0
	) {
		context.drawImage(image, x, y, image.width, image.height);
		return true;
	} else {
		return false;
	}
}
