after(function () {
    $("#wizard-basic").remove();
});

describe("#create()", function () {
    var $wizard = $("#wizard-basic");

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
            $expect($title).to.have.html($("#basic-step1").attr("title"));
        });
    });

    describe(".jw-content", function () {
        var $content, $wrap, $steps;

        before(function () {
            $content = $wizard.children(".jw-content");
            $wrap    = $content.children(".jw-steps-wrap");
            $steps   = $wrap.children(".jw-step");
        });

        it("should create a content region (with some utility classes)", function () {
            $expect($content).to.exist()
                .and.have.class("ui-widget-content ui-helper-clearfix");
        });

        it("should create a wrapper for steps", function () {
            $expect($wrap).to.exist();
        });

        it("should have 4 steps", function () {
            $expect($steps).to.have.items(4);
        });

        it("should make the first step visible (and others invisible)", function () {
            testVisibility($steps, 0);
        });
    });

    describe(".jw-footer", function () {
        var $footer, $buttons, $cancel, $prev, $next, $finish;

        before(function () {
            $footer  = $wizard.children(".jw-footer");
            $buttons = $footer.children(".jw-buttons");
            $cancel  = $buttons.children(".jw-button-cancel");
            $prev    = $buttons.children(".jw-button-previous");
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

        it("should create a cancel button", function () {
            $expect($cancel).to.exist()
                .and.be("button[type=button]")
                .and.have.class("ui-state-default ui-corner-all")
                .and.have.class("ui-priority-secondary");
        });

        it("should create a previous button", function () {
            $expect($prev).to.exist()
                .and.be("button[type=button]")
                .and.have.class("ui-state-default ui-corner-all");
        });

        it("should create a next button", function () {
            $expect($next).to.exist()
                .and.be("button[type=button]")
                .and.have.class("ui-state-default ui-corner-all");
        });

        it("should create a finish button", function () {
            $expect($finish).to.exist()
                .and.be("button[type=button]")
                .and.have.class("ui-state-default ui-corner-all")
                .and.have.class("ui-state-highlight");
        });
    });
});

describe("#destroy()", function () {
    var $wizard = $("#wizard-basic");

    before(function () {
        $wizard.jWizard();
        $wizard.jWizard("destroy");
    });

    it("should remove the ui-widget and jw-widget classes", function () {
        $expect($wizard).to.not.have.class("ui-widget jw-widget");
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

describe("#disable()", function () {
    var $wizard = $("#wizard-basic");

    before(function () {
        $wizard.jWizard().jWizard("disable");
    });

    after(function () {
        $wizard.jWizard("destroy");
    });

    it("should add the ui-state-disabled class", function () {
        $expect($wizard).to.have.class("ui-state-disabled");
    });

    it("should disable all the buttons", function () {
        $expect($wizard.find("button")).to.be(":disabled");
    });
});

describe("#enable()", function () {
    var $wizard = $("#wizard-basic");

    before(function () {
        $wizard.jWizard().jWizard("disable").jWizard("enable");
    });

    after(function () {
        $wizard.jWizard("destroy");
    });

    it("should remove the ui-state-disabled class", function () {
        $expect($wizard).to.not.have.class("ui-state-disabled");
    });

    it("should re-enable all the buttons", function () {
        $expect($wizard.find("button")).to.not.be(":disabled");
    });
});

describe("#changeStep()", function () {
    var $wizard = $("#wizard-basic"), $steps

    before(function () {
        $wizard.jWizard();
        $steps = $wizard.find(".jw-step");
    });

    beforeEach(function () {
        $wizard.jWizard("firstStep");
    });

    after(function () {
        $wizard.jWizard("destroy");
    });

    it("should set an arbitary step as the active one", function () {
        $wizard.jWizard("changeStep", 2);

        testVisibility($steps, 2);
    });

    it("should be cancellable", function () {
        $wizard.one("jwizardchangestep", function (e, ui) {
            return false;
        });

        $wizard.jWizard("changeStep", 1);
        testVisibility($steps, 0);
    });
});

describe("#firstStep()", function () {
    var $wizard = $("#wizard-basic"), $steps

    before(function () {
        $wizard.jWizard().jWizard("changeStep", 3);
        $steps = $wizard.find(".jw-step");
    });

    after(function () {
        $wizard.jWizard("destroy");
    });

    it("should set an arbitary step as the active one", function () {
        $wizard.jWizard("firstStep");

        testVisibility($steps, 0);
    });
});

describe("#lastStep()", function () {
    var $wizard = $("#wizard-basic"), $steps

    before(function () {
        $wizard.jWizard();
        $steps = $wizard.find(".jw-step");
    });

    after(function () {
        $wizard.jWizard("destroy");
    });

    it("should set an arbitary step as the active one", function () {
        $wizard.jWizard("lastStep");

        testVisibility($steps, 3);
    });
});

describe("#nextStep()", function () {
    var $wizard = $("#wizard-basic"), $steps

    before(function () {
        $wizard.jWizard();
        $steps = $wizard.find(".jw-step");
    });

    beforeEach(function () {
        $wizard.jWizard("firstStep");
    });

    after(function () {
        $wizard.jWizard("destroy");
    });

    it("should advance to step 2", function () {
        $wizard.jWizard("nextStep");

        testVisibility($steps, 1);
    });

    it("should be cancellable", function () {
        $wizard.one("jwizardnext", function (e, ui) {
            return false;
        });

        $wizard.jWizard("nextStep");
        testVisibility($steps, 0);
    });
});

describe("#previousStep()", function () {
    var $wizard = $("#wizard-basic"), $steps

    before(function () {
        $wizard.jWizard();
        $steps = $wizard.find(".jw-step");
    });

    beforeEach(function () {
        $wizard.jWizard("lastStep");
    });

    after(function () {
        $wizard.jWizard("destroy");
    });

    it("should advance to step 2", function () {
        $wizard.jWizard("previousStep");

        testVisibility($steps, 2);
    });

    it("should be cancellable", function () {
        $wizard.one("jwizardprevious", function (e, ui) {
            return false;
        });

        $wizard.jWizard("previousStep");
        testVisibility($steps, 3);
    });
});

function testVisibility($steps, index) {
    $expect($steps.eq(index)).to.be(":visible");
    $expect($steps.not(":eq(" + index + ")")).to.not.be(":visible");
}
