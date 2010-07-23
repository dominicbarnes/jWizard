/**
 * A wizard widget that actually works with minimal configuration. (per jQuery's design philosophy)
 *
 * @name	jWizard jQuery UI Widget
 * @author	Dominic Barnes
 *
 * @requires jQuery
 * @requires jQuery UI (Widget Factory; ProgressBar optional; Button optional)
 * @version  0.12
 */
/*jslint browser: true, devel: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
"use strict";
(function ($) {
	/**
	 * @class The jWizard object will be fed into $.widget()
	 */
	$.widget("ui.jWizard", {
		/**
		 * @private
		 * @property string _id The id of the current DOM element
		 */
		_id: "",

		/**
		 * @private
		 * @property int _stepIndex Represents the index of the current active/visible step
		 */
		_stepIndex: 0,

		/**
		 * @private
		 * @property int _stepCount Represents the `functional` number of steps
		 */
		_stepCount: 0,

		/**
		 * @private
		 * @property int _actualCount Represents the `actual` number of steps
		 */
		_actualCount: 0,

		/**
		 * @description Initializes jWizard
		 * @return void
		 */
		_create: function() {
			this._id = this.element.attr("id");

			this._buildSteps();
			this._buildTitle();

			if (this.options.menuEnable) {
				this._buildMenu();
			}

			this._buildButtons();

			if (this.options.counter.enable) {
				this._buildCounter();
			}

			this.element.addClass("ui-widget");

			this.element.find(".ui-state-default").live("mouseover mouseout", function(event) {
				if (event.type === "mouseover") {
					$(this).addClass("ui-state-hover");
				} else {
					$(this).removeClass("ui-state-hover");
				}
			});

			this._changeStep(parseInt(this._stepIndex, 10), true);
		},

		/**
		 * @private
		 * @description Additional processing before destroying the widget.
		 *    Will eventually be used to restore everything to it's pre-widget state.
		 * @return void
		 */
		destroy: function() {
		},

		/**
		 * @private
		 * @description Can set options within the widget programmatically
		 * @return void
		 */
		_setOption: function(key, value) {
			var keys = key.split('.');

			if (keys.length > 1) {
				switch (keys[0]) {
					case "buttons":
						this.options[keys[0]][keys[1]] = value;

						switch (keys[1]) {
							case "cancelHide":
								this.element.find(".jw-button-cancel")[value ? "addClass" : "removeClass"]("ui-helper-hidden");
								break;
							case "cancelType":
								this.element.find(".jw-button-cancel").attr("type", value);
								break;
							case "finishType":
								this.element.find(".jw-button-finish").attr("type", value);
								break;
							case "cancelText":
								this.element.find(".jw-button-cancel").text(value);
								break;
							case "previousText":
								this.element.find(".jw-button-previous").text(value);
								break;
							case "nextText":
								this.element.find(".jw-button-next").text(value);
								break;
							case "finishText":
								this.element.find(".jw-button-finish").text(value);
								break;
						}
						break;

					case "counter":
						this.options[keys[0]][keys[1]] = value;

						switch (keys[1]) {
							case "enable":
								if (value) {
									this._buildCounter();
									this._updateCounter();
								} else {
									this._destroyCounter();
								}
								break;
							case "type":
							case "progressbar":
							case "startCount":
							case "startHide":
							case "finishCount":
							case "finishHide":
							case "appendText":
							case "orientText":
								if (this.options.counter.enable) {
									this._updateCounter();
								}
								break;
						}
						break;

					case "effects":
						if (keys.length === 2) {
							this.options[keys[0]][keys[1]] = value;
						} else {
							this.options[keys[0]][keys[1]][keys[2]] = value;
						}
						break;
				}
			} else {
				this.options[keys[0]] = value;

				switch (keys[0]) {
					case "hideTitle":
						this.element.find(".jw-header")[value ? "addClass" : "removeClass"]("ui-helper-hidden");
						break;

					case "menuEnable":
						if (value) {
							this._buildMenu();
							this._updateMenu();
						} else {
							this._destroyMenu();
						}
						break;

					case "counter":
						this._destroyCounter();
						this._buildCounter();
						this._updateCounter();
						break;

					default:
						break;
				}
			}
		},

		/**
		 * @description Jumps to the first step in the wizard's step collection
		 * @return void
		 */
		firstStep: function() {
			this._changeStep(0);
		},

		/**
		 * @description Jumps to the last step in the wizard's step collection
		 * @return void
		 */
		lastStep: function() {
			this._changeStep(this._stepCount - 1);
		},

		/**
		 * @description Jumps to the next step in the wizard's step collection
		 * @return void
		 */
		nextStep: function() {
			this._changeStep(this._stepIndex + 1);
		},

		/**
		 * @description Jumps to the previous step in the wizard's step collection
		 * @return void
		 */
		previousStep: function() {
			this._changeStep(this._stepIndex - 1);
		},

		/**
		 * @description Goes to an arbitrary `step` in the collection based on input
		 * @return void
		 */
		changeStep: function(nextStep) {
			this._changeStep(nextStep);
		},

		/**
		 * @private
		 * @description Internal wrapper for performing animations
		 * @return void
		 */
		_effect: function($element, action, subset, type) {
			type = type || "effect";
			var opt = this.options.effects[action][subset];

			if (!this.options.effects.enable || !this.options.effects[action].enable) {
				opt.duration = -1;
			}

			$element[type](opt.type, opt.options, opt.duration, opt.callback);
		},


		/**
		 * @private
		 * @description Internal wrapper for logging (and potentially debugging)
		 * @return void
		 */
		_log: function() {
			if (this.options.debug && window.console) {
				console.log[console.firebug ? "apply" : "call"](console, Array.prototype.slice.call(arguments));
			}
		},

		/**
		 * @private
		 * @description Generates the header/title
		 * @return void
		 */
		_buildTitle: function() {
			this.element.prepend($('<div class="jw-header ui-widget-header ui-corner-top ' + (this.options.hideTitle ? "ui-helper-hidden" : "") + '"><h2 class="jw-title" /></div>'));
		},

		/**
		 * @private
		 * @description Updates the title
		 * @return void
		 */
		_updateTitle: function(bIsFirstStep) {
			var $title = this.element.find(".jw-title");

			if (!bIsFirstStep) {
				this._effect($title, "title", "hide", "hide");
			}

			$title.text(this.element.find(".jw-step:not(.ui-helper-hidden)").attr("title"));

			if (!bIsFirstStep) {
				this._effect($title, "title", "show", "show");
			}

		},

		/**
		 * @private
		 * @description Initializes the step collection.
		 *    Any direct children <div> (with a title attr) or <fieldset> (with a <legend>) are considered steps, and there should be no other sibling elements.
		 *    All steps without a specified `id` attribute are assigned one based on their index in the collection.
		 *    If the validation plugin is going to be used, a callback is bound to the "deactivate" of each step that tests that step's collection of input's against the validation plugin rules.
		 *    Lastly, a <div> is wrapped around all the steps to isolate them from the rest of the widget.
		 * @return void
		 */
		_buildSteps: function() {
			var $steps = this.element.children("div, fieldset");

			this._stepCount = $steps.length;

			$steps.addClass("jw-step").each(function(x) {
				var $step = $(this);

				if (this.tagName.toLowerCase() === "fieldset") {
					$step.attr("title", $step.find("legend").text());
				}
			});

			if (this.options.validate) {
				$steps.bind("deactivate", function(event) {
					var $inputs = $(this).find(":input");

					if ($inputs.length > 0) {
						return Boolean($inputs.valid());
					}

					return true;
				});
			}

			$steps.hide().wrapAll('<div class="jw-content ui-widget-content ui-helper-clearfix"><div class="jw-steps-wrap" /></div>');
		},

		/**
		 * @private
		 * @description Changes the "active" step.
		 * @param number|jQuery nextStep Either an index or a jQuery object/element
		 * @param bool isInit Behavior needs to change if this is called during _init (as opposed to manually through the global setter)
		 * @return void
		 */
		_changeStep: function(nextStep, bIsFirstStep) {
			var $steps = this.element.find(".jw-step"),
				$currentStep = $steps.filter(":visible");

			bIsFirstStep = bIsFirstStep || false;

			if (typeof $currentStep !== "undefined" && $currentStep.triggerHandler("deactivate") === false) {
				return false;
			}

			if (typeof nextStep === "number") {
				if (nextStep < 0 || nextStep > ($steps.length - 1)) {
					alert("Index " + nextStep + " Out of Range");
					return false;
				}

				this._stepIndex = nextStep;
				nextStep = $steps.eq(nextStep);
			} else if (typeof nextStep === "object") {
				if ( !nextStep.is($steps.selector) ) {
					alert("Supplied Element is NOT one of the Wizard Steps");
					return false;
				}

				this._stepIndex = $steps.index(nextStep);
			}

			$currentStep = nextStep;

			if (typeof $currentStep !== "undefined") {
				this.options.effects.step.hide.callback = $.proxy(function() {
					nextStep.trigger("activate");
					this._effect(nextStep, "step", "show", "show");
				}, this);

				this.element.find(".jw-step").hide();
				this._effect($currentStep, "step", "hide", "hide");
			} else {
				nextStep.trigger("activate");
				this._effect(nextStep, "step", "show", "show");
			}

			this._updateButtons();
			this._updateTitle(bIsFirstStep);
			if (this.options.menuEnable) {
				this._updateMenu();
			}
			if (this.options.counter.enable) {
				this._updateCounter();
			}
		},

		/**
		 * @private
		 * @description Initializes the menu
		 *    Builds the menu based on the collection of steps
		 *    Assigns a class to the main <div> to indicate to CSS that there is a menu
		 *    Binds a click event to each of the <a> that will change the step accordingly when clicked
		 * @return void
		 */
		_buildMenu: function() {
			var tmpHtml = ['<div class="jw-menu-wrap"><div class="jw-menu"><ol>'],
				$menu;

			this.element.addClass("jw-hasmenu");

			this.element.find(".jw-step").each(function(x) {
				tmpHtml.push('<li class="' + ((x === 0) ? "jw-current ui-state-highlight" : "jw-inactive ui-state-disabled") + ' ui-corner-all"><a step="' + x + '">' + $(this).attr('title') + '</a></li>');
			});
			tmpHtml.push("</ol></div></div>");

			this.element.find(".jw-content").prepend($menu = $(tmpHtml.join("")));

			$menu.find("a").click($.proxy(function(event) {
				var $target = $(event.target),
					iNextStep = parseInt($target.attr("step"), 10);

				if ($target.parent().hasClass("jw-active")) {
					this._changeStep(iNextStep, iNextStep <= this._stepIndex);
				}
			}, this));
		},

		/**
		 * @private
		 * @description Removes the 'jw-hasmenu' class and pulls the menu out of the DOM entirely
		 * @return void
		 */
		_destroyMenu: function() {
			this.element.removeClass("jw-hasmenu").find(".jw-menu-wrap").remove();
		},

		/**
		 * @private
		 * @description Updates the menu at the end of each call to _changeStep()
		 *    Each <a> is looped over, along with the parent <li>
		 *    Status (jw-current, jw-active, jw-inactive) set depending on progress through wizard
		 * @see this._changeStep()
		 * @return void
		 */
		_updateMenu: function() {
			var iCurrentStepIndex = this._stepIndex,
				$menu = this.element.find(".jw-menu");

			this._effect($menu.find("li:eq(" + iCurrentStepIndex + ")"), "menu", "change");

			$menu.find("a").each(function(x) {
				var $li = $(this).parent(),
					$a = $(this),
					iStep = parseInt($a.attr("step"), 10),
					sClass = "";

				if ( iStep < iCurrentStepIndex ) {
					sClass += "jw-active ui-state-default ui-corner-all";
				} else if ( iStep === iCurrentStepIndex ) {
					sClass += "jw-current ui-state-highlight ui-corner-all";
				} else if ( iStep > iCurrentStepIndex ) {
					sClass += "jw-inactive ui-state-disabled ui-corner-all";
					$a.removeAttr("href");
				}

				$li.removeClass().addClass(sClass);
			});
		},

		/**
		 * @private
		 * @description Initializes the step counter.
		 *    A new <span> is created and used as the main element
		 * @return void
		 */
		_buildCounter: function() {
			var $counter = $('<span class="jw-counter ui-widget-content ui-corner-all jw-' + this.options.counter.orientText + '" />');

			this.element.find(".jw-footer").prepend($counter);

			if (!this.options.counter.startCount) {
				this._stepCount--;
			}
			if (!this.options.counter.finishCount) {
				this._stepCount--;
			}

			if (this.options.counter.progressbar) {
				$counter.append('<span class="jw-counter-text" />').append('<span class="jw-counter-progressbar" />').find(".jw-counter-progressbar").progressbar();
			}
		},

		/**
		 * @private
		 * @description Removes the counter DOM elements, resets _stepCount
		 * @return void
		 */
		_destroyCounter: function() {
			this.element.find(".jw-counter").remove();
		},

		/**
		 * @private
		 * @description This is run at the end of every call to this._changeStep()
		 * @return void
		 * @see this._changeStep()
		 */
		_updateCounter: function() {
			var $counter = this.element.find(".jw-counter"),
				counterOptions = this.options.counter,
				counterText = "",
				actualIndex = this._stepIndex,
				actualCount = this._stepCount,
				percentage = 0;

			if (!counterOptions.startCount) {
				actualIndex--;
				actualCount--;
			}

			this._effect($counter, "counter", "change");

			percentage = Math.round((actualIndex / actualCount) * 100);

			if (counterOptions.type === "percentage") {
				counterText = ((percentage <= 100) ? percentage : 100) + "%";
			} else if (counterOptions.type === "count") {
				if (actualIndex < 0) {
					counterText = 0;
				} else if (actualIndex > actualCount) {
					counterText = actualCount;
				} else {
					counterText = actualIndex;
				}

				counterText += " of " + actualCount;
			} else {
				counterText = "N/A";
			}

			if (counterOptions.appendText) {
				counterText += " " + counterOptions.appendText;
			}

			if (counterOptions.progressbar) {
				this.element.find(".jw-counter-progressbar").progressbar("option", "value", percentage);
				this.element.find(".jw-counter-text").text(counterText);
			} else {
				$counter.text(counterText);
			}

			if ( (counterOptions.startHide && this._stepIndex === 0) || (counterOptions.finishHide && this._stepIndex === (this._actualCount - 1)) ) {
				$counter.hide();
			} else {
				$counter.show();
			}
		},

		/**
		 * @private
		 * @description This generates the <button> elements for the main navigation and binds `click` handlers to each of them
		 * @see this._changeStep()
		 */
		_buildButtons: function() {
			var buttonOptions = this.options.buttons,
				$footer = $('<div class="jw-footer ui-widget-header ui-corner-bottom" />'),
				cancelButton = null,
				previousButton = null,
				nextButton = null,
				finishButton = null;

			cancelButton = $('<button class="jw-button-cancel ui-state-default ui-priority-secondary ui-corner-all ' + (buttonOptions.cancelHide ? "ui-helper-hidden" : "") + '" type="' + buttonOptions.cancelType + '">' + buttonOptions.cancelText + '</button>')
				.click($.proxy(function(event) {
					this._trigger("cancel", event);
				}, this));

			previousButton = $('<button class="jw-button-previous ui-state-default ui-corner-all" type="button">' + buttonOptions.previousText + '</button>')
				.click($.proxy(this, 'previousStep'));

			nextButton = $('<button class="jw-button-next ui-state-default ui-corner-all" type="button">' + buttonOptions.nextText + '</button>')
				.click($.proxy(this, 'nextStep'));

			finishButton = $('<button class="jw-button-finish ui-state-default ui-state-highlight ui-corner-all" type="' + buttonOptions.finishType + '">' + buttonOptions.finishText + '</button>')
				.click($.proxy(function(event) {
					this._trigger("finish", event);
				}, this));

			if (buttonOptions.jqueryui.enable) {
				cancelButton.button({ icons: { primary: buttonOptions.jqueryui.cancelIcon } });
				previousButton.button({ icons: { primary: buttonOptions.jqueryui.previousIcon } });
				nextButton.button({ icons: { secondary: buttonOptions.jqueryui.nextIcon } });
				finishButton.button({ icons: { secondary: buttonOptions.jqueryui.finishIcon } });
			}

			this.element.append(
				$footer.append($('<div class="jw-buttons" />')
					.append(cancelButton)
					.append(previousButton)
					.append(nextButton)
					.append(finishButton)
			));
		},

		/**
		 * @private
		 * @description Updates the visibility status of each of the buttons depending on the end-user's progress
		 * @see this._changeStep()
		 */
		_updateButtons: function() {
			var $steps = this.element.find(".jw-step"),
				$previousButton = this.element.find(".jw-button-previous"),
				$nextButton = this.element.find(".jw-button-next"),
				$finishButton = this.element.find(".jw-button-finish");

			switch ($steps.index($steps.filter(":visible"))) {
				case 0:
					$previousButton.hide();
					$nextButton.show();
					$finishButton.hide();
					break;

				case $steps.length - 1:
					$previousButton.show();
					$nextButton.hide();
					$finishButton.show();
					break;

				default:
					$previousButton.show();
					$nextButton.show();
					$finishButton.hide();
					break;
			}
		},

		/**
		 * @property object options This is the set of configuration options available to the user.
		 */
		options: {
			validate: false,
			debug: false,

			titleHide: false,
			menuEnable: false,

			buttons: {
				jqueryui: {
					enable: false,
					cancelIcon: "ui-icon-circle-close",
					previousIcon: "ui-icon-circle-triangle-w",
					nextIcon: "ui-icon-circle-triangle-e",
					finishIcon: "ui-icon-circle-check"
				},
				cancelHide: false,
				cancelType: "button",
				finishType: "button",
				cancelText: "Cancel",
				previousText: "Previous",
				nextText: "Next",
				finishText: "Finish"
			},

			counter: {
				enable: false,
				type: "count",
				progressbar: false,
				startCount: true,
				startHide: false,
				finishCount: true,
				finishHide: false,
				appendText: "Complete",
				orientText: "left"
			},

			effects: {
				enable: false,
				step: {
					enable: true,
					hide: {
						type: "slide",
						options: {
							direction: "left"
						},
						duration: "normal",
						callback: $.noop
					},
					show: {
						type: "slide",
						options: {
							direction: "left"
						},
						duration: "normal",
						callback: $.noop
					}
				},
				title: {
					enable: true,
					hide: {
						type: "slide",
						options: {},
						duration: "normal",
						callback: $.noop
					},
					show: {
						type: "slide",
						options: {},
						duration: "normal",
						callback: $.noop
					}
				},
				menu: {
					enable: true,
					change: {
						type: "highlight",
						options: {},
						duration: "normal",
						callback: $.noop
					}
				},
				counter: {
					enable: true,
					change: {
						type: "highlight",
						options: {},
						duration: "normal",
						callback: $.noop
					}
				}
			},

			cancel: $.noop,
			finish: $.noop
		}
	});
}(jQuery));