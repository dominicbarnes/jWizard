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
        
        $(this).parent().remove();
    });
    
    $("#toc").tocify({
        context: "#main",
        selectors: "h2,h3,h4"
    });
});
