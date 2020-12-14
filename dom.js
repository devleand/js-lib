DOM = {
    get: function (el) {
        return document.querySelector(el);
    },
    gets: function (els) {
        return document.querySelectorAll(els);
    },
    create: function (el) {
        return document.createElement(el);
    },

    // проверяет наличие элемента по селектору
    isEl: function (el) {
        return this.get(el) === null ? false : true;
    },

    // проверяет наличие атрибута у элемента
    hasAttr: function (el, attr) {
        return this.get(el).hasAttribute(attr);
    },
    // возвращает значение атрибута элемента
    getAttr: function (el, attr, isFind = true) {
        if (isFind) {
            return this.get(el).getAttribute(attr);
        } else {
            return el.getAttribute(attr);
        }
    },
    setAttr: function (els, attr, val, isFind = true) {
        if (isFind) {
            let dom_els = this.gets(els), l = dom_els.length;
            for (let i = 0; i < l; i++) {
                dom_els[i].setAttribute(attr, val);
            }
        } else {
            els.setAttribute(attr, val);
        }
    },

    getVal: function (el) {
        return document.querySelector(el).value;
    },
    setVal: function (els, val, isFind = true) {
        if (isFind) {
            let dom_els = this.gets(els), l = dom_els.length;
            for (let i = 0; i < l; i++) {
                dom_els[i].value = val;
            }
        } else {
            els.value = val;
        }
    },

    getTxt: function (el, isFind = true) {
        if (isFind) {
            return this.get(el).textContent;
        } else {
            return el.textContent;
        }
    },
    setTxt: function (els, txt, isFind = true) {
        if (isFind) {
            let dom_els = this.gets(els), l = dom_els.length;
            for (let i = 0; i < l; i++) {
                dom_els[i].textContent = txt;
            }
        } else {
            els.textContent = txt;
        }
    },

    hasClass: function (els, className) {
        className = " " + className + " ";

        let dom_els = this.gets(els), l = dom_els.length;
        for (let i = 0; i < l; i++) {
            if ((" " + dom_els[i].className + " ").replace(/[\n\t]/g, " ").indexOf(className) >= 0) {
                return true;
            }
        }

        return false;
    },
    classGetList: function (el, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.classList;
    },
    classAdd: function (els, _class) {
        let dom_els = this.gets(els), l = dom_els.length;
        for (let i = 0; i < l; i++) {
            this.classGetList(dom_els[i], false).add(_class);
        }
    },

    show: function (els) {
        let dom_els = this.gets(els), l = dom_els.length;
        for (let i = 0; i < l; i++) {
            dom_els[i].style.display = "block";
        }
    },
    hide: function (els) {
        let dom_els = this.gets(els), l = dom_els.length;
        for (let i = 0; i < l; i++) {
            dom_els[i].style.display = "none";
        }
    },

    addEventListener: function (els, event, handler, isIntercept = false, isFind = true) {
        if (isFind) {
            let dom_els = this.gets(els), l = dom_els.length;
            for (let i = 0; i < l; i++) {
                dom_els[i].addEventListener(event, handler, isIntercept);
            }
        } else {
            els.addEventListener(event, handler, isIntercept);
        }
    }
};
