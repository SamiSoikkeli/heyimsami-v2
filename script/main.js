document.addEventListener("DOMContentLoaded", function () {
	const bodyId = document.body.id;

	var currentYear = new Date().getFullYear();
	document.getElementById("currentYear").textContent = currentYear;

	const copyEmail = document.getElementById("copy-email");
	copyEmail.addEventListener("click", function () {
		let emailTag = document.getElementById("email");
		let emailText = emailTag.textContent;
		let successText = document.getElementById("success-text");

		navigator.clipboard.writeText(emailText);
		successText.style.display = "inline-block";
	});

	const slider = document.querySelector(".gallery__items");
	const progressBar = document.querySelector(".gallery__progress-inner");
	const showcase = document.querySelector(".gallery__showcase");
	const showcaseWrapper = document.querySelector(
		".gallery__showcase-wrapper"
	);
	let sliderGrabbed = false;
	let targetScrollLeft = 0;
	let currentScrollLeft = 0;
	let startX = 0;
	let scrollLeftOnGrab = 0;

	function lerp(start, end, t) {
		return start * (1 - t) + end * t;
	}

	function getScrollPercentage() {
		return (
			(slider.parentElement.scrollLeft /
				(slider.parentElement.scrollWidth -
					slider.parentElement.clientWidth)) *
			100
		);
	}

	function updateShowcaseImage() {
		const itemWidth = slider.querySelector(".gallery__item").offsetWidth;
		const scrollLeft = slider.parentElement.scrollLeft;
		const index = Math.floor(scrollLeft / itemWidth);
		const images = slider.querySelectorAll(".gallery__img");

		if (index >= 0 && index < images.length) {
			const imgSrc = images[index].src;

			showcase.innerHTML = "";

			const img = document.createElement("img");
			img.src = imgSrc;
			img.alt = "Showcase Image";

			showcase.appendChild(img);

			const imgFilename = imgSrc.split("/").pop();
			const imageLinkEntry = projectLinks[imgFilename];
			const links = imageLinkEntry ? imageLinkEntry[bodyId] : null;

			const existingLinksDiv =
				showcaseWrapper.querySelector(".gallery__links");
			if (existingLinksDiv) {
				existingLinksDiv.remove();
			}

			if (links) {
				const linksDiv = document.createElement("div");
				linksDiv.classList.add("gallery__links");

				links.forEach((linkInfo) => {
					const linkElement = document.createElement("a");
					linkElement.href = linkInfo.url;
					linkElement.target = "_blank";
					linkElement.textContent = linkInfo.text;
					linkElement.classList.add("gallery__item-link");
					linksDiv.appendChild(linkElement);
				});

				showcaseWrapper.appendChild(linksDiv);
			}
		}
	}

	slider.parentElement.addEventListener("scroll", (e) => {
		progressBar.style.width = `${getScrollPercentage()}%`;
		updateShowcaseImage();
	});

	slider.addEventListener("mousedown", (e) => {
		sliderGrabbed = true;
		slider.style.cursor = "grabbing";
		startX = e.pageX - slider.offsetLeft;
		scrollLeftOnGrab = slider.parentElement.scrollLeft;
	});

	slider.addEventListener("mouseup", (e) => {
		sliderGrabbed = false;
		slider.style.cursor = "grab";
		targetScrollLeft = slider.parentElement.scrollLeft;
	});

	slider.addEventListener("mouseleave", (e) => {
		if (sliderGrabbed) {
			sliderGrabbed = false;
			slider.style.cursor = "grab";
			targetScrollLeft = slider.parentElement.scrollLeft;
		}
	});

	slider.addEventListener("mousemove", (e) => {
		if (sliderGrabbed) {
			const x = e.pageX - slider.offsetLeft;
			const walk = x - startX;
			slider.parentElement.scrollLeft = scrollLeftOnGrab - walk;
			targetScrollLeft = slider.parentElement.scrollLeft;
		}
	});

	slider.addEventListener("touchstart", (e) => {
		sliderGrabbed = true;
		startX = e.touches[0].pageX - slider.offsetLeft;
		scrollLeftOnGrab = slider.parentElement.scrollLeft;
	});

	slider.addEventListener("touchend", (e) => {
		sliderGrabbed = false;
		targetScrollLeft = slider.parentElement.scrollLeft;
	});

	slider.addEventListener("touchmove", (e) => {
		if (sliderGrabbed) {
			e.preventDefault();
			const x = e.touches[0].pageX - slider.offsetLeft;
			const walk = x - startX;
			slider.parentElement.scrollLeft = scrollLeftOnGrab - walk;
			targetScrollLeft = slider.parentElement.scrollLeft;
		}
	});

	slider.addEventListener("wheel", (e) => {
		e.preventDefault();
		targetScrollLeft += e.deltaY;
		if (targetScrollLeft < 0) targetScrollLeft = 0;
		if (
			targetScrollLeft >
			slider.parentElement.scrollWidth - slider.parentElement.clientWidth
		) {
			targetScrollLeft =
				slider.parentElement.scrollWidth -
				slider.parentElement.clientWidth;
		}
	});

	function animate() {
		currentScrollLeft = lerp(currentScrollLeft, targetScrollLeft, 0.075);
		slider.parentElement.scrollLeft = currentScrollLeft;
		requestAnimationFrame(animate);
	}

	animate();
	updateShowcaseImage();

	const startClock = () => {
		let locale;

		switch (bodyId) {
			case "en":
				locale = "en-US";
				break;
			case "jp":
				locale = "ja-JP";
				break;
			default:
				locale = "en-US";
		}

		const dateString = new Date().toLocaleString(locale, {
			timeZone: "Europe/Helsinki",
			timeStyle: "long",
			hourCycle: "h12",
		});

		const formattedDateString = dateString.replace(
			/(\d+)/g,
			'<span class="font-en">$1</span>'
		);

		document.getElementById("current-time").innerHTML = formattedDateString;

		setTimeout(startClock, 1000);
	};

	startClock();
});
