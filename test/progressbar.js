describe("$.db.progressbar", function () {
    describe(".options", function () {
        describe(".label", function () {
            var $bar = $("#progressbar");

            afterEach(function () {
                $bar.progressbar("destroy");
            });

            it("should add a label element with '0%'", function () {
                $bar.progressbar({
                    value: 25,
                    label: "percentage"
                });

                $expect($bar)
                    .to.have.children(".ui-progressbar-label")
                    .and.have.text("25%");
            });

            it("should add a label element with '0 of 5'", function () {
                $bar.progressbar({
                    value: 1,
                    max:   5,
                    label: "count"
                });

                $expect($bar)
                    .to.have.children(".ui-progressbar-label")
                    .and.have.text("1 of 5");
            });
        });

        describe(".append", function () {
            var $bar = $("#progressbar");

            afterEach(function () {
                $bar.progressbar("destroy");
            });

            it("should append some text to the label", function () {
                $bar.progressbar({
                    value:  25,
                    label:  "percentage",
                    append: "Complete"
                });

                $expect($bar)
                    .to.have.children(".ui-progressbar-label")
                    .and.have.text("25% Complete");
            });
        });
    });
});
