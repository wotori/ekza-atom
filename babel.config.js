module.exports = {
	"presets": [
		[
			"@babel/preset-env",
			{
				"useBuiltIns": "entry",
				"corejs": '3',
				"debug": true
			}
		]
	],
	"plugins": [
		// [
		// 	"module-resolver", {
		// 		"alias": {
		// 			"External": "../soulsphere/engine/"
		// 		}
		// 	}
		// ],
		// ["@babel/plugin-proposal-decorators", { "legacy": true }],
		// "@babel/plugin-proposal-object-rest-spread",
		// "@babel/plugin-proposal-export-default-from",
		// "@babel/plugin-proposal-export-namespace-from",
		// "@babel/plugin-proposal-class-properties",
		"module:faster.js"
	]
}

