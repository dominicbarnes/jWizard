BIN := ./node_modules/.bin
JADE := $(BIN)/jade
LESS := $(BIN)/lessc
UGLIFY := $(BIN)/uglifyjs
JSHINT := $(BIN)/jshint
MOCHA := $(BIN)/mocha-phantomjs

JQUERY := 1.10.0
JQUERYUI := 1.10.3


all: dist

deps: node_modules

node_modules: package.json
	npm install

dist: dist/jquery.jWizard.min.js dist/jquery.jWizard.min.css

%.min.js: %.js
	$(UGLIFY) $< > $@

%.min.css: %.css
	$(LESS) --compress $< > $@

dist/jquery.jWizard.js: src/head.txt src/wizard.js src/progressbar.js src/foot.txt
	cat $^ > $@

dist/jquery.jWizard.css: src/wizard.less src/progressbar.less
	cat $^ | $(LESS) - > $@

jshint:
	$(JSHINT) --config src/.jshintrc src/
	$(JSHINT) --config test/.jshintrc test/*.js

docs: docs/build/app.js docs/build/app.css docs/build/index.html

docs/build/app.js: docs/js/jquery.js docs/js/jquery-ui.js docs/js/bootstrap.js docs/js/jquery.tocify.min.js dist/jquery.jWizard.min.js docs/js/app.js
	$(UGLIFY) $^ > $@

docs/build/app.css: docs/css/bootstrap.css docs/css/fontawesome.css docs/css/jquery-ui.css docs/css/jquery.tocify.css dist/jquery.jWizard.min.css docs/css/style.css
	cat $^ | $(LESS) --compress - > $@

docs/build/index.html: docs/index.jade
	$(JADE) --path $< < $^ > $@

examples:
	$(JADE) examples/pages --out examples/ --pretty

test: test/dependencies.js
	$(MOCHA) -R dot test/runner.html

test/dependencies.js:
	echo 'window.versions = {}' > $@
	echo 'window.versions.jquery = "$(JQUERY)";' >> $@
	echo 'window.versions.jqueryui = "$(JQUERYUI)";' >> $@

clean:
	rm -f $(HTML)

.PHONY: all jshint examples test test/dependencies.js clean
