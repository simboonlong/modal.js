/*!
modal.js - http://simboonlong.com
Licensed under the MIT license

Copyright (c) 2014 Sim Boon Long

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function(){
	"use strict";

	function onWindowResize( event ){
		this.update();
	}

	function prepURL( url ){
		var startIndex = url.indexOf("imgs") + 5, // + imgs string
			lastIndex = url.lastIndexOf("jpg") - 1, // - dot string
			low_img_src = url.slice( startIndex, lastIndex ),
			high_img_src = './imgs/high-res/'+low_img_src+'.jpg';

		return high_img_src;
	}

	Modal.prototype.update = function( event ){
		if ( document.getElementById('modal-bg') !== null ){
			if ( document.body.clientHeight < window.innerHeight ){
				this.modalBg.style.width = window.innerWidth + 'px';
				this.modalBg.style.height = window.innerHeight + 'px';
			} else {
				this.modalBg.style.width = document.body.clientWidth + 'px';
				this.modalBg.style.height = document.body.clientHeight + 'px';
			} // modalBg overlay coverage

			this.modalBox.style.maxHeight = this.img.clientHeight + 'px'; // update vertical position due to height changes
		
		}
	}

	Modal.prototype.destroy = function( event ){
		this.removeClasses();
		this.removeStyles();
		this.img.src = ''; // remove src in order to enable img.src onload again
		this.modalBg.parentNode.removeChild( this.modalBg ); // "destroy" entire tag
	}

	Modal.prototype.removeClasses = function( event ){
		this.modalBg.className = ''; // remove all animated classes
		this.modalBox.className = ''; // remove all animated classes
	}

	Modal.prototype.removeStyles = function( event ){
		this.img.style.display = "none";  // temporary hide
		this.closeModal.style.display = 'none'; // temporary hide
		this.leftModal.style.display = 'none'; // temporary hide
		this.rightModal.style.display = 'none'; // temporary hide
	}

	Modal.prototype.closingModal = function( event ){
		setTimeout( this.destroy.bind(this), this.modalBg.animation_time ); // after animation end, fire this
		this.modalBg.className += " fadeOut";
	}

	Modal.prototype.goLeft = function( event ){
		if( this.modalBox.selectedFigure.previousElementSibling !== null){
			var url = this.modalBox.selectedFigure.previousElementSibling.getElementsByTagName('img')[0].src,
				high_img_src = prepURL( url );
			this.img.src = high_img_src; // set img to image

			this.modalBox.selectedFigure = this.modalBox.selectedFigure.previousElementSibling;
			this.imageLoaded();
		}
	}

	Modal.prototype.goRight = function( event ){
		if( this.modalBox.selectedFigure.nextElementSibling !== null){
			var url = this.modalBox.selectedFigure.nextElementSibling.getElementsByTagName('img')[0].src,
				high_img_src = prepURL( url );
			this.img.src = high_img_src; // set img to image

			this.modalBox.selectedFigure = this.modalBox.selectedFigure.nextElementSibling;
			this.imageLoaded();
		}
	}

	Modal.prototype.imageLoaded = function( event ){
		this.removeClasses();
		this.removeStyles();
		this.modalBg.className += 'animated fadeIn';

		this.img.onload = function( event ){
			this.img.style.display = "inline-block"; // temporary show
			this.leftModal.style.display = 'inline-block'; // temporary show
			this.rightModal.style.display = 'inline-block'; // temporary show
			this.closeModal.style.display = 'block'; // temporary show

			this.modalBox.style.maxWidth = this.img.clientWidth + 'px';  // set modal size once for centralizing loading gif
			this.modalBox.style.maxHeight = this.img.clientHeight + 'px'; // set modal size once for centralizing loading gif

			this.modalBox.className += 'animated '+this.modalBox.animation_type+'';
			this.update(); // update position
		}.bind(this);
	}

	Modal.prototype.openingModal = function( event ){
		// load and switch img to high res url
		var url = event.target.src,
			high_img_src = prepURL( url );
		this.img.src = high_img_src; // set img to image

		this.modalBox.selectedFigure = event.target.parentNode; // assign selected figure for navigation
		this.imageLoaded();
		document.body.insertBefore(this.modalBg, document.body.firstChild); // insert whole modal bg in
	}

	Modal.prototype.initialize = function(){
		for ( var i = 0; i < this.gallery.figures_length; i +=1 ){
			this.gallery.figure[i].getElementsByTagName('img')[0].addEventListener("click", this.openingModal.bind(this), false); // bind "this" Modal into method
		};
	}

	function Modal( gallery, options ){
		// core settings
		this.gallery = gallery;
		this.gallery.figure = this.gallery.getElementsByTagName('figure');
		this.gallery.figures_length = this.gallery.figure.length;

		// modal bg div tag
		var modalBg = document.createElement('div');
		this.modalBg = modalBg;
		this.modalBg.id = "modal-bg";
		this.modalBg.animation_time = options.animation_time;

		// modal box div tag
		var modalBox = document.createElement('div');
		this.modalBox = modalBox;
		this.modalBox.id = "modal-box";
		this.modalBox.selectedFigure = '';
		this.modalBox.animation_type = options.animation_type;
		this.modalBg.appendChild( this.modalBox );

		// closing div tag
		var closeModal = document.createElement('div');
		this.closeModal = closeModal;
		this.closeModal.className += "close-modal bold";
		this.closeModal.innerHTML = '&#88;';
		this.closeModal.addEventListener('click', this.closingModal.bind(this), false );  // bind "this" Modal into method
		this.modalBox.appendChild( this.closeModal );

		// left div tag
		var leftModal = document.createElement('div');
		this.leftModal = leftModal;
		this.leftModal.className += "left-modal bold";
		this.leftModal.innerHTML = '&#60;';
		this.leftModal.addEventListener('click', this.goLeft.bind(this), false );  // bind "this" Modal into method
		this.modalBox.appendChild( this.leftModal );

		// right div tag
		var rightModal = document.createElement('div');
		this.rightModal = rightModal;
		this.rightModal.className += "right-modal bold";
		this.rightModal.innerHTML = '&#62;';
		this.rightModal.addEventListener('click', this.goRight.bind(this), false );  // bind "this" Modal into method
		this.modalBox.appendChild( this.rightModal );

		// img tag
		this.img = new Image();
		this.img.src = '';
		this.modalBox.appendChild( this.img );

		this.initialize();
	}

	window.addEventListener('DOMContentLoaded', function( event ){

		var options = {
			animation_type: 'fadeIn', // animate.css by Daniel Eden
			animation_time: 500 // HAS TO BE the same timing as animate.css
		}

		var m = new Modal( document.getElementById('gallery'), options ); // load gallery of images into modal box
	    window.addEventListener('resize', onWindowResize.bind(m), false);

	});

})();
