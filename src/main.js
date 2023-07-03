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

var documentElement = document.querySelector("html");

var sections = new SectController(document.querySelectorAll(".section"));
var pageContrl = new PageController(sections, documentElement);

document.addEventListener('swiped-left', () => {
    pageContrl.prevPage();
});

document.addEventListener('swiped-right', () => {
    pageContrl.nextPage();
});

window.onload = () => {
    pageContrl.pageAt(0);
}

var useScroll = true;

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


