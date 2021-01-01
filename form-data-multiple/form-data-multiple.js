let FormDataMultiple = function (forms) {
    if (!DOM.isEl(forms)) {
        throw "Target forms does not exists!";
    }
    this.forms = forms;

    DOM.addEventListener(forms, 'submit', this);
};

FormDataMultiple.prototype = {
    forms: undefined,

    attrs: {
        additionalDataSelectors: 'data-additional-data-selectors'
    },

    getAdditionalDataSelectors: function (el) {
        let attr = this.attrs.additionalDataSelectors;
        if (!DOM.hasAttr(el, attr, false)) {
            throw `Required attribute "${attr}" does not set!`;
        }
        let additionalDataSelectors = DOM.getAttr(el, attr, false);
        try {
            additionalDataSelectors = JSON.parse(additionalDataSelectors);
        } catch (e) {
            throw `Attribute "${attr}" is incorrect!`;
        }

        return additionalDataSelectors;
    },

    getAdditionalDataEl: function (selector) {
          if (!DOM.isEl(selector)) {
              throw `Element with selector "${selector}" does not exists!`;
          }
          return DOM.get(selector).cloneNode(true);
    },

    getAdditionalData: function (el) {
        let selectors = this.getAdditionalDataSelectors(el), l = selectors.length;
        let additional_data = DOM.create('div');
        for (let i = 0; i < l; i++) {
            additional_data.appendChild(this.getAdditionalDataEl(selectors[i]));
        }
        DOM.hide(additional_data, false);

        return additional_data;
    },

    handleEvent: function (e) {
        let form = e.currentTarget;
        form.appendChild(this.getAdditionalData(form));
        form.submit();
    }
};
