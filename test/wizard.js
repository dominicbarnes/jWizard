describe("$.db.jWizard", function () {
    var $wizard = $("#wizard"),
        // set to 0 to disable animations (for smoke testing)
        // a short animation time helps to accomplish the same effect as async
        // animations, but without causing the test to take longer to run
        DURATION = 10;

    before(function () {
        var o = $.db.jWizard.prototype.options.effects;

        if (DURATION === 0) {
            $.fx.off = true;
        } else {
            o.steps.hide.duration = DURATION;
            o.steps.show.duration = DURATION;
        }
    });

    after(function () {
        $wizard.hide();
    });

    describe("#create()", function () {
        before(function () {
            $wizard.jWizard();
        });

        after(function () {
            $wizard.jWizard("destroy");
        });

        it("should add 'ui-widget' and 'jw-widget' classes to root", function () {
            $expect($wizard).to.have.class("ui-widget jw-widget");
        });

        describe(".jw-header", function () {
            var $header, $title;

            before(function () {
                $header = $wizard.children(".jw-header");
                $title  = $header.children(".jw-title");
            });

            it("should create a header", function () {
                $expect($header).to.exist()
                    .and.have.class("ui-widget-header ui-corner-top");
            });

            it("should create a title element", function () {
                $expect($title).to.exist();
            });

            it("should set the title as the first step's title", function () {
                $expect($title).to.have.text($wizard.find("legend").text());
            });
        });

        describe(".jw-content", function () {
            var $content, $menuWrap, $menu, $stepsWrap, $steps;

            before(function () {
                $content   = $wizard.children(".jw-content");
                $menuWrap  = $content.children(".jw-menu-wrap");
                $menu      = $menuWrap.children(".jw-menu");
                $stepsWrap = $content.children(".jw-steps-wrap");
                $steps     = $stepsWrap.children(".jw-step");
            });

            it("should create a content region (with some utility classes)", function () {
                $expect($content).to.exist()
                    .and.have.class("ui-widget-content ui-helper-clearfix");
            });

            it("should create a wrapper for steps", function () {
                $expect($stepsWrap).to.exist();
            });

            it("should have 3 steps", function () {
                $expect($steps).to.have.items(3);
            });

            it("should make the first step visible (and others invisible)", function () {
                testVisibility($steps.first());
            });

            it("should create a menu wrapper element", function () {
                $expect($menuWrap).to.exist();
            });

            it("should create a menu element", function () {
                $expect($menu).to.exist();
            });

            it("should create a menu widget", function () {
                $expect($menu).to.have.class("ui-menu");
            });
        });

        describe(".jw-footer", function () {
            var $footer, $buttons, $prev, $next, $finish;

            before(function () {
                $footer  = $wizard.children(".jw-footer");
                $buttons = $footer.children(".jw-buttons");
                $prev    = $buttons.children(".jw-button-prev");
                $next    = $buttons.children(".jw-button-next");
                $finish  = $buttons.children(".jw-button-finish");
            });

            it("should create a footer", function () {
                $expect($footer).to.exist()
                    .and.have.class("ui-widget-header ui-corner-bottom");
            });

            it("should create a wrapper for the buttons", function () {
                $expect($buttons).to.exist();
            });

            describe("cancel button", function () {
                var $cancel;

                before(function () {
                    $cancel = $buttons.children(".jw-button-cancel");
                });

                it("should create a button element", function () {
                    $expect($cancel).to.exist()
                        .and.have.attr("type", "reset")
                        .and.have.class("ui-state-default ui-corner-all")
                        .and.have.class("ui-priority-secondary");
                });

                it("should trigger cancel when clicked", function (done) {
                    $expect($wizard).to.trigger("wizardcancel").always(done);

                    $cancel.click();
                });
            });

            describe("previous button", function () {
                var $prev;

                before(function () {
                    $prev = $buttons.children(".jw-button-prev");
                });

                beforeEach(function (done) {
                    $wizard.jWizard("last").always(done);
                });

                it("should create a button element", function () {
                    $expect($prev).to.exist()
                        .and.have.attr("type", "button")
                        .and.have.class("ui-state-default ui-corner-all")
                        .and.be.visible();
                });

                it("should call wizard#prev()", function (done) {
                    var $step = $wizard.find(".jw-step").slice(-2, -1);

                    $step.one("stepshown", function () {
                        testVisibility($step);
                        done();
                    });

                    $prev.click();
                });

                it("should not be visible on the first step", function (done) {
                    $wizard.jWizard("first")
                        .always(function () {
                            $expect($prev).to.not.be.visible();
                        })
                        .always(done);
                });
            });

            describe("next button", function () {
                var $next;

                before(function () {
                    $next = $buttons.children(".jw-button-next");
                });

                beforeEach(function (done) {
                    $wizard.jWizard("first").always(done);
                });

                it("should create a button element", function () {
                    $expect($next).to.exist()
                        .and.have.attr("type", "button")
                        .and.have.class("ui-state-default ui-corner-all")
                        .and.be.visible();
                });

                it("should call wizard#next()", function (done) {
                    $wizard.one("stepshown", function () {
                        testVisibility($wizard.find(".jw-step").slice(-2, -1));
                        done();
                    });

                    $next.click();
                });

                it("should not be visible on the last step", function (done) {
                    $wizard.jWizard("last")
                        .always(function () {
                            $expect($next).to.not.be.visible();
                        })
                        .always(done);
                });
            });

            describe("finish button", function () {
                var $finish;

                before(function () {
                    $finish = $buttons.children(".jw-button-finish");
                });

                beforeEach(function (done) {
                    $wizard.jWizard("last").always(done);
                });

                it("should create a button element", function () {
                    $expect($finish).to.exist()
                        .and.have.attr("type", "submit")
                        .and.have.class("ui-state-default ui-corner-all")
                        .and.have.class("ui-state-highlight")
                        .and.be.visible();
                });

                it("should trigger finish when clicked", function (done) {
                    $expect($wizard).to.trigger("wizardfinish").always(done);

                    $finish.click();
                });

                it("should only be visible on the last step", function (done) {
                    $expect($finish).to.be.visible();

                    var tests = [];

                    $wizard.find(".jw-step").slice(0, -1).each(function (x) {
                        var p = $wizard.jWizard("step", x).done(function () {
                            $expect($finish).to.not.be.visible();
                        });

                        tests.push(p);
                    });

                    $.when.apply(null, tests).done(done);
                });
            });
        });
    });

    describe("#destroy()", function () {
        before(function () {
            $wizard.jWizard().jWizard("destroy");
        });

        it("should remove the ui-widget and jw-widget classes", function () {
            $expect($wizard).to.not.have.class("ui-widget jw-widget");
        });

        it("should remove the jw-hasprogress class", function () {
            $expect($wizard).to.not.have.class("jw-hasprogress");
        });

        it("should remove the header region", function () {
            $expect($wizard).to.not.have.children(".jw-header");
        });

        it("should remove the content region", function () {
            $expect($wizard).to.not.have.children(".jw-content");
        });

        it("should remove the steps wrapper", function () {
            $expect($wizard).to.not.find(".jw-steps-wrap");
        });

        it("should remove the jw-step class from all steps", function () {
            $expect($wizard).to.not.find(".jw-step");
        });

        it("should remove the footer region", function () {
            $expect($wizard).to.not.have.children(".jw-footer");
        });
    });

    describe("#step()", function () {
        var $steps;

        before(function () {
            $wizard.jWizard();
            $steps = $wizard.find(".jw-step");
        });

        after(function () {
            $wizard.jWizard("destroy");
        });

        describe("method", function () {
            it("should accept a number (index)", function (done) {
                $wizard.jWizard("step", 2)
                    .always(function () {
                        testVisibility($steps.eq(2));
                    })
                    .always(done);
            });

            it("should accept a $ object", function (done) {
                $wizard.jWizard("step", $steps.last())
                    .always(function () {
                        testVisibility($steps.last());
                    })
                    .always(done);
            });
        });

        describe("title", function () {
            it("should use the legend text", function (done) {
                var $step = $steps.first(),
                    title = $step.find("legend").text();

                $wizard.jWizard("step", $step)
                    .always(function () {
                        $expect($wizard).to.have(".jw-title").that.has.text(title);
                    })
                    .always(done);
            });

            it("should use the title attribute", function (done) {
                var $step = $steps.eq(1),
                    title = $step.attr("title");

                $wizard.jWizard("step", $step)
                    .always(function () {
                        $expect($wizard).to.have(".jw-title").that.has.text(title);
                    })
                    .always(done);
            });

            it("should use the data-jwizard-title attribute", function (done) {
                var $step = $steps.eq(1),
                    title = $step.attr("data-jwizard-title");

                $wizard.jWizard("step", $step)
                    .always(function () {
                        $expect($wizard).to.have(".jw-title").that.has.text(title);
                    })
                    .always(done);
            });
        });

        describe("progress", function () {
            before(function (done) {
                $wizard.jWizard("step", 1).always(done);
            });

            it("should update the progressbar text", function () {
                $expect($wizard).to.have(".jw-progress").that.has.text("1 of 3 Complete");
            });
        });

        describe("menu", function () {
            var step = 1, $items;

            before(function (done) {
                $items = $wizard.find(".jw-menu > li");

                $wizard.jWizard("step", step).always(done);
            });

            it("should not have any extra classes before the active step", function () {
                $expect($items.slice(0, step))
                    .to.not.have.class("ui-state-highlight ui-state-disabled");
            });

            it("should have both a highlight and disabled class on the active step", function () {
                $expect($items.eq(1))
                    .to.have.class("ui-state-highlight ui-state-disabled");
            });

            it("should have only a disabled class after the active step", function () {
                $expect($items.slice(step + 1))
                    .to.have.class("ui-state-disabled")
                    .and.not.have.class("ui-state-highlight");
            });
        });

        describe("events", function () {
            beforeEach(function (done) {
                $wizard.jWizard("first").always(done);
            });

            it("should trigger stephide", function (done) {
                $expect($steps.first()).to.trigger("stephide").always(done);

                $wizard.jWizard("next");
            });

            it("should trigger stephidden", function (done) {
                $expect($steps.first()).to.trigger("stephidden").always(done);

                $wizard.jWizard("next");
            });

            it("should trigger stepshow", function (done) {
                $expect($steps.eq(1)).to.trigger("stepshow").always(done);

                $wizard.jWizard("next");
            });

            it("should trigger stepshown", function (done) {
                $expect($steps.eq(1)).to.trigger("stepshown").always(done);

                $wizard.jWizard("next");
            });

            it("should cancel the transition (before hide)", function (done) {
                var $step = $steps.first();

                $step.one("stephide", function () {
                    return false;
                });

                $wizard.jWizard("next")
                    .always(function () {
                        testVisibility($step);
                    })
                    .done(done);
            });

            it("should cancel the transition (before show)", function (done) {
                $steps.eq(1).one("stepshow", function () {
                    return false;
                });

                $wizard.jWizard("next")
                    .always(function () {
                        testVisibility($steps.first());
                    })
                    .done(done);
            });
        });
    });

    describe("#first()", function () {
        var $steps;

        before(function () {
            $wizard.jWizard();
            $steps = $wizard.find(".jw-step");
        });

        beforeEach(function (done) {
            $wizard.jWizard("last").always(done);
        });

        after(function () {
            $wizard.jWizard("destroy");
        });

        it("should jump to the first step", function (done) {
            var $step = $steps.first();

            $expect($step).to.trigger("stepshown", function () {
                testVisibility($step);
            }).always(done);

            $wizard.jWizard("first");
        });
    });

    describe("#last()", function () {
        var $steps;

        before(function () {
            $wizard.jWizard();
            $steps = $wizard.find(".jw-step");
        });

        after(function () {
            $wizard.jWizard("destroy");
        });

        it("should jump to the last step", function (done) {
            $wizard.jWizard("last")
                .always(function () {
                    testVisibility($steps.last());
                })
                .always(done);
        });
    });

    describe("#next()", function () {
        var $steps;

        before(function () {
            $wizard.jWizard();
            $steps = $wizard.find(".jw-step");
        });

        beforeEach(function (done) {
            $wizard.jWizard("first").always(done);
        });

        after(function () {
            $wizard.jWizard("destroy");
        });

        it("should advance to step 2", function (done) {
            var $step = $steps.eq(1);

            $expect($step).to.trigger("stepshown", function () {
                testVisibility($step);
            }).always(done);

            $wizard.jWizard("next");
        });
    });

    describe("#prev()", function () {
        var $steps;

        before(function () {
            $wizard.jWizard();
            $steps = $wizard.find(".jw-step");
        });

        beforeEach(function (done) {
            $wizard.jWizard("last").always(done);
        });

        after(function () {
            $wizard.jWizard("destroy");
        });

        it("should go back to step 2", function (done) {
            var $step = $steps.slice(-2, -1);

            $expect($step).to.trigger("stepshown", function () {
                testVisibility($step);
            }).always(done);

            $wizard.jWizard("prev");
        });
    });

    describe(".options", function () {
        describe(".title", function () {
            before(function () {
                $wizard.jWizard({ title: false });
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should not create a header or title element", function () {
                $expect($wizard).to.not.have(".jw-header, .jw-title");
            });

            it("should add the header element", function () {
                $wizard.jWizard("option", "title", true);

                $expect($wizard).to.have(".jw-header").that.have.items(1);
            });

            it("should remove the header element", function () {
                $wizard.jWizard("option", "title", true);
                $wizard.jWizard("option", "title", false);

                $expect($wizard).to.not.have(".jw-header");
            });
        });

        describe(".menu", function () {
            before(function () {
                $wizard.jWizard({ menu: false });
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should not include the jw-hasmenu class on the root", function () {
                $expect($wizard).to.not.have.class("jw-hasmenu");
            });

            it("should not create a menu element", function () {
                $expect($wizard).to.not.have(".jw-menu-wrap, .jw-menu");
            });

            it("should add the menu element", function () {
                $wizard.jWizard("option", "menu", true);

                $expect($wizard).to.have(".jw-menu-wrap").that.have.items(1);
            });

            it("should remove the menu element", function () {
                $wizard.jWizard("option", "menu", true);
                $wizard.jWizard("option", "menu", false);

                $expect($wizard).to.not.have(".jw-menu-wrap");
            });
        });

        describe(".buttons", function () {
            describe(".cancel", function () {
                before(function () {
                    $wizard.jWizard({
                        buttons: { cancel: false }
                    });
                });

                after(function () {
                    $wizard.jWizard("destroy");
                });

                it("should not add a cancel button", function () {
                    $expect($wizard).to.not.have("button.jw-button-cancel");
                });

                it("should restore the cancel button", function () {
                    var original = $.db.jWizard.prototype.options.buttons.cancel;

                    $wizard.jWizard("option", "buttons.cancel", original);

                    $expect($wizard).to.have("button.jw-button-cancel");
                });
            });

            describe(".prev", function () {
                before(function () {
                    $wizard.jWizard({
                        buttons: {
                            prev: {
                                text: "Back"
                            }
                        }
                    });
                });

                after(function () {
                    $wizard.jWizard("destroy");
                });

                it("should change attributes of the previous button", function () {
                    $expect($wizard).to.have("button.jw-button-prev")
                        .that.has.text("Back");
                });

                it("should not change other default attributes of the previous button", function () {
                    $expect($wizard).to.have("button.jw-button-prev")
                        .that.has.attr("type", "button");
                });

                it("should change the text of the button", function () {
                    $wizard.jWizard("option", "buttons.prev.text", "Go Back");

                    $expect($wizard).to.have("button.jw-button-prev").that.has.text("Go Back");
                });
            });

            describe(".next", function () {
                before(function () {
                    $wizard.jWizard({
                        buttons: {
                            next: {
                                text: "Forward"
                            }
                        }
                    });
                });

                after(function () {
                    $wizard.jWizard("destroy");
                });

                it("should change attributes of the next button", function () {
                    $expect($wizard).to.have("button.jw-button-next")
                        .that.has.text("Forward");
                });

                it("should not change default attributes of the next button", function () {
                    $expect($wizard).to.have("button.jw-button-next")
                        .that.has.attr("type", "button");
                });
            });

            describe(".finish", function () {
                before(function () {
                    $wizard.jWizard({
                        buttons: {
                            finish: {
                                type: "button",
                                class: ""
                            }
                        }
                    });
                });

                after(function () {
                    $wizard.jWizard("destroy");
                });

                it("should change the type of the finish button", function () {
                    $expect($wizard).to.have("button.jw-button-finish")
                        .that.has.attr("type", "button");
                });

                it("should change the class of the finish button", function () {
                    $expect($wizard).to.have("button.jw-button-finish")
                        .that.not.have.class("ui-priority-primary ui-state-highlight");
                });

                it("should not change default attributes of the finish button", function () {
                    $expect($wizard).to.have("button.jw-button-finish")
                        .that.has.text("Finish");
                });
            });
        });

        describe(".progress", function () {
            before(function () {
                $wizard.jWizard({
                    progress: {
                        label:    "percentage",
                        append:   "Done",
                        location: ".jw-footer"
                    }
                });
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should change the text (label and append)", function () {
                $expect($wizard).to.have(".ui-progressbar").that.has.text("0% Done");
            });

            it("should change the location", function () {
                $expect($wizard).to.have(".jw-footer .ui-progressbar");
            });

            it("should change the progressbar options", function () {
                $wizard.jWizard("option", "progress.label", "count");

                $expect($wizard).to.have(".ui-progressbar").that.has.text("0 of 3 Done");
            });
        });

        describe(".disabled", function () {
            before(function () {
                $wizard.jWizard({ disabled: true });
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should make the entire widget disabled after init", function () {
                $expect($wizard).to.have.class("ui-state-disabled");
            });
        });
    });

    function testVisibility($current) {
        $expect($current).to.be.visible();
        $expect($current.siblings()).to.not.be.visible();
    }
});
