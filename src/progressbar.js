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
        if (this._super) {
            this._super();
        } else {
            $.ui.progressbar.prototype._create.call(this);
        }

        if (this.options.label) this._createLabel();
        this._refreshValue();
    },

    destroy: function () {
        if (this.options.label) this._destroyLabel();

        if (this._super) {
            this._super();
        } else {
            $.ui.progressbar.prototype.destroy.call(this);
        }
    },

    _refreshValue: function () {
        if (this._superApply) {
            this._superApply(arguments);
        } else {
            $.ui.progressbar.prototype._refreshValue.apply(this, arguments);
        }

        if (this.label) this._updateLabel();
    },

    _setOption: function (key) {
        if (key === "value" && this.options.label) {
            this._updateLabel();
        }

        if (this._superApply) {
            this._superApply(arguments);
        } else {
            $.ui.progressbar.prototype._setOption.apply(this, arguments);
        }
    },

    _createLabel: function () {
        if (this.label) return;

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
        this.label = null;
    },

    _count: function () {
        return this.value() + " of " + this.options.max;
    },

    options: {
        label:  null, // "percentage", "count", OR null/false
        append: false // text to append to the label
    }
});
