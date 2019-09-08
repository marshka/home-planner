var Modal = {

	init: function() {

		this.modal = document.getElementById("modal");
		this.objList = document.getElementById("objects-list");

		this.objList.addEventListener('click', event => {
			var selObj = objects[event.target.getAttribute("item")];
			if(selObj) {
				selObj.select();
				this.hide();
			}
		});

		document.getElementsByClassName("close")[0].onclick = function() {
			Modal.hide();
		}
	},

	show: function() {
		this.modal.style.display = "block";
	},

	hide: function() {
		this.modal.style.display = "none";
	},

	trigger: function() {
		var html = "";
		for (var i = 0; i < objects.length; i++) {
			html += '<div style="background-image: url('+objects[i].thumb+')" item="'+i+'"></div>\n';
		}
		this.objList.innerHTML = html;
		(this.modal.style.display == "none") ? this.show() : this.hide();
	}
}