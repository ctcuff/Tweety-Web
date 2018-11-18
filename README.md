# Tweety-Web
What!?! Another Twitter based project? Am I crazy? Yep, you guessed it! This time, It's [Tweety](https://github.com/ctcuff/Tweety) but implemented in JavaScript as an Electron app. Enter a keyword or multiple keywords to search for and watch the Tweets fly by (pun intended). Click on any tweet to be brought to that status on the user's homepage on twitter.com

![](https://github.com/ctcuff/Tweety-Web/blob/master/screenshots/tweety.gif)

# How do I build this myself?
There are a few steps to get this to work:
1. Head over to [Twitter's site](https://developer.twitter.com/en/apply-for-access.html) and apply for a developer account if you don't already have one.
2. Create a Twitter app (hopefully you still can if you're reading this in 2021) and take note of your keys/access tokens.
3. Create a file in the root directory of this project called `config.js` that looks *exactly* like this (with your own keys obviously):
```javascript
module.exports = {
  consumer_key: 'SomeKeyHere',
  consumer_secret: 'SoManyLetersInThisKey',
  access_token: 'ThereAreProbablyNumbersInThisKey',
  access_token_secret: 'SuperDuperSecretKeyHere'
};
```
4. ~~Cross your fingers and hope the code works~~ Execute `npm start` in the root directory of this project.
