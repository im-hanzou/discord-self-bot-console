api.id();
let channelId = cid;
let greetings = ["Hey there!", "What's up?", "Hey buddy!", "Yo, how's it going?", "Eh, what's the scoop?", "Whatcha up to, my friend?", "Hello, how's life?", "Hey, any news?", "How's it hanging, mate?", "Hey, how are you?"];
let questions = ["How's it going?", "Got any gossip?", "Anything cool happening?", "Planning anything fun?", "Did you eat yet?", "What are you up to?", "Busy with something?", "By the way, what's your favorite hobby?", "Got any plans, wanna join?", "Watched any good movies lately?"];
let emotions = ["😄", "😂", "🤙", "😎", "🤪", "🔥", "👌", "👏", "🙌", "💯"];
let verbs = ["enjoying", "chilling", "trying out", "watching", "listening to", "rocking", "learning", "diving into", "chatting about", "exploring"];

var loop = true;
let count = 0;
while (loop) {
  let randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  let randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  let randomEmotion1 = emotions[Math.floor(Math.random() * emotions.length)];
  let randomEmotion2 = emotions[Math.floor(Math.random() * emotions.length)];
  let randomVerb = verbs[Math.floor(Math.random() * verbs.length)];

  let message = `${randomGreeting} ${randomQuestion} Currently ${randomVerb} ${randomEmotion1}${randomEmotion2}?`;

  const sentMessage = await api.sendMessage(channelId, message);
  console.log(`Sent ${++count} messages`);
  await api.delay(20000); // 20 seconds
}
