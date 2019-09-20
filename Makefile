SYNTAXES = syntaxes/promql.tmlanguage.json

all: typescript $(SYNTAXES)


typescript: $(wildcard src/**/*.ts) .node_deps
	npm run compile-ts

%.tmlanguage.json: %.tmlanguage.yml .node_deps
	npx js-yaml $< > $@


.node_deps: package.json.sha1sum
	npm install
	touch .node_deps

# Hack to only call npm install when package.json actually changes, see bug https://github.com/npm/npm/issues/17010
%.sha1sum: %
	sha1sum $< > $@

clean:
	git clean -fdx
