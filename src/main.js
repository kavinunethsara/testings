
// Classes

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
    constructor(sectController, doc) {
        this.sectController = sectController;
        this.pagerContainer = doc;
        this.pageItems = [];
        this.createPager();
    }

    createPager() {
        const pager = document.createElement("pager");
        const itemContainer = document.createElement("itemcontainer");
        pager.appendChild(itemContainer);
        for (var i = 0; i < this.sectController.sections.length; i++) {
            var pageItem = document.createElement("item");
            pageItem.id = "pager" + i;
            const n = i;
            pageItem.onclick = () => {
                this.pageAt(n);
            }
            this.pageItems.push(pageItem);
            itemContainer.appendChild(pageItem);
        }
        this.pagerContainer.appendChild(pager);
    }

    updatePager() {
        for (let i = 0; i < this.pageItems.length; i++) {
            if (i == this.sectController.active) {
                this.pageItems[i].classList.add("active");
            } else {
                this.pageItems[i].classList.remove("active");
            }
        }
    }

    readyToChange() {
        let resetEvent = new Event("pageswitch");
        document.dispatchEvent(resetEvent);
    }

    nextPage() {
        this.readyToChange()
        this.sectController.active = (this.sectController.active >= (this.sectController.sections.length - 1)) ? this.sectController.active : (sections.active + 1);
        this.updatePager();
    }
    prevPage() {
        this.readyToChange()
        this.sectController.active = (this.sectController.active <= 0) ? this.sectController.active : (this.sectController.active - 1);
        this.updatePager();
    }

    pageAt(index) {
        this.readyToChange()
        this.sectController.active = index;
        this.updatePager();
    }
}


//Set-Up

var documentElement = document.querySelector("html");

var sections = new SectController(document.querySelectorAll(".section"));
var pageContrl = new PageController(sections, documentElement);

const animatables = document.querySelectorAll('.animatable');

// on Scroll Animations

//Make First Element Visible

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        console.log(entry);
        if (entry.isIntersecting) {
            entry.target.classList.add('animating')
        } else {
            entry.target.classList.remove('animating')
        }

    });
}, { threshold: 0.1 });

// Loop over each animatable and introduce each to the animation observer

for (let i = 0; i < animatables.length; i++) {
    const elements = animatables[i];

    observer.observe(elements);
}

// On pageunload animation
window.onbeforeunload = () => {
    document.body.classList.add("out");
}

// Page slider related set up

const setUpPages = () => {

    //Set up swipe controls
    document.addEventListener('swiped-right', () => {
        pageContrl.prevPage();
    });

    document.addEventListener('swiped-left', () => {
        pageContrl.nextPage();
    });

    // Initialize the site by setting the page to the first one.

    window.onload = () => {
        pageContrl.pageAt(0);
    }

    // This tracks whether scroll input should be acceppted. It's set to false for a certain time limit in the following code to limit inout per second
    var useScroll = true;

    // Takes scroll and key input, using them to switch pages
    ['wheel', 'keydown'].forEach((evnttype) => {
        document.addEventListener(evnttype, (evnt) => {
            if (evnt.type == 'keydown') {
                if (evnt.code == 'PageDown' || evnt.code == 'ArrowDown') {
                    pageContrl.nextPage();
                } else if (evnt.code == "PageUp" || evnt.code == 'ArrowUp') {
                    pageContrl.prevPage();
                }
            } else {
                if (!useScroll) { return }
                useScroll = false;
                setTimeout(() => { useScroll = true; }, 500)
                if (evnt.deltaY < -3) {
                    pageContrl.prevPage();
                } else if (evnt.deltaY > 3) {
                    pageContrl.nextPage();
                }
            }
        })
    });
}

// Set up pages only if any slider pages are found
if (sections.sections.length != 0) setUpPages();

