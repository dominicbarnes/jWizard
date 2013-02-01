describe("create", function () {
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

describe("destroy", function () {
    var $wizard = $("#wizard-basic");

    before(function () {
        $wizard.jWizard();
        $wizard.jWizard("destroy");
    });

    it("should remove the ui-widget and jw-widget classes", function () {
        $expect($wizard).to.not.have.class("ui-widget jw-widget");
    });
});
