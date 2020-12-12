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
        return document.querySelector(el) === null ? false : true;
    },

    // проверяет наличие атрибута у элемента
    hasAttr: function (el, attr) {
        return document.querySelector(el).hasAttribute(attr);
    },
    // возвращает значение атрибута элемента
    getAttr: function (el, attr, isFind = true) {
        if (isFind) {
            return document.querySelector(el).getAttribute(attr);
        } else {
            return el.getAttribute(attr);
        }
    },
    setAttr: function (el, attr, val, isFind = true) {
        if (isFind) {
            return document.querySelector(el).setAttribute(attr, val);
        } else {
            return el.setAttribute(attr, val);
        }
    },

    getVal: function (el) {
        return document.querySelector(el).value;
    },
    setVal: function (el, val, isFind = true) {
        if (isFind) {
            document.querySelector(el).value = val;
        } else {
            el.value = val;
        }
    },

    getTxt: function (el, isFind = true) {
        if (isFind) {
            return document.querySelector(el).textContent;
        } else {
            return el.textContent;
        }
    },
    setTxt: function (el, txt, isFind = true) {
        if (isFind) {
            document.querySelector(el).textContent = txt;
        } else {
            el.textContent = txt;
        }
    },

    hasClass: function (el, className) {
        className = " " + className + " ";

        let els = this.gets(el);
        for (let i = 0; i < els.length; i++) {
            if ((" " + els[i].className + " ").replace(/[\n\t]/g, " ").indexOf(className) >= 0) {
                return true;
            }
        }

        return false;
    },
    classGetList: function (el) {
        return this.get(el).classList;
    },
    classAdd: function (el, _class) {
        this.classGetList(el).add(_class);
    },

    show: function (el) {
        this.get(el).style.display = "block";
    },
    hide: function (el) {
        this.get(el).style.display = "none";
    },

    addEventListener: function (el, event, handler, isIntercept = false, isFind = true) {
        if (isFind) {
            el = this.get(el);
        }
        el.addEventListener(event, handler, isIntercept);
    }
};