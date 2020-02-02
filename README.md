# About
**Teahouse Go** is a go client written currently deployed to [https://teahouse.cfapps.io/](https://teahouse.cfapps.io/). It is a node application deployed on [PWS](https://run.pivotal.io) using [signalhub](https://github.com/mafintosh/signalhub) and a barely modified fork of Yichuan Shen's [p2p-goban](https://github.com/yishn/p2p-goban) proof of concept. The project goal is to create a more pleasant online go playing experience for myself. I hope you enjoy it too!

This project itself is a work in progress, so you should expect bugs, missing features, and downtime.

![Screenshot](screenshot.gif)

# Contributing
This software is licensed under [AGPLv3](LICENSE), so you are free to clone it and do with it what you'd like as long as you publish your code. I also personally really appreciate [issues and feature requests](https://github.com/Seth-Rothschild/teahousego/issues) since they help me decide which functionality is most important to users.

To develop for this project, you'll need it running locally. There are basically 4 distinct apps that need to be running for this to work:

1. You need the app itself.
2. You need signalhub for this app. I've provided the start command as `npm run signalhub`
3. You need [p2p-goban](ttps://github.com/yishn/p2p-goban) running locally
4. You need a different signalhub running for p2p-goban.

## Running the App
First, you'll have to clone this repository or download it from github. The command to download it is
```
git clone https://github.com/Seth-Rothschild/teahousego.git
```
Following that, you'll want to [download npm](https://www.npmjs.com/get-npm) from Node's website. To install the dependencies run 
```
npm install
```
After that, you'll need two terminals. In one, run `npm run watch` and in the other run `npm start`. You'll see a message that the app is running locally so that you can access it at [http://localhost:3000](http://localhost:3000).

The application has two remote dependencies, `signalhub` and `p2p-goban`. These are listed in the [config.json](config.json) files and you can change them as needed. The default location we'll look for signalhub is on localhost:8000, which you can start by using 
```npm run signalhub``` 
