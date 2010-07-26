jWizard
=======

jQuery UI Wizard Widget
-------------------------

** Attention ** I have finally decided to release this sucker as 1.0 :)

jWizard can take your boring HTML forms and turn them into a Windows Wizard-like interface.

The require markup and setup is simple and straightforward.

With nothing more than this:
	<div id="wizard">
		<div title="Step 1"></div>
		<div title="Step 2"></div>
		<div title="Step 3"></div>
		<div title="Final Step"></div>
	</div>

and this:
	$(document).ready(function() {
		$("#wizard").jWizard();
	});

The rest of the HTML as well as the JS that you need for a slick wizard interface is automatically generated and handled behind the scenes.

By digging into the configuration, even more functionality is available. All of it is well-documented [here](http://wiki.github.com/desdev/jWizard/) and there is a complete set of demos [here](http://dominic.selfip.info/jWizard).
