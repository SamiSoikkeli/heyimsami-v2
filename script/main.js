document.addEventListener("DOMContentLoaded", function () {
	const startClock = () => {
		document.getElementById("current-time").innerHTML =
			new Date().toLocaleString("en-US", {
				timeZone: "Europe/Helsinki",
				timeStyle: "long",
				hourCycle: "h12",
			});
		setTimeout(startClock, 1000);
	};

	startClock();
});

document.querySelectorAll(".works__img").forEach((item) => {
	item.addEventListener("click", (event) => {
		event.target.classList.toggle("active");

		if (event.target.classList.contains("active")) {
			document.querySelectorAll(".works__img").forEach((img) => {
				if (img !== event.target) {
					img.classList.remove("active");
				}
			});
		}
	});
});

const copyEmail = document.getElementById("copy-email");
copyEmail.addEventListener("click", function () {
	let emailTag = document.getElementById("email");
	let emailText = emailTag.textContent;
	let successText = document.getElementById("success-text");

	navigator.clipboard.writeText(emailText);
	successText.style.display = "inline-block";
});

document.getElementById("year").innerHTML = new Date().getFullYear();
