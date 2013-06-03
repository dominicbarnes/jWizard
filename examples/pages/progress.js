$("#example-none").jWizard({
    progress: false
});

$("#example-custom").jWizard({
    progress: {
        label: "percentage",
        append: "Done"
    }
});
