let ChangePageImitation = {
    targetEl: 'body',
    getTargetEl: function () {
        return this.targetEl;
    },

    method: 'GET',
    getDataURL: function () {
        return '';
    },
    getDataBody: function () {
        return null;
    },
    getNewPageUrl: function () {},

    getNewPageTargetHTML: function (callback) {
        let url_data = this.getDataURL();
        let url = this.getNewPageUrl();
        if (url_data.length > 0) {
            url += '?' + url_data;
        }
        let xhr = new XMLHttpRequest();

        xhr.open(this.method, url);
        xhr.responseType = 'document';
        xhr.send(this.getDataBody());

        let _this = this;
        xhr.onload = function () {
            if (this.status == 200) {
                let response = this.response;
                if (Types.isNull(response)) {
                    return;
                }
                callback(DOM.getHTML(DOM.get(_this.getTargetEl(), response), false));
            } else {
                alert("Request failed!");
                throw `HTTP request failed! URL: ${url}. Status: ${this.status} ${this.statusText}`;
            }
        };
        xhr.onerror = function() {
            alert("Request failed!");
            throw `Request failed! URL: ${url}`;
        };
    },

    changePageUrl: function () {
        let new_url = this.getNewPageUrl();
        let data_url = this.getDataURL();
        if (data_url.length > 0) {
            new_url += '?' + data_url;
        }
        history.pushState({}, '', new_url);
    },
    changePageContent: function () {
        let _this = this;
        _this.getNewPageTargetHTML(function (newPageTargetHTML) {
            DOM.setHTML(_this.getTargetEl(), newPageTargetHTML);
        });
    },

    changePage: function () {
        this.changePageContent();
        this.changePageUrl();
    }
};

let SubmitFormImitation = function (targetEl, formObj) {
    this.__proto__ = ChangePageImitation;
    this.targetEl = targetEl;

    this.form   = formObj;
    this.action = DOM.getAttr(formObj, 'action', false);
    this.method = DOM.hasAttr(formObj, 'method', false) ? DOM.getAttr(formObj, 'method', false).toUpperCase() : 'GET';

    this.getNewPageUrl = function () {
        return this.action;
    };

    this.dataURL = new URLSearchParams(new FormData(formObj)).toString();
    this.getDataURL = function () {
        return this.dataURL;
    };

    this.changePage();
};

let FollowingLinkImitation = function (targetEl, linkObj) {
    this.__proto__ = ChangePageImitation;
    this.targetEl = targetEl;
};

let DynamicPage = function (targetEl = 'body') {
    if (!DOM.isEl(targetEl)) {
        throw "Target element not found!";
    }
    this.targetEl = targetEl;

    DOM.addEventListener('html', 'click', this);
};

DynamicPage.prototype = {
    targetEl: undefined,

    /**
     * Если хотите, чтобы при нажатии на элемент смена страницы не имитировалась, присвойте ему данный класс.
     *
     * @var string
     */
    notSubmitClass: 'dynamic-page-not-submit',

    /**
     * Если хотите, чтобы при нажатии на элемент смена страницы имитировалась,
     * минуя автоматическое определение, присвойте ему данный класс. Однако не стоит забывать,
     * что элемент должен быть вложен в рабочую форму или иметь соответствующий атрибут href.
     *
     * @var string
     */
    submitClass: 'dynamic-page-submit',

    formImitationSelector: '.form-imitation',

    getTargetEl: function () {
        return this.targetEl;
    },

    getTagName: function (elObj) {
        return DOM.getTagName(elObj, false).toLowerCase();
    },

    isTagButton: function (tagName) {
        return tagName == 'button';
    },

    isTagLink: function (tagName) {
        return tagName == 'a';
    },

    isTypeSubmit: function (elObj) {
        return DOM.getAttr(elObj, 'type', false).toLowerCase() == 'submit';
    },

    isLinkChangePage: function (elObj) {
        let href = DOM.getAttr(elObj, 'href', false);
        if (href) {
            return href.substring(0, 2) != '#';
        } else {
            return false;
        }
    },

    /**
     * Возвращает true, если переданный элемент должен вызывать смену страницы или false в противном случае.
     *
     * @param Element elObj
     *
     * @return boolean
     */
    isElChangePage: function (elObj) {
        if (Types.isNull(DOM.getParent(elObj, this.getTargetEl(), false))) {
            return false;
        }

        if (DOM.hasClass(elObj, this.submitClass, false)) {
            return true;
        }

        let tag_name = this.getTagName(elObj);
        if (this.isTagButton(tag_name)) {
            return this.isTypeSubmit(elObj);
        } else if (this.isTagLink(tag_name)) {
            return this.isLinkChangePage(elObj);
        }
    },

    getRealFormForImitation: function (imitationObj) {
        let real_form = DOM.create('form');

        let attr = 'method';
        DOM.setAttr(real_form, attr, DOM.getAttr(imitationObj, attr, false), false);
        attr = 'action';
        DOM.setAttr(real_form, attr, DOM.getAttr(imitationObj, attr, false), false);

        function realFormAppendInputs(real_form, inputs) {
            for (let i = 0; i < inputs.length; i++) {
                let input = inputs[i];
                let input_clone = DOM.getClone(input, true, false);
                DOM.setVal(input_clone, DOM.getVal(input, false), false);
                real_form.appendChild(input_clone);
            }
        }

        realFormAppendInputs(real_form, DOM.gets('input', imitationObj));
        realFormAppendInputs(real_form, DOM.gets('select', imitationObj));
        realFormAppendInputs(real_form, DOM.gets('textarea', imitationObj));
        realFormAppendInputs(real_form, DOM.gets('button', imitationObj));

        return real_form;
    },

    getSubmitForm: function (elObj) {
        let form;
        if (DOM.hasAttr(elObj, 'form', false)) {
            form = DOM.get('#' + DOM.getAttr(elObj, 'form', false));
            if (this.getTagName(form) != 'form') {
                form = this.getRealFormForImitation(form);
            }
        } else {
            let form_imitation = DOM.getParent(elObj, this.formImitationSelector, false);
            form = Types.isNull(form_imitation) ? DOM.getParent(elObj, 'form', false) : this.getRealFormForImitation(form_imitation);
        }

        return form;
    },

    handleEvent: function (e) {
        let element = e.target;

        if (!this.isElChangePage(element)) {
            return;
        }
        e.preventDefault();

        let tag_name = this.getTagName(element);
        if (this.isTagButton(tag_name)) {
            if (this.isTypeSubmit(element)) {
                let form = this.getSubmitForm(element);
                if (Types.isNull(form)) {
                    return;
                }
                new SubmitFormImitation(this.getTargetEl(), form);
            }
        } else if (this.isTagLink(tag_name)) {
            new FollowingLinkImitation(this.getTargetEl(), element);
        }
    }
};
