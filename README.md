# Polymer Boilerplate

Polymer Boilerplate is template using Web Components and modern tools.

Fork this repo if you want to start your own application using Polymer.

Inspired by [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate),
[Web Starter Kit](https://github.com/google/web-starter-kit),
[Polymer generator](https://github.com/yeoman/generator-polymer) and
[Gulp generator](https://github.com/yeoman/generator-gulp-webapp).

## Features

- Using [Polymer Theme](https://github.com/StartPolymer/polymer-theme)
- [Custom Icons](https://github.com/StartPolymer/polymer-boilerplate/blob/master/app/elements/custom-icons/custom-icons.html) element
- [Nunjucks](http://mozilla.github.io/nunjucks/) templating language heavily inspired by [jinja2](http://jinja.pocoo.org)
- Quick deploy to [GitHub Pages](https://pages.github.com) -
Free [CDN](http://en.wikipedia.org/wiki/Content_delivery_network) hosting -
[more info](https://github.com/blog/1715-faster-more-awesome-github-pages)
- [Sass](http://sass-lang.com) CSS preprocessor with Ruby
- [Autoprefixer](https://github.com/postcss/autoprefixer) for CSS
- [PageSpeed Insights](https://developers.google.com/speed/docs/insights/about) for performance tuning
- Built-in preview server with [BrowserSync](http://www.browsersync.io)
- Automagically wire-up dependencies installed with [Bower](http://bower.io)
- [web-component-tester](https://github.com/Polymer/web-component-tester) support

## Installation

### Tools on Ubuntu

```sh
# Add Ruby repository
sudo add-apt-repository -y ppa:brightbox/ruby-ng
# Script to install NodeSource repository
curl -sL https://deb.nodesource.com/setup | sudo bash -
# Install Node.js and Ruby
sudo apt-get install -y nodejs ruby2.2
# Install Bower, Gulp and NPM
sudo npm install -g bower gulp npm
# Install Sass
sudo gem install sass
```

## Usage

### Clone fork of this repository

```sh
git clone <Fork of this repository>
```

### Install dependencies

```sh
bower install && npm install
```

### Serve to local and external URL

- `http://localhost:9000`
- `http://<IP>:9000`

```sh
gulp serve
```

Build and serve the output from the dist build

```sh
gulp serve:dist
```

### Build

```sh
gulp
```

### Deploy to GitHub Pages

First you need to be sure you have a gh-pages branch. If you don't have one, you can do the following:

```sh
git checkout --orphan gh-pages
git rm -rf .
touch README.md
git add README.md
git commit -m "Init gh-pages"
git push --set-upstream origin gh-pages
git checkout master
```

```sh
gulp deploy
```

Variables in [gulpfile.js](https://github.com/StartPolymer/polymer-boilerplate/blob/master/gulpfile.js)

```javascript
var ghPagesOrigin = 'origin';
var ghPagesBranch = 'gh-pages';
```

### PageSpeed Insights

```sh
gulp pagespeed
```

Variables in [gulpfile.js](https://github.com/StartPolymer/polymer-boilerplate/blob/master/gulpfile.js)

```javascript
var pageSpeedSite = 'https://startpolymer.org'; // change it
var pageSpeedStrategy = 'mobile'; // desktop
var pageSpeedKey = ''; // nokey is true
```

### Install web-component-tester

```
bower install web-component-tester --save-dev
npm install web-component-tester --save-dev
```

## Extending

Use a [recipes](https://github.com/yeoman/generator-gulp-webapp/blob/master/docs/recipes/README.md)
for integrating other popular technologies like CoffeeScript.

## [MIT License](https://github.com/StartPolymer/polymer-boilerplate/blob/master/LICENSE)

Copyright (c) 2015 Start Polymer ([https://startpolymer.org](https://startpolymer.org))
