DOM = {
    get: function (el) {
        return document.querySelector(el);
    },
    gets: function (selector, parent = null) {
        if (Types.isNull(parent)) {
            parent = document;
        }
        return parent.querySelectorAll(selector);
    },
    getParent: function (el, selector, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        return el.closest(selector);
    },
    getChildren: function (el, selector, isFind = true) {
        let dom_els, l;
        if (isFind) {
            dom_els = this.gets(el);
            l       = dom_els.length;
        } else {
            if (Types.isNodeList(el)) {
                dom_els = el;
                l       = el.length;
            } else {
                dom_els = [ el ];
                l       = 1;
            }
        }

        let children = [];
        for (let i = 0; i < l; i++) {
            if (i == 0) {
                children = this.gets(selector, dom_els[i]);
            } else {
                children.after(this.gets(selector, dom_els[i]));
            }
        }

        return children;
    },
    create: function (el) {
        return document.createElement(el);
    },

    // проверяет наличие элементов по селектору
    isEl: function (selector) {
        return this.gets(selector).length > 0 ? true : false;
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
        let dom_els, l;
        if (isFind) {
            dom_els = this.gets(els);
            l       = dom_els.length;
        } else {
            if (Types.isNodeList(els)) {
                dom_els = els;
                l       = els.length;
            } else {
                dom_els = [ els ];
                l       = 1;
            }
        }

        for (let i = 0; i < l; i++) {
            dom_els[i].setAttribute(attr, val);
        }
    },

    getVal: function (el) {
        return document.querySelector(el).value;
    },
    setVal: function (els, val, isFind = true) {
        let dom_els, l;
        if (isFind) {
            dom_els = this.gets(els);
            l       = dom_els.length;
        } else {
            if (Types.isNodeList(els)) {
                dom_els = els;
                l       = els.length;
            } else {
                dom_els = [ els ];
                l       = 1;
            }
        }

        for (let i = 0; i < l; i++) {
            dom_els[i].value = val;
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
        let dom_els, l;
        if (isFind) {
            dom_els = this.gets(els);
            l       = dom_els.length;
        } else {
            if (Types.isNodeList(els)) {
                dom_els = els;
                l       = els.length;
            } else {
                dom_els = [ els ];
                l       = 1;
            }
        }

        for (let i = 0; i < l; i++) {
            dom_els[i].textContent = txt;
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
        let dom_els, l;
        if (isFind) {
            dom_els = this.gets(els);
            l       = dom_els.length;
        } else {
            if (Types.isNodeList(els)) {
                dom_els = els;
                l       = els.length;
            } else {
                dom_els = [ els ];
                l       = 1;
            }
        }

        for (let i = 0; i < l; i++) {
            dom_els[i].addEventListener(event, handler, isIntercept);
        }
    }
};
