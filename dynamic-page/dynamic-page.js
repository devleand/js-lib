let ChangePageImitation = {
    /**
     * @type {DOMElements}
     */
    targetEl: undefined,
    /**
     * @return {DOMElements}
     */
    getTargetEl: function () {
        return this.targetEl;
    },

    /**
     * @type {string}
     */
    method: 'GET',
    /**
     * @return {string}
     */
    getDataURL: function () {
        return '';
    },
    /**
     * @return {?any}
     */
    getDataBody: function () {
        return null;
    },
    /**
     * @return {string}
     */
    getNewPageUrl: function () {
        return '';
    },

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

                response = new DOMElements(response);
                let target = _this.getTargetEl().selector ? response.children(_this.getTargetEl().selector) : response;

                callback(target.html());
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

/**
 * @param {DOMElements} targetEl
 * @param {DOMElements} linkObj
 * @constructor
 */
var SubmitFormImitation = function (targetEl, formObj) {
    this.__proto__ = ChangePageImitation;
    this.targetEl = targetEl;

    this.form   = formObj;
    this.action = formObj.attr('action');
    this.method = formObj.hasAttr('method') ? formObj.attr('method').toUpperCase() : 'GET';

    this.getNewPageUrl = function () {
        return this.action;
    };

    this.dataURL = new URLSearchParams(new FormData(formObj.get(0))).toString();
    this.getDataURL = function () {
        return this.dataURL;
    };

    this.changePage();
};

/**
 * @param {DOMElements} targetEl
 * @param {DOMElements} linkObj
 * @constructor
 */
var FollowingLinkImitation = function (targetEl, linkObj) {
    this.__proto__ = ChangePageImitation;
    this.targetEl = targetEl;

    this.getNewPageUrl = function () {
        return this.getTargetEl().attr('href');
    };
};

/**
 * @param {(string | DOMElements | NodeList | Element)} targetEl
 * @constructor
 */
var DynamicPage = function (targetEl = 'body') {
    targetEl = new DOMElements(targetEl);
    if (targetEl.length) {
        throw "Target element not found!";
    }
    this.targetEl = targetEl;

    (new DOMElements('html')).on('click', this);
};

DynamicPage.prototype = {
    /**
     * @type {DOMElements}
     */
    targetEl: undefined,

    /**
     * Если хотите, чтобы при нажатии на элемент смена страницы не имитировалась, присвойте ему данный класс.
     *
     * @type {string}
     */
    notSubmitClass: 'dynamic-page-not-submit',

    /**
     * Если хотите, чтобы при нажатии на элемент смена страницы имитировалась,
     * минуя автоматическое определение, присвойте ему данный класс. Однако не стоит забывать,
     * что элемент должен быть вложен в рабочую форму или иметь соответствующий атрибут href.
     *
     * @type {string}
     */
    submitClass: 'dynamic-page-submit',

    /**
     * @type {string}
     */
    formImitationSelector: '.form-imitation',

    /**
     * @return {DOMElements}
     */
    getTargetEl: function () {
        return this.targetEl;
    },

    /**
     * @param {DOMElements} elObj
     * @return {string}
     */
    getTagName: function (elObj) {
        return elObj.tagName.toLowerCase();
    },

    /**
     * @param {string} tagName
     * @return {boolean}
     */
    isTagButton: function (tagName) {
        return tagName == 'button';
    },

    /**
     * @param {string} tagName
     * @return {boolean}
     */
    isTagLink: function (tagName) {
        return tagName == 'a';
    },

    /**
     * @param {DOMElements} elObj
     * @return {boolean}
     */
    isTypeSubmit: function (elObj) {
        return elObj.attr('type').toLowerCase() == 'submit';
    },

    /**
     * @param {DOMElements} elObj
     * @return {boolean}
     */
    isLinkChangePage: function (elObj) {
        let href = elObj.attr('href');
        if (href) {
            return href.substring(0, 2) != '#';
        } else {
            return false;
        }
    },

    /**
     * Возвращает true, если переданный элемент должен вызывать смену страницы или false в противном случае.
     *
     * @param {DOMElements} elObj
     *
     * @return {boolean}
     */
    isElChangePage: function (elObj) {
        if (Types.isNull(elObj.parent(this.getTargetEl()))) {
            return false;
        }

        if (elObj.hasClass(this.submitClass)) {
            return true;
        }

        let tag_name = this.getTagName(elObj);
        if (this.isTagButton(tag_name)) {
            return this.isTypeSubmit(elObj);
        } else if (this.isTagLink(tag_name)) {
            return this.isLinkChangePage(elObj);
        }
    },

    /**
     * @param {DOMElements} imitationObj
     * @return {DOMElements}
     */
    getRealFormForImitation: function (imitationObj) {
        let real_form = DOMElements.create('form');

        let attr = 'method';
        real_form.attr(attr, imitationObj.attr(attr));
        attr = 'action';
        real_form.attr(attr, imitationObj.attr(attr));

        /**
         * @param {DOMElements} real_form
         * @param {DOMElements} inputs
         */
        function realFormAppendInputs(real_form, inputs) {
            inputs.forEach(function (input) {
                input = new DOMElements(input);
                let input_clone = input.clone();
                input_clone.val(input.val());
                real_form.appendChild(input_clone);
            });
        }

        realFormAppendInputs(real_form, imitationObj.children('input'));
        realFormAppendInputs(real_form, imitationObj.children('select'));
        realFormAppendInputs(real_form, imitationObj.children('textarea'));
        realFormAppendInputs(real_form, imitationObj.children('button'));

        return real_form;
    },

    /**
     * @param {DOMElements} elObj
     * @return {DOMElements}
     */
    getSubmitForm: function (elObj) {
        let form;
        if (elObj.hasAttr('form')) {
            form = new DOMElements('#' + elObj.attr('form'));
            if (this.getTagName(form) != 'form') {
                form = this.getRealFormForImitation(form);
            }
        } else {
            let form_imitation = elObj.parent(this.formImitationSelector);
            form = Types.isNull(form_imitation) ? elObj.parent('form') : this.getRealFormForImitation(form_imitation);
        }

        return form;
    },

    handleEvent: function (e) {
        let element = new DOMElements(e.target);

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
