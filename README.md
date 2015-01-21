# Polymer Base Template

Polymer base template using modern tools.

Based on [Yeoman generator](https://github.com/yeoman/generator-polymer)
v0.6.3

## Features

- Built with HTML5 Boilerplate and [Polymer Theme](https://github.com/StartPolymer/polymer-theme)
- [Custom Icons](https://github.com/StartPolymer/polymer-base-template/blob/master/app/elements/custom-icons/custom-icons.html) element
- Quick deploy to GitHub pages
- SASS/SCSS
- Autoprefixer
- PageSpeed Insights for performance tuning
- [web-component-tester](https://github.com/Polymer/web-component-tester) support

## Installation

### Tools on Ubuntu

```sh
sudo add-apt-repository ppa:brightbox/ruby-ng -y
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs ruby2.2
sudo npm install -g bower grunt-cli
sudo gem install sass
```

### Template

```sh
git clone <Fork of this repository>
bower install & npm install
grunt serve
```
