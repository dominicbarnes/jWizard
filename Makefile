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

dist/jquery.jWizard.js: src/head.txt src/wizard.js src/progressbar.js src/foot.txt
	mkdir -p dist/
	cat $^ > $@

dist/jquery.jWizard.css: $(wildcard src/*.less)
	cat $^ | $(LESS) - > $@

%.min.js: %.js | node_modules
	$(UGLIFY) $< > $@

%.min.css: %.css | node_modules
	$(LESS) --compress $< > $@


jshint:
	$(JSHINT) --config src/.jshintrc src/
	$(JSHINT) --config test/.jshintrc test/*.js


docs: docs/build/index.html docs/build/app.js docs/build/app.css docs/build/fonts docs/build/images

docs/build/index.html: $(wildcard docs/*.jade) $(wildcard docs/examples/*)
	mkdir -p docs/build/
	$(JADE) --path docs/index.jade < docs/index.jade > $@

docs/build/app.js: docs/js/jquery.js docs/js/jquery-ui.js docs/js/bootstrap.js dist/jquery.jWizard.min.js docs/js/app.js
	$(UGLIFY) $^ > $@

docs/build/app.css: docs/css/bootstrap.css docs/css/bootstrap-theme.css docs/css/jquery-ui.css dist/jquery.jWizard.min.css docs/css/style.css
	cat $^ | $(LESS) --compress - > $@

docs/build/fonts: docs/fonts
	cp -Rf $< $@

docs/build/images: docs/images
	cp -Rf $< $@


examples/%.html: docs/examples/%.jade
	$(JADE) --path examples/ $< < $< > $@


test: test/dependencies.js
	$(MOCHA) -R dot test/runner.html

test/dependencies.js:
	echo 'window.versions = {}' > $@
	echo 'window.versions.jquery = "$(JQUERY)";' >> $@
	echo 'window.versions.jqueryui = "$(JQUERYUI)";' >> $@


.PHONY: all jshint examples test test/dependencies.js clean
