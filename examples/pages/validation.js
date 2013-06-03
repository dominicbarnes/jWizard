$("#example")
    .jWizard()
    .validate();

$("#account").on("stephide", function (e) {
    if (!$(this).find(":input").valid()) {
        return false;
    }
});
