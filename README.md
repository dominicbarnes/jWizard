jWizard
=======

jQuery UI Wizard Widget
-------------------------

jWizard can take your boring HTML forms and turn them into a Windows Wizard-like interface.

The require markup and setup is simple and straightforward.

With nothing more than this:
```html
<div id="wizard">
	<div title="Step 1"></div>
	<div title="Step 2"></div>
	<div title="Step 3"></div>
	<div title="Final Step"></div>
</div>
```

and this:
```javascript
$(document).ready(function() {
	$("#wizard").jWizard();
});
```

The rest of the HTML as well as the JS that you need for a slick wizard interface is automatically generated and handled behind the scenes.

By digging into the configuration, even more functionality is available. All of it is well-documented [here](http://wiki.github.com/dominicbarnes/jWizard/) and there is a complete set of demos [here](http://dominicbarnes.us/jWizard).
