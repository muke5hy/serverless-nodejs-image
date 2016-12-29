.PHONY: test clean configtest

test:
	./node_modules/mocha/bin/_mocha -R spec --timeout 10000 tests/*jpeg.test.js

configtest:
	@./bin/configtest
