$("#example-validation")
    .on("stephide", "fieldset", function () {
        if (!$(this).find(":input").valid()) {
            return false;
        }
    })
    .jWizard()
    .validate();
