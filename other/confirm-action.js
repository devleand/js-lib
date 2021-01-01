let ConfirmAction = function (data) {
    if (!DOM.isEl(data.els)) {
        throw "Target elements not found!";
    }
    this.els = data.els;
    if (Types.isString(data.question)) {
        this.question = data.question;
    }

    DOM.addEventListener('html', 'click', this);
}

ConfirmAction.prototype = {
    els: undefined,
    question: 'Вы уверены, что хотите совершить данное действие?',

    attrs: {
        isSubmitTrigger: 'data-is-submit-trigger'
    },

    defaults: {
        isSubmitTrigger: false
    },

    isSubmitTriggerCheck: function (el) {
        let attr = this.attrs.isSubmitTrigger;
        return DOM.hasAttr(el, attr, false) ? Types.toBool(DOM.getAttr(el, attr, false)) : this.defaults.isSubmitTrigger;
    },

    handleEvent: function (e) {
        let target = e.target;

        if (!target.matches(this.els)) return;

        e.preventDefault();

        if (confirm(this.question)) {
            let form = DOM.getParent(target, 'form', false);
            if (this.isSubmitTriggerCheck(target)) {
                DOM.trigger(form, 'submit', false);
            } else {
                form.submit();
            }
        }
    }
};
