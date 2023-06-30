class SectController {
    constructor(sections) {
        this.sections = sections;
        this.activeSection = undefined;
    }

    set active(index) {
        if (this.sections.length <= index) {
            throw "Error: Provided index higher than section number.";
        }

        for (let sect = 0; sect < this.sections.length; sect++) {
            if (sect != index) {
                this.sections[sect].classList.remove("show");
            } else {
                this.sections[sect].classList.add("show");
            }
        }
        this.activeSection = index;
    }

    get active() {
        return this.activeSection;
    }
}

class PageController {
    constructor(sectController) {
        this.sectController = sectController;
    }

    nextPage() {
        sections.active = (sections.active >= (sections.sections.length - 1)) ? sections.active : (sections.active + 1);
    }
    prevPage() {
        sections.active = (sections.active <= 0) ? sections.active : (sections.active - 1);
    }

    pageAt(index) {
        sections.active = index;
    }
}

var sections = new SectController(document.querySelectorAll(".section"));
var pageContrl = new PageController(sections);

var navTouchElem = document.querySelector("html");
var navTouchRegion = new ZingTouch.Region(navTouchElem);

document.querySelector('.a').textContent = "blhs";

navTouchRegion.bind(navTouchElem, 'swipe', function(e) {
    document.querySelector('.a').textContent = "blh";
    if (e.currentDirection in Range(10, 170)) {
        pageContrl.nextPage();
    } else if (e.currentDirection in Range(190, 350)) {
        pageContrl.prevPage();
    }
});

window.onload = () => {
    pageContrl.pageAt(0);
}

['wheel', 'keydown'].forEach((evnttype) => {
    document.addEventListener(evnttype, (evnt) => {
        if (evnt.type == 'keydown') {
            if (evnt.code == 'PageDown' || evnt.code == 'ArrowDown') {
                pageContrl.nextPage();
            } else if (evnt.code == "PageUp" || evnt.code == 'ArrowUp') {
                pageContrl.prevPage();
            }
        } else {
            if (evnt.deltaY < -3) {
                pageContrl.prevPage();
            } else if (evnt.deltaY > 3) {
                pageContrl.nextPage();
            }
        }
    })
});


