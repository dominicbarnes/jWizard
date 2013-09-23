jQuery(function ($) {
    $("#demo-run").click(function () {
        var $wizard = $("#wizard").jWizard({
            buttons: {
                finish: {
                    type: "button"
                }
            },
            cancel: function () {
                alert("Cancel");
                $wizard.jWizard("first");
            },
            finish: function () {
                alert("Finish");
            }
        });

        $(this).remove();
    });
});
