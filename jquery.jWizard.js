/**
 * A wizard widget that actually works with minimal configuration. (per jQuery's design philosophy)
 *
 * @name	jWizard jQuery Widget
 * @author	Dominic Barnes
 *
 * @requires jQuery
 * @requires jQuery UI (Widget Factory)
 * @version	0.10.0b
 *
 */
(function($) {
	/**
	 * @class The jWizard object will be fed into $.widget()
	 */
	$.widget("ui.jWizard", {
		/**
		 * @private
		 * @property object _cache This is a central place for jQuery() objects can be cached for later use
		 */
		_cache: {},

		/**
		 * @private
		 * @property int _stepIndex Represents the index of the current active/visible step
		 */
		_stepIndex: 0,

		/**
		 * @private
		 * @property int _stepIndex Represents the `functional` number of steps (only used for calculating status, `this._cache.steps.length` is an `actual` count)
		 */
		_stepCount: 0,

		/**
		 * @constructor
		 * @description Initializes the jWizard widget
		 */
		_create: function() {
			$wizard = this._cache.wizard = $(this.element);

			this._buildSteps();
			if (!this.options.titleHide)		this._buildTitle();
			if (this.options.menuEnable)		this._buildMenu();
			this._buildButtons();
			if (this.options.counter.enable)	this._buildCounter();

			$wizard.addClass("ui-widget");

			$wizard.find(".ui-state-default").live("mouseover mouseout", function(event) {
				if (event.type == "mouseover") {
					$(this).addClass("ui-state-hover");
				} else {
					$(this).removeClass("ui-state-hover");
				}
			});

			this._changeStep(parseInt(this._stepIndex), true);
		},

		/** Additional processing before destroying the widget */
		destroy: function() {
		},

		 _setOption: function(key, value) {
			switch (key) {
				default:
					this.options[key] = value;
					break;
			}
		},

		/**  */
		firstStep: function() {
			this._changeStep(0);
		},

		/**  */
		lastStep: function() {
			this._changeStep(this._stepCount - 1);
		},

		/** Proceeds to the next `step` in the collection */
		nextStep: function() {
			this._changeStep(this._stepIndex + 1);
		},
		/** Goes back one `step` in the collection */
		previousStep: function() {
			this._changeStep(this._stepIndex - 1);
		},
		/** Goes to an arbitrary `step` in the collection based on input */
		changeStep: function(nextStep) {
			this._changeStep(nextStep);
		},

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
		 * @description Wrapper for internal logging (and potentially debugging)
		 */
		_log: function() {
			if (this.options.debug)
				window.console && console.log[console.firebug ? "apply" : "call"](console,Array.prototype.slice.call(arguments));
		},

		/**
		 * @private
		 * @description Generates the title region
		 */
		_buildTitle: function() {
			$header = this._cache.header = $('<div id="jw-header" class="ui-widget-header ui-corner-top"><h2 id="jw-title" /></div>');
			this._cache.title = $header.find("#jw-title");
			this._cache.wizard.prepend($header);
		},

		/**
		 * @private
		 * @description Updates the title region
		 */
		_updateTitle: function(bIsFirstStep) {
			$title = this._cache.title;

			if (!bIsFirstStep)
				this._effect($title, "title", "hide", "hide");

			$title.text(this._cache.currentStep.attr("title"));

			if (!bIsFirstStep)
				this._effect($title, "title", "show", "show");

		},

		/**
		 * @private
		 * @description Initializes the step collection.
		 * 	Any direct children <div> are considered steps, and there should be no other sibling elements.
		 * 	All steps without a specified `id` attribute are assigned one based on their index in the collection.
		 * 	If the validation plugin is going to be used, a callback is bound to the "onDeactivate" of each step that tests that step's collection of input's against the validation plugin rules.
		 * 	Lastly, a <div> is wrapped around all the steps to isolate them from the rest of the widget.
		 */
		_buildSteps: function() {
			$wizard = this._cache.wizard;

			var $steps = this._cache.steps = $wizard.children("div, fieldset");

			this._stepCount = $steps.length;

			$steps.each(function(x) {
				$step = $(this);
				if ($step.attr("id") == "")
					$step.attr("id", "jw-step" + x);

				if (this.tagName.toLowerCase() == "fieldset")
					$step.attr("title", $step.find("legend").text());
			});

			if (this.options.validate) {
				$steps.bind("onDeactivate", function(e) {
					var $inputs = $(this).find(":input");

					if ($inputs.length > 0) {
						return Boolean($inputs.valid());
					}

					return true;
				});
			}

			this._cache.steps = $steps.hide().wrapAll('<div id="jw-content" class="ui-widget-content clearfix"><div id="jw-steps-wrap" /></div>');
			this._cache.content = $wizard.find("#jw-content");
		},

		/**
		 * @private
		 * @description Changes the "active" step.
		 * @param number|jQuery nextStep Either an index or a jQuery object/element
		 * @param bool isInit Behavior needs to change if this is called during _init (as opposed to manually through the global setter)
		 */
		_changeStep: function(nextStep, bIsFirstStep) {
			$wizard = this._cache.wizard,
				$steps = this._cache.steps,
				$currentStep = this._cache.currentStep,
				bIsFirstStep = bIsFirstStep || false;

			if (typeof $currentStep !== "undefined" && $currentStep.triggerHandler("onDeactivate") === false)
				return false;

			if (bIsFirstStep && this.options.effects.step.enable)
				this.options.effects.step.enable = false;

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

			this._cache.currentStep = nextStep;

			if (typeof $currentStep !== "undefined") {
				this.options.effects.step.hide.callback = $.proxy(function() {
					nextStep.trigger("onActivate");
					this._effect(nextStep, "step", "show", "show");
				}, this);

				this.options.effects.step.show.callback = $.proxy(function() {
					this._cache.currentStep.siblings().hide();
				}, this);

				this._effect($currentStep, "step", "hide", "hide");
			} else {
				nextStep.trigger("onActivate");
				this._effect(nextStep, "step", "show", "show");
			}

			if (bIsFirstStep && !this.options.effects.step.enable)
				this.options.effects.step.enable = true;

			this._updateButtons();
			if (!this.options.titleHide)		this._updateTitle(bIsFirstStep);
			if (this.options.menuEnable)		this._updateMenu();
			if (this.options.counter.enable)	this._updateCounter();
		},

		/**
		 * @private
		 * @description Initializes the menu
		 * 	Builds the menu based on the collection of steps
		 * 	Assigns some CSS properties for the layout
		 * 	Binds a click event to each of the <li> that will change the step accordingly
		 */
		_buildMenu: function() {
			this._cache.wizard.addClass("jw-hasmenu");

			var tmpHtml = ['<div id="jw-menu-wrap"><div id="jw-menu"><ol>'];

			this._cache.steps.each(function(x) {
				tmpHtml.push('<li class="' + ((x === 0) ? "jw-current ui-state-highlight" : "jw-inactive ui-state-disabled") + ' ui-corner-all"><a step="' + x + '">' + $(this).attr('title') + '</a></li>');
			});
			tmpHtml.push("</ol></div></div>");

			this._cache.content.prepend(this._cache.menu = $(tmpHtml.join("")));

			this._cache.menu.find("a").click($.proxy(function(event) {
				$target = $(event.target);
				var iNextStep = parseInt($target.attr("step"));

				if ($target.parent().hasClass("jw-active"))
					this._changeStep(iNextStep, iNextStep <= this._stepIndex);
			}, this));
		},

		/**
		 * @private
		 * @description Updates the menu at the end of each call to _changeStep()
		 * 	Each <a> is looped over, along with the parent <li>
		 * 	Status (current, active, inactive) set depending on progress through wizard
		 * @see this.changeStep()
		 */
		_updateMenu: function() {
			var iCurrentStepIndex = this._stepIndex,
				$currentStep = this._cache.currentStep,
				$menu = this._cache.menu,
				menuItemStatus = "jw-active";

			this._effect(this._cache.menu.find("li:eq(" + iCurrentStepIndex + ")"), "menu", "change");

			$menu.find("a").each(function(x) {
				var $li = $(this).parent(),
					$a = $(this),
					iStep = parseInt($a.attr("step")),
					sClass = "";

				if ( iStep < iCurrentStepIndex ) {
					sClass += "jw-active ui-state-default ui-corner-all";
				} else if ( iStep == iCurrentStepIndex ) {
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
		 * 	A new <span> is created and used as the main element
		 */
		_buildCounter: function() {
			$counter = this._cache.counter = $('<span id="jw-counter" class="ui-widget-content ui-corner-all jw-' + this.options.counter.orientText + '" />'),
				$wizard = this._cache.wizard,
				$footer = this._cache.footer;

			$footer.prepend($counter);

			if (!this.options.counter.startCount)
				this._stepCount--;
			if (!this.options.counter.finishCount)
				this._stepCount--;

			if (this.options.counter.startCount && this._stepIndex > 0)
				this._stepIndex++;

			if (this.options.counter.progressbar) {
				$counter.append('<span id="jw-counter-text" />').append('<span id="jw-counter-progressbar" />');
				this._cache.progressbar = $counter.find("#jw-counter-progressbar").progressbar()
				this._cache.progresstext = $counter.find("#jw-counter-text");
			}
		},

		/**
		 * @private
		 * @description This is run at the end of every call to this.changeStep()
		 * 	TODO: ...
		 * @see this.changeStep()
		 */
		_updateCounter: function() {
			$wizard = this._cache.wizard,
				$counter = this._cache.counter,
				counterOptions = this.options.counter,
				counterText = "",
				actualIndex = this._stepIndex,
				actualCount = this._stepCount;

			if (!counterOptions.startCount) {
				actualIndex--;
				actualCount--;
			}

			this._effect($counter, "counter", "change");

			var percentage = Math.round((actualIndex / actualCount) * 100);

			if (counterOptions.type == "percentage") {
				counterText = ((percentage <= "100") ? percentage : "100") + "%";
			} else if (counterOptions.type == "count") {
				if (actualIndex < 0)
					counterText = 0;
				else if (actualIndex > actualCount)
					counterText = actualCount;
				else
					counterText = actualIndex;

				counterText += " of " + actualCount;
			} else {
				counterText = "N/A";
			}

			if (counterOptions.appendText)
				counterText += " " + counterOptions.appendText;

			if (counterOptions.progressbar) {
				this._cache.progressbar.progressbar("option", "value", percentage);
				this._cache.progresstext.text(counterText);
			} else {
				$counter.text(counterText);
			}

			if ( (counterOptions.startHide && this._stepIndex == 0)
				|| (counterOptions.finishHide && this._stepIndex == (this._cache.steps.length - 1)) )
				$counter.hide();
			else {
				$counter.show();
			}
		},

		/**
		 * @private
		 * @description This generates the <button> elements for the main navigation and binds `click` handlers to each of them
		 */
		_buildButtons: function() {
			$wizard = this._cache.wizard,
			$currentStep = this._cache.currentStep,
			buttonOptions = this.options.buttons;

			var cancelButton = this._cache.cancelButton = $('<button id="jw-btnCancel" class="ui-state-default ui-priority-secondary ui-corner-all" type="' + buttonOptions.cancelType + '">' + buttonOptions.cancelText + '</button>')
				.click($.proxy(this.options.events.onCancel, this));

			var previousButton = this._cache.previousButton = $('<button id="jw-btnPrevious" class="ui-state-default ui-corner-all" type="button">' + buttonOptions.previousText + '</button>')
				.click($.proxy(this, 'previousStep'));

			var nextButton = this._cache.nextButton = $('<button id="jw-btnNext" class="ui-state-default ui-corner-all" type="button">' + buttonOptions.nextText + '</button>')
				.click($.proxy(this, 'nextStep'));

			var finishButton = this._cache.finishButton = $('<button id="jw-btnFinish" class="ui-state-default ui-state-highlight ui-corner-all" type="' + buttonOptions.finishType + '">' + buttonOptions.finishText + '</button>')
				.click($.proxy(this.options.events.onFinish, this));

			$footer = this._cache.footer = $('<div id="jw-footer" class="ui-widget-header ui-corner-bottom" />');
			$wizard.append(
				$footer.append(this._cache.buttons = $('<div id="jw-buttons" />')
					.append(cancelButton)
					.append(previousButton)
					.append(nextButton)
					.append(finishButton)
			));
		},

		/**
		 * @private
		 * @description Updates the visibility status of each of the buttons depending on the end-user's progress
		 */
		_updateButtons: function() {
			var $steps = this._cache.steps,
				$currentStep = this._cache.currentStep,
				$previousButton = this._cache.previousButton,
				$nextButton = this._cache.nextButton,
				$finishButton = this._cache.finishButton;

			switch ($currentStep.attr("id")) {
				case $steps.first().attr("id"):
					$previousButton.hide();
					$nextButton.show();
					$finishButton.hide();
					break;

				case $steps.last().attr("id"):
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
				},
			},

			events: {
				onCancel: $.noop,
				onFinish: $.noop
			}
		}
	});
})(jQuery);