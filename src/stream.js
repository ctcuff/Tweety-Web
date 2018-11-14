const Twit = require('twit');
const config = require('./config');

const $gridContainer = $('.flex-container');
const $occurrences = $('#occurrences');
const $input = $('#input-keyword');
const $start = $('#start');
const $stop = $('#stop');
const $keyWordAlert = $('#missing-keyword');

const T = new Twit(config);

let stream;
let hasStarted = false;
let numOccurrences = 0;
let isAtBottom = false;

// Start the stream when 'enter' is pressed
$(document).ready(function () {
  $(document).keypress(event => {
    if (event.key === 'Enter' && !hasStarted) {
      startStream();
    }
  });
});

window.onscroll = () => {
  isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
};

function startStream() {
  let keywords = [];

  if ($input.val() === '') {
    $keyWordAlert.show();
    return;
  }

  // Multiple keywords will be searched based on spaces
  $input.val().split(' ').forEach(word => {
    keywords.push(word);
  });

  if (!$keyWordAlert.hidden) {
    $keyWordAlert.hide();
  }

  numOccurrences = 0;

  // Disable the start button but enable the stop button
  $start.attr('disabled', 'disabled');
  $stop.removeAttr('disabled');
  $input.attr('placeholder', `Keyword(s): ${keywords}`);

  // Clear the input field
  $input.val('');

  console.log(`Stream started -> [${keywords}]`);

  if (!hasStarted) {
    stream = T.stream('statuses/filter', {track: keywords});
  }

  stream.on('tweet', (tweet) => {
    addCard(tweet);
    $occurrences.text(++numOccurrences);

    // Only scroll to the bottom of the page if the page is
    // already at the bottom
    if (isAtBottom) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  });

  stream.on('disconnect', (message) => {
    console.log(`disconnect => ${message}`);
  });

  stream.on('reconnect', function (request, response, connectInterval) {
    // Calling stop reconnects the stream so it has
    // to be stopped one more time
    if (!hasStarted) {
      stream.stop();
      console.log(`reconnect ${JSON.stringify(response)}`);
    }
  });

  stream.on('warning', warning => {
    console.log(`warning => ${warning}`);
  });

  hasStarted = true;
}

function addCard(tweet) {
  let profileLink = `https://twitter.com/${tweet.user.screen_name}`;
  let tweetLink = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

  // Removes the +0000 2018 from Twitter dates
  // (Twitter returns it's dates as: Thu Jul 25 22:46:29 +0000 2018)
  let date = tweet.created_at.slice(0, tweet.created_at.length - 11);

  const $cardContainer = $("<div class='card shadow-lg rounded'></div>");
  const $cardBody = $(`<div class='card-body'></div>`);
  const $cardTitle = $(`<h5 class='card-title' id='tweet-username'>@${tweet.user.screen_name}</h5>`);
  const $cardSubtitle = $(`<h6 class="card-subtitle mb-2 text-muted" id="tweet-date">${date}</h6>`);
  const $cardText = $(`<p class="card-text" id="tweet-text">${tweet.text}</p>`);
  const $cardLink = $(`<a href="${profileLink}" target="_blank" class="card-link" id="tweet-profile-link">View profile</a>`);

  $cardBody.append($cardTitle);
  $cardBody.append($cardSubtitle);
  $cardBody.append($cardText);
  $cardBody.append($cardLink);

  $cardContainer.append($cardBody);

  $gridContainer.append($cardContainer);

  $cardContainer.click(() => {
    let win = window.open(tweetLink, '_blank');

    // The browser has allowed new windows to be opened
    if (win !== null) {
      win.focus();
    }
    console.log(`@${tweet.user.screen_name} => [${JSON.stringify(tweet)}]`);
  });
}

function stopStream() {
  if (hasStarted) {
    console.log('Stream stopped');
    stream.stop();

    // Re-enable the start button but disable the stop button
    $start.removeAttr('disabled');
    $stop.attr('disabled', 'disabled');
    $input.attr('placeholder', 'Keyword(s):');
  }
  hasStarted = false;
  $occurrences.text(numOccurrences);
}
