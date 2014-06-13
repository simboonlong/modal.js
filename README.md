## modal.js
a lightbox plugin that loads up a higher resolution image from its thumbnail.

1. no jquery, lightweight.
2. responsive.
3. only images are supported so far.
4. tested to work in chrome, safari, firefox. not tested in ie.
5. animations are handled by `animate.css` by Daniel Eden.


## Usage
To use, initialize `modal.js` with the following arguments. The example uses a div with the id, "gallery".

```
var m = new Modal( document.getElementById('gallery'), options ); // load gallery of images into modal box
	    window.addEventListener('resize', onWindowResize.bind(m), false);
```

The high resolution images are to be keep in the folder named, "high-res", bearing the same naming convention as its thumbnails.


## Customizing
`modal.js` is used in conjunction with `animate.css` by Daniel Eden. To use various animations on the modalbox, simply change the option for `animation_type` accordingly:

```
var options = {
	animation_type: 'fadeIn', // animate.css by Daniel Eden
	animation_time: 500 // HAS TO BE the same timing as animate.css
}

```

`animation_time` has to be the same timing as what is indicated in the `animate.css` stylesheet. Do change accordingly to your needs.

view animate.css docs at this link http://daneden.github.io/animate.css/


## License
modal.js is licensed under the MIT license. (http://opensource.org/licenses/MIT)


## Contributing
still figuring out on using github. lemme know by email first for now.