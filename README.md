# Polymer Boilerplate

Polymer Boilerplate is template using Web Components and modern tools.

Fork this repo if you want to start your own application using Polymer.

Inspired by [Polymer generator](https://github.com/yeoman/generator-polymer)
and [Gulp generator](https://github.com/yeoman/generator-gulp-webapp)

## Features

- Built with [HTML5 Boilerplate](https://html5boilerplate.com)
- Using [Polymer Theme](https://github.com/StartPolymer/polymer-theme)
- [Custom Icons](https://github.com/StartPolymer/polymer-boilerplate/blob/master/app/elements/custom-icons/custom-icons.html) element
- Quick deploy to [GitHub Pages](https://pages.github.com)
- [Sass](http://sass-lang.com) CSS preprocessor with Ruby
- [Autoprefixer](https://github.com/postcss/autoprefixer) for CSS
- [PageSpeed Insights](https://developers.google.com/speed/docs/insights/about) for performance tuning
- Built-in preview server with [BrowserSync](http://www.browsersync.io)
- Automagically wire-up dependencies installed with [Bower](http://bower.io)
- [web-component-tester](https://github.com/Polymer/web-component-tester) support

## Installation

### Tools on Ubuntu

```sh
sudo add-apt-repository -y ppa:brightbox/ruby-ng
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs ruby2.2
sudo npm install -g npm bower grunt-cli gulp
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

### Build

```sh
gulp
```

### Usage Grunt instead of the Gulp

```sh
mv package.json package-gulp.json
mv package-grunt.json package.json
bower install && npm install
grunt serve
```

### [web-component-tester](https://github.com/Polymer/web-component-tester)

```
bower install web-component-tester --save-dev
npm install web-component-tester --save-dev
```

## Extending

Use a [recipes](https://github.com/yeoman/generator-gulp-webapp/blob/master/docs/recipes/README.md)
for integrating other popular technologies like CoffeeScript
