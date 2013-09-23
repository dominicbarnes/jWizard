jQuery(function ($) {
    $("#example-buttons").jWizard({
        buttons: {
            // remove the cancel button altogether
            cancel: false,

            // override the default text only
            prev: {
                text: "Back"
            },

            // override the default text and icon
            next: {
                text: "Forward",
                icons: {
                    secondary: "ui-icon-triangle-1-e"
                }
            },

            // override the button type
            finish: {
                type: "submit"
            }
        }
    });

});
