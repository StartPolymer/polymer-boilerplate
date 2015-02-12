module.exports = {
	// Autoprefixer
	autoprefixer: {
		// https://github.com/postcss/autoprefixer#browsers
		browsers: [
			'ie >= 10',
			'ie_mob >= 10',
			'ff >= 30',
			'chrome >= 34',
			'safari >= 7',
			'opera >= 23',
			'ios >= 7',
			'android >= 4.4',
			'bb >= 10'
		]
	},
	// BrowserSync
	browserSync: {
		browser: 'default', // or ["google chrome", "firefox"]
		https: false, // Enable https for localhost development.
		notify: false, // The small pop-over notifications in the browser.
		port: 9000
	},
	// GitHub Pages
	ghPages: {
		branch: 'gh-pages',
		origin: 'origin'
	},
	// PageSpeed Insights
	// Please feel free to use the `nokey` option to try out PageSpeed
	// Insights as part of your build process. For more frequent use,
	// we recommend registering for your own API key. For more info:
	// https://developers.google.com/speed/docs/insights/v1/getting_started
	pageSpeed: {
		key: '', // need uncomment in gulpfile.js
		nokey: true,
		site: 'https://startpolymer.org', // change it
		strategy: 'mobile' // or desktop
	}
};
