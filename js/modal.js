/*!
modal.js - http://simboonlong.com
Licensed under the MIT license

Copyright (c) 2014 Sim Boon Long

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function( window, document, undefined ) {
	"use strict";

	function onWindowResize(){
        /* jshint validthis: true */
        this.updatePosition();
	}

    Modal.prototype = {

        prepURL : function( url ) {
            var startIndex = url.indexOf("imgs") + 5, // + imgs string
            lastIndex = url.lastIndexOf("jpg") - 1, // - dot string
            lowResSrc = url.slice( startIndex, lastIndex ),
            highResSrc = 'imgs/high-res/'+lowResSrc+'.jpg';

            return highResSrc;
        },

        setDuration : function( id, time ) {
            var duration = time / 1000;
            id.style.animationDuration = ''+duration+'s';
            id.style.transitionDuration = ''+duration+'s';
            id.style.webkitTransitionDuration = ''+duration+'s';
            id.style.webkitAnimationDuration = ''+duration+'s';
        },

        goNext : function( event ) {
            if( this.selectedItem.nextElementSibling !== null) {
                this.resetClasses();

                var url = this.selectedItem.nextElementSibling.getElementsByTagName('img')[0].src,
                    highResSrc = this.prepURL( url );

                this.img.onload = function() {
                    this.selectedItem = this.selectedItem.nextElementSibling;
                    this.modalBox.className += 'animated '+this.modalBox.animationType+'';
                }.bind(this);

                this.img.src = highResSrc;
            }
        },

        goPrevious : function( event ) {
            if( this.selectedItem.previousElementSibling !== null) {
                this.resetClasses();

                var url = this.selectedItem.previousElementSibling.getElementsByTagName('img')[0].src,
                    highResSrc = this.prepURL( url );

                this.img.onload = function() {
                    this.selectedItem = this.selectedItem.previousElementSibling;
                    this.modalBox.className += 'animated '+this.modalBox.animationType+'';
                }.bind(this);

                this.img.src = highResSrc;
            }
        },

        closeGallery : function( event ) {
            this.modalBox.className = '';
            this.modalBox.className = 'animated fadeOut';
            this.modalBgOverlay.className = '';
            this.modalBgOverlay.className = 'animated fadeOut';

            var that = this;
            setTimeout( function() {
                that.modalBox.remove();
                that.modalBgOverlay.remove();
            }, this.animationTime );
        },

        openGallery : function( event ) {
            this.modalBgOverlay.className = '';
            this.modalBgOverlay.className += 'animated fadeIn';
            this.selectedItem = event.target.parentNode;

            var url = event.target.src,
                highResSrc = this.prepURL( url );

            this.img.onload = function( event ) {
                document.body.insertBefore(this.modalBox, document.body.firstChild);
                document.body.insertBefore(this.modalBgOverlay, document.body.firstChild);
                this.modalBox.className += 'animated '+this.modalBox.animationType+'';
                this.updatePosition();
            }.bind(this);

            this.img.src = highResSrc;
        },

        resetClasses : function() {
            this.modalBox.className = '';
            var a = this.modalBox.offsetWidth; // trigger a reflow for css class animation to work again
        },

        updatePosition : function() {
            var h = this.modalBox.getBoundingClientRect().height,
                top = (h / 2) | 0;
            this.modalBox.style.marginTop = '-'+top+'px';
        },

        initialize : function() {
            for ( var i = this.items.length; i--;){
                this.items[i].addEventListener('click', this.openGallery.bind(this), false );
            }
        }

    };

	function Modal( el, options ) {
        // core settings
        this.el = el;
        this.items = el.getElementsByTagName('li');
        this.selectedItem = '';
        this.animationType = options.animationType;
        this.animationTime = options.animationTime;

		// modal bg div tag
		var modalBgOverlay = document.createElement('div');
		this.modalBgOverlay = modalBgOverlay;
		this.modalBgOverlay.id = "modal-bg-overlay";
        this.setDuration( this.modalBgOverlay, this.animationTime );
        this.modalBgOverlay.addEventListener('click', this.closeGallery.bind(this), false );

		// modal box div tag
		var modalBox = document.createElement('div');
		this.modalBox = modalBox;
		this.modalBox.id = "modal-box";
		this.modalBox.animationType = options.animationType;
        this.setDuration( this.modalBox, this.animationTime );

		// closing div tag
		var closeSlide = document.createElement('div');
		this.closeSlide = closeSlide;
		this.closeSlide.className += "modal-close";
		this.closeSlide.innerHTML = '&#88;';
		this.closeSlide.addEventListener('click', this.closeGallery.bind(this), false );
		this.modalBox.appendChild( this.closeSlide );

		// next div tag
		var nextSlide = document.createElement('div');
		this.nextSlide = nextSlide;
		this.nextSlide.className += "modal-next";
		this.nextSlide.innerHTML = '&#62;';
		this.nextSlide.addEventListener('click', this.goNext.bind(this), false );
		this.modalBox.appendChild( this.nextSlide );

		// previous div tag
		var previousSlide = document.createElement('div');
		this.previousSlide = previousSlide;
		this.previousSlide.className += "modal-previous";
		this.previousSlide.innerHTML = '&#60;';
		this.previousSlide.addEventListener('click', this.goPrevious.bind(this), false );
		this.modalBox.appendChild( this.previousSlide );

		// img tag
		this.img = new Image();
		this.img.src = '';
		this.modalBox.appendChild( this.img );
	}

	window.addEventListener('DOMContentLoaded', function( event ){
		var options = {
			animationType: 'fadeIn', // animate.css by Daniel Eden
			animationTime: 500 // will set and overwrite css timing in animate.css
		};

		var m = new Modal( document.getElementById('any-name'), options ); // set config
        m.initialize();  // init modal
        window.addEventListener('resize', onWindowResize.bind(m), false);
	});

})( this, this.document );
