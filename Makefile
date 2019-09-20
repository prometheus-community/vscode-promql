all: typescript syntaxes


typescript: $(wildcard src/**/*.ts)
	tsc -p ./

%.tmlanguage.json: %.tmlanguage.yml
	npx js-yaml $< > $@