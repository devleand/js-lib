var FormReset = function (els, isResetAll = false) {
    if (!DOM.isEl(els)) {
        throw `Target elements with selector "${els}" does not exists!`;
    }
    this.els = els;

    if (Types.isBool(isResetAll)) {
        this.isResetAll = isResetAll;
    }

    let body = new DOMElements('body');
    body.on('click', els, this);
};

FormReset.prototype = {
    els: undefined,

    resetInputsParentSelector: '.inputs-reset',

    attrs: {
        defaultValue: 'data-default-value',
    },

    isResetAll: false,

    getInputs: function (els) {
        return DOM.getChildren(els, "input", false);
    },

    getSelects: function (els) {
        return DOM.getChildren(els, "select", false);
    },

    getTextareas: function (els) {
        return DOM.getChildren(els, "textarea", false);
    },

    getDefaultValue: function (input) {
        let attr = this.attrs.defaultValue;
        return DOM.hasAttr(input, attr, false) ? DOM.getAttr(input, attr, false) : '';
    },

    getResetInputsParent: function (form) {
        return this.isResetAll ? form : DOM.getChildren(form, this.resetInputsParentSelector, false);
    },

    getFormInputsAll: function (form) {
        let els = this.getResetInputsParent(form);
        let inputs_all = [];

        let inputs = this.getInputs(els), il = inputs.length;
        for (let i = 0; i < il; i++) {
            inputs_all.push(inputs[i]);
        }

        let selects = this.getSelects(els), sl = selects.length;
        for (let i = 0; i < sl; i++) {
            inputs_all.push(selects[i]);
        }

        let textareas = this.getTextareas(els), tl = textareas.length;
        for (let i = 0; i < tl; i++) {
            inputs_all.push(textareas[i]);
        }

        return inputs_all.length > 0 ? inputs_all : null;
    },

    formReset: function (form) {
        let inputs = this.getFormInputsAll(form);
        if (Types.isNull(inputs)) {
            return;
        }
        let l = inputs.length;
        for (let i = 0; i < l; i++) {
            let input = inputs[i];
            DOM.setVal(input, this.getDefaultValue(input), false);
        }
    },

    handleEvent: function (e) {
        let form = DOM.getParent(e.target, "form", false);
        this.formReset(form);
    }
};
