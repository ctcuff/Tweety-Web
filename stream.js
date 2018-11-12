const Twit = require('twit');

const $gridContainer = $('.flex-container');
const $occurrences = $('#occurrences');
const $input = $('#input-keyword');

const T = new Twit(config);

let stream;
let hasStarted = false;
let occurrences = 0;

function startStream() {
  let keywords = [];
  
  if ($input.val() === '') {
    alert('You need to enter a keyword.');
    return;
  }
  
  // Multiple keywords will be searched based on spaces
  $input.val().split(' ').forEach(word => {
    keywords.push(word);
  });

  console.log(`Stream started -> [${keywords}]`);

  $input.attr('placeholder', `Keyword(s): ${keywords}`);

  // Clear the input field
  $input.val('');

  if (!hasStarted) {
    stream = T.stream('statuses/filter', {track: keywords});
  }

  stream.on('tweet', tweet => {
    addCard(tweet);
    console.log(`@${tweet.user.screen_name} => [${JSON.stringify(tweet)}]`);
    $occurrences.text(++occurrences);
  });

  hasStarted = true; 
}

function addCard(tweet) {
  let profileLink = `http://twitter.com/${tweet.user.screen_name}`;

  // Removes the +0000 2018 from Twitter dates
  // (Twitter returns it's dates as: Thu Jul 25 22:46:29 +0000 2018) 
  let date = tweet.created_at.slice(0, tweet.created_at.length - 11);

  const $cardContainer = $("<div class='card'></div>");
  const $cardBody = $(`<div class='card-body'></div>`);
  const $cardTitle = $(`<h5 class='card-title' id='tweet-username'>@${tweet.user.screen_name}</h5>`);
  const $cardSubtitle = $(`<h6 class="card-subtitle mb-2 text-muted" id="tweet-date">${date}</h6>`);
  const $cardText = $(`<p class="card-text" id="tweet-text">${tweet.text}</p>`);
  const $cardLink = $(`<a href="${profileLink}" target="_blank" class="card-link" id="tweet-profile-link">View profile</a>`);

  $cardBody.append($cardTitle);
  $cardBody.append($cardSubtitle);
  $cardBody.append($cardText);
  $cardBody.append($cardLink);

  $cardContainer.append($cardBody)

  $gridContainer.append($cardContainer);
}

function stopStream() {
  if (hasStarted) {
    console.log('Stream stopped');
    stream.stop();
  }
  hasStarted = false;
  occurrences = 0;
  $occurrence.text(occurrences);
}
