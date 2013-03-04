# jWizard

jWizard is a jQuery UI widget for creating
[wizard interfaces](http://en.wikipedia.org/wiki/Wizard_(software))
based on your HTML Forms.

## Dependencies

 * [jQuery](http://jquery.com/) (1.7+)
 * [jQuery UI](http://jqueryui.com/) (1.8.7+)
    * [Widget Factory](http://api.jqueryui.com/jQuery.widget/)
    * [Button](http://api.jqueryui.com/button/)
    * [Progressbar](http://api.jqueryui.com/progressbar/) (optional)
    * [Menu](http://api.jqueryui.com/menu/) (optional)

## Usage

Include the JS and CSS located in the `dist` folder (minified versions are 
included there as well)

```html
<script src="jquery.jWizard.js"></script>
<link href="jquery.jWizard.css" rel="stylesheet">
```

A wizard can be comprised of a `<form>`, but any other (block-level) element,
like `<div>` will also work.

```html
<form id="wizard">
    <!-- steps will go here -->
</form>

<!-- or -->

<div id="wizard">
    <!-- steps will go here -->
</div>
```

A step can also be made up of just about any (block-level) element as well.

 * If using a `<fieldset>`, the `<legend>` element will contain the step's title.
 * If using any other element, add a `title` or `data-jwizard-title` attribute 
   to specify a title

```html
<fieldset>
    <!-- step title -->
    <legend>Step 1</legend>
    
    <!-- step content -->
</fieldset>

<!-- or -->

<div title="Step 1">
    <!-- step content -->
</div>

<!-- or -->

<div data-jwizard-title="Step 1">
    <!-- step content -->
</div>
```

Lastly, initialize the wizard via JS:

```javascript
$("#wizard").jWizard();
```

You can see the available options and events at the
[documentation page](http://dbarnes.info/jWizard)
