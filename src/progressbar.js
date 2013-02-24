/**
 * A minimal configuration wizard widget
 *
 * @name   jWizard jQuery UI Widget
 * @author Dominic Barnes <dominic@dbarnes.info>
 *
 * @requires jQuery
 * @requires jQuery UI Widget Factory
 * @requires jQuery UI ProgressBar
 */
$.widget("db.progressbar", $.ui.progressbar, {
    _create: function () {
        this._super();
        if (this.options.label) this._createLabel();
        this._refreshValue();
    },

    _destroy: function () {
        if (this.options.label) this._destroyLabel();
        this._super();
    },

    _refreshValue: function () {
        this._superApply(arguments);
        if (this.label) this._updateLabel();
    },

    _setOption: function (key) {
        if (key === "value" && this.options.label) {
            this._updateLabel();
        }

        this._superApply(arguments);
    },

    _createLabel: function () {
        this.label = $('<span class="ui-progressbar-label"></span>').appendTo(this.element);
        this._updateLabel();
    },

    _updateLabel: function () {
        var options = this.options,
            text = options.label === "count" ? this._count() : this._percentage() + "%";

        if (options.append) text += " " + options.append;

        this.label.text(text).position({
            my: "center",
            at: "center",
            of: this.element
        });
    },

    _destroyLabel: function () {
        this.label.remove();
    },

    _count: function () {
        return this.value() + " of " + this.options.max;
    },

    options: {
        label:  null, // "percentage", "count", OR null/false
        append: false // text to append to the label
    }
});
