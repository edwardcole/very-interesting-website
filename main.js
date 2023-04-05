const randNumber = (max) => Math.floor(Math.random() * max);
const range = (start, end) =>
	Array(end - start + 1)
		.fill(" ")
		.map((_, i) => start + i);

const wordWallEl = document.querySelector("#wall");
const descriptionEl = document.querySelector("#description");
const backEl = document.querySelector("#back");

let pageSplit = false;

function windowKeypress(e) {
	if (e.key === "Escape") unSplit();
}

function unSplit() {
	if (pageSplit) {
		document.body.classList.remove("split");
		pageSplit = false;
	}
}

function createWord() {
	const data = wordData.splice(randNumber(wordData.length), 1)[0];

	const el = document.createElement("div");
	el.classList.add("word");
	el.style.background = `url(${data.image}) no-repeat center`;
	el.style.backgroundSize = "150%";

	el.addEventListener("click", () => {
		if (pageSplit === true) return;
		document.body.classList.add("split");
		descriptionEl.innerHTML = `<h2>${data.title}</h2>${data.description}`;
		pageSplit = true;
	});

	const darken = document.createElement("div");
	darken.classList.add("darken");

	const title = document.createElement("span");
	title.innerText = data.title;

	el.append(darken, title);
	return el;
}

function generateWordWall() {
	let availableBigLocations = range(1, 4).flatMap((x) =>
		range(1, 4).map((y) => [x, y])
	);
	let availableSmallLocations = range(1, 5).flatMap((x) =>
		range(1, 5).map((y) => [x, y])
	);
	let words = [];

	// big words
	for (const index of range(0, 2)) {
		const position =
			availableBigLocations[randNumber(availableBigLocations.length)];

		const element = createWord();
		element.style.gridArea = `${position[0]} / ${position[1]} / ${
			position[0] + 2
		} / ${position[1] + 2}`;
		element.classList.add(position[1] < 3 ? "left" : "right");

		if (position.join(":") === "1:2") backEl.classList.add("offset");

		words.push(element);

		availableBigLocations = availableBigLocations.filter(([x, y]) => {
			return (
				x < position[0] - 1 ||
				x > position[0] + 1 ||
				y < position[1] - 1 ||
				y > position[1] + 1
			);
		});

		availableSmallLocations = availableSmallLocations.filter(([x, y]) => {
			return (
				x < position[0] ||
				x > position[0] + 1 ||
				y < position[1] ||
				y > position[1] + 1
			);
		});
	}

	for (const position of availableSmallLocations) {
		if (wordData.length === 0) break;

		const element = createWord();
		element.style.gridArea = `${position[0]} / ${position[1]} / ${
			position[0] + 1
		} / ${position[1] + 1}`;

		let onLeft = position[1] != 3 ? position[1] < 3 : Math.random() >= 0.5;
		element.classList.add(onLeft ? "left" : "right");

		if (position.join(":") === "1:3" && onLeft) backEl.classList.add("offset");

		words.push(element);
	}

	wordWallEl.append(...words);
}

generateWordWall();

addEventListener("keydown", windowKeypress);
backEl.addEventListener("click", unSplit);
