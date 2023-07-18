// Function that loads background images from tag data
const loadimgs = () => {
    var imgDefer = document.querySelectorAll('.bgimg[data-src]');
    var style = "background-image: url({url})";
    for (var i = 0; i < imgDefer.length; i++) {

        imgDefer[i].setAttribute('style', style.replace("{url}", imgDefer[i].getAttribute('data-src')));
    }
}

// Load images when the page has finished loading
window.onload = loadimgs;
