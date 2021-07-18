export default class InjectWarning {
	constructor() {
		// Save reference to the editor.
		this.div = document.createElement("div");
	}
	addClass(classes) {
		this.div.classList.add(classes);
	}
	setMessage(msg) {
		this.div.innerText = msg;
	}
	setParent(pos) {
		this.position = pos;
	}
	inject() {
		const p = this.position;
		p.insertBefore(this.div, p.firstChild);
	}
}
