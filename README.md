# About
*Teahouse Go* is a go client written currently deployed to [teahouse.sethjrothschild.com](teahouse.sethjrothschild.com). It is a node application deployed on [PWS](run.pivotal.io) using [signalhub](https://github.com/mafintosh/signalhub) and a barely modified fork of Yichuan Shen's [p2p-goban](https://github.com/yishn/p2p-goban) proof of concept. This project itself is a work in progress, so you should expect bugs, missing features, and downtime.

![Screenshot](screenshot.gif)

# Contributing
This software is licensed under [AGPLv3](LICENSE.txt), so you are free to clone it and do with it what you'd like as long as you publish your code.

To run this project, you'll need 3 things running, the steps for which we'll describe below.

1. You need the app itself running with `npm` so that you can access it at `localhost:3000`.
2. You need sigalhub running. The `npm run signalhub` script sets it up for you on `localhost:8000` but you can use any running signalhub you'd prefer. 
3. You need [p2p-goban](ttps://github.com/yishn/p2p-goban) running locally, and you'll need to follow the instructions to get that set up with its own signalhub.

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