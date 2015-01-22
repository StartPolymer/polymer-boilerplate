# Polymer Boilerplate

Polymer Boilerplate is template using Web Components and modern tools.

Fork this repo if you want to start your own application using Polymer.

Based on [Yeoman generator](https://github.com/yeoman/generator-polymer)
v0.6.3

## Features

- Built with [HTML5 Boilerplate](https://html5boilerplate.com)
- Using [Polymer Theme](https://github.com/StartPolymer/polymer-theme)
- [Custom Icons](https://github.com/StartPolymer/polymer-base-template/blob/master/app/elements/custom-icons/custom-icons.html) element
- Quick deploy to [GitHub Pages](https://pages.github.com)
- [Sass](http://sass-lang.com) CSS preprocessor
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [PageSpeed Insights](https://developers.google.com/speed/docs/insights/about) for performance tuning
- [web-component-tester](https://github.com/Polymer/web-component-tester) support

## Installation

### Tools on Ubuntu

```sh
sudo add-apt-repository -y ppa:brightbox/ruby-ng
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs ruby2.2
sudo npm install -g bower grunt-cli
sudo gem install sass
```

## Usage

```sh
git clone <Fork of this repository>
npm install && bower install
grunt serve
```
