define({

	capabilities: {
		'selenium-version': '2.43.0'
	},

	environments : [ {
		browserName : 'chrome',
		chromeOptions : {
			args : ["test-type"],
			excludeSwitches : [ "ignore-certificate-errors" ]
		}
	} ],
	
	webdriver: {
		host: 'localhost',
		port: 4444
	},
	
	loader: {
		packages: [ 
			{ name: 'myPackage', location: '.' }
		]
	},

	// Functional test suite(s) to run in each browser once non-functional tests are completed
	functionalSuites: [ 'myPackage/tests/functional' ],

//	reporters: [ 'console', 'runner' ],
	
	excludeInstrumentation: /^(configs|dist|html-report|node_modules|test|tests|src\/js\/libs)\//
});