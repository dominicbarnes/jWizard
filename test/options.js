describe("options", function () {
    describe(".titleHide", function () {
        var $wizard = $("#wizard-basic"), $header;

        before(function () {
            $wizard.jWizard({ titleHide: true });
            $header = $wizard.children(".jw-header");
        });

        after(function () {
            $wizard.jWizard("destroy");
        });

        it("should have an invisible header", function () {
            $expect($header).to.not.be(":visible");
        });

        it("should show the header after changing the option to false", function () {
            $wizard.jWizard("option", "titleHide", false);
            $expect($header).to.be(":visible");
        });

        it("should hide the header after changing the option to true", function () {
            $wizard.jWizard("option", "titleHide", true);
            $expect($header).to.not.be(":visible");
        });
    });

    describe(".menuEnable", function () {
        var $wizard = $("#wizard-basic");

        before(function () {
            $wizard.jWizard({ menuEnable: true });
        });

        after(function () {
            $wizard.jWizard("destroy");
        });

        it("should add a menu and it's entire structure", function () {
            $expect($wizard).to.have.class("jw-hasmenu")
                .and.to.find("> .jw-content > .jw-menu-wrap > .jw-menu");
        });

        it("should remove the menu after changing the option to false", function () {
            $wizard.jWizard("option", "menuEnable", false);

            $expect($wizard).to.not.have.class("jw-hasmenu")
                .and.to.not.find(".jw-menu-wrap, .jw-menu");
        });

        it("should restore the menu after changing the option to true", function () {
            $wizard.jWizard("option", "menuEnable", true);

            $expect($wizard).to.have.class("jw-hasmenu")
                .and.to.find("> .jw-content > .jw-menu-wrap > .jw-menu");
        });
    });

    describe(".buttons", function () {
        var $wizard = $("#wizard-basic");

        describe.skip(".jqueryui", function () {
            // TODO
        });

        describe(".cancelHide", function () {
            var $cancel;

            before(function () {
                $wizard.jWizard({
                    buttons: { cancelHide: true }
                });

                $cancel = $wizard.find(".jw-button-cancel");
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should hide the cancel button", function () {
                $expect($cancel).to.not.be(":visible");
            });

            it("should show the cancel button after setting the option to false", function () {
                $wizard.jWizard("option", "buttons.cancelHide", false);

                $expect($cancel).to.be(":visible");
            });

            it("should hide the cancel button after setting the option to true", function () {
                $wizard.jWizard("option", "buttons.cancelHide", true);

                $expect($cancel).to.not.be(":visible");
            });
        });

        describe(".cancelType", function () {
            var $cancel;

            before(function () {
                $wizard.jWizard({
                    buttons: { cancelType: "reset" }
                });

                $cancel = $wizard.find(".jw-button-cancel");
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should change the default cancel button type", function () {
                $expect($cancel).to.have.attr("type", "reset");
            });

            it("should change the cancel button type in place", function () {
                $wizard.jWizard("option", "buttons.cancelType", "button");

                $expect($cancel).to.have.attr("type", "button");
            });
        });

        describe(".finishType", function () {
            var $finish;

            before(function () {
                $wizard.jWizard({
                    buttons: { finishType: "submit" }
                });

                $finish = $wizard.find(".jw-button-finish");
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should change the default finish button type", function () {
                $expect($finish).to.have.attr("type", "submit");
            });

            it("should change the finish button type in place", function () {
                $wizard.jWizard("option", "buttons.finishType", "button");

                $expect($finish).to.have.attr("type", "button");
            });
        });

        describe(".cancelText", function () {
            var $cancel;

            before(function () {
                $wizard.jWizard({
                    buttons: { cancelText: "CANCEL" }
                });

                $cancel = $wizard.find(".jw-button-cancel");
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should change the default cancel button text", function () {
                $expect($cancel).to.have.text("CANCEL");
            });

            it("should change the cancel button type in place", function () {
                $wizard.jWizard("option", "buttons.cancelText", "cancel");

                $expect($cancel).to.have.text("cancel");
            });
        });

        describe(".previousText", function () {
            var $previous;

            before(function () {
                $wizard.jWizard({
                    buttons: { previousText: "PREV" }
                });

                $previous = $wizard.find(".jw-button-previous");
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should change the default previous button text", function () {
                $expect($previous).to.have.text("PREV");
            });

            it("should change the previous button type in place", function () {
                $wizard.jWizard("option", "buttons.previousText", "previous");

                $expect($previous).to.have.text("previous");
            });
        });

        describe(".nextText", function () {
            var $next;

            before(function () {
                $wizard.jWizard({
                    buttons: { nextText: "NEXT" }
                });

                $next = $wizard.find(".jw-button-next");
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should change the default next button text", function () {
                $expect($next).to.have.text("NEXT");
            });

            it("should change the next button type in place", function () {
                $wizard.jWizard("option", "buttons.nextText", "next");

                $expect($next).to.have.text("next");
            });
        });

        describe(".finishText", function () {
            var $finish;

            before(function () {
                $wizard.jWizard({
                    buttons: { finishText: "FINISH" }
                });

                $finish = $wizard.find(".jw-button-finish");
            });

            after(function () {
                $wizard.jWizard("destroy");
            });

            it("should change the default finish button text", function () {
                $expect($finish).to.have.text("FINISH");
            });

            it("should change the finish button type in place", function () {
                $wizard.jWizard("option", "buttons.finishText", "finish");

                $expect($finish).to.have.text("finish");
            });
        });
    });
});
