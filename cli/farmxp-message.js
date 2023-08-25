const fetch = require('node-fetch')

{
  const apiPrefix = 'https://discord.com/api/v9'

  var delay = ms => new Promise(res => setTimeout(res, ms))
  var qs = obj =>
    Object.entries(obj)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')

  const apiCall = (apiPath, body, method = 'GET') => {
    if (!authHeader)
      throw new Error("The authorization token is missing. Did you forget set it? `authHeader = 'your_token'`")
    return fetch(`${apiPrefix}${apiPath}`, {
      body: body ? JSON.stringify(body) : undefined,
      method,
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US',
        Authorization: authHeader,
        'Content-Type': 'application/json',
        'User-Agent': isBotAccount
          ? 'DiscordBot (https://github.com/discordjs/discord.js, 12.5.3) Node.js/v14.15.1'
          : 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9003 Chrome/91.0.4472.164 Electron/13.4.0 Safari/537.36'
      }
    })
      .then(res => res.json().catch(() => {}))
      .catch(console.error)
  }

  var api = {
    getMessages: (channelOrThreadId, limit = 100, params = {}) => apiCall(`/channels/${channelOrThreadId}/messages?limit=${limit}&${qs(params)}`),
    sendMessage: (channelOrThreadId, message, tts, body = {}) => apiCall(`/channels/${channelOrThreadId}/messages`, { content: message, tts: !!tts, ...body }, 'POST'),
    replyToMessage: (channelOrThreadId, repliedMessageId, message, tts, body = {}) =>
      apiCall(`/channels/${channelOrThreadId}/messages`, { content: message, message_reference: { message_id: repliedMessageId }, tts: !!tts, ...body }, 'POST'),
    editMessage: (channelOrThreadId, messageId, newMessage, body = {}) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}`, { content: newMessage, ...body }, 'PATCH'),
    deleteMessage: (channelOrThreadId, messageId) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}`, null, 'DELETE'),

    createThread: (channelId, toOpenThreadInmessageId, name, auto_archive_duration = 1440, body = {}) =>
      apiCall(`/channels/${channelId}/messages/${toOpenThreadInmessageId}/threads`, { name, auto_archive_duration, location: 'Message', type: 11, ...body }, 'POST'),
    createThreadWithoutMessage: (channelId, name, auto_archive_duration = 1440, body = {}) =>
      apiCall(`/channels/${channelId}/threads`, { name, auto_archive_duration, location: 'Message', type: 11, ...body }, 'POST'),
    deleteThread: threadId => apiCall(`/channels/${threadId}`, null, 'DELETE'),

    // Use this generator: https://discord.club/dashboard
    // Click `+` at the bottom in the embed section then copy the `embed` key in the JSON output.
    sendEmbed: (channelOrThreadId, embed = { title: 'Title', description: 'Description' }) => apiCall(`/channels/${channelOrThreadId}/messages`, { embed }, 'POST'),

    auditLog: guildId => apiCall(`/guilds/${guildId}/audit-logs`),

    getRoles: guildId => apiCall(`/guilds/${guildId}/roles`),
    createRole: (guildId, name) => apiCall(`/guilds/${guildId}/roles`, { name }, 'POST'),
    deleteRole: (guildId, roleId) => apiCall(`/guilds/${guildId}/roles/${roleId}`, null, 'DELETE'),

    getBans: guildId => apiCall(`/guilds/${guildId}/bans`),
    banUser: (guildId, userId, reason) => apiCall(`/guilds/${guildId}/bans/${userId}`, { delete_message_days: '7', reason }, 'PUT'),
    unbanUser: (guildId, userId) => apiCall(`/guilds/${guildId}/bans/${userId}`, null, 'DELETE'),
    kickUser: (guildId, userId) => apiCall(`/guilds/${guildId}/members/${userId}`, null, 'DELETE'),

    addRole: (guildId, userId, roleId) => apiCall(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, null, 'PUT'),
    removeRole: (guildId, userId, roleId) => apiCall(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, null, 'DELETE'),

    getChannels: guildId => apiCall(`/guilds/${guildId}/channels`),
    createChannel: (guildId, name, type) => apiCall(`/guilds/${guildId}/channels`, { name, type }, 'POST'),
    deleteChannel: channelId => apiCall(`/channels/${channelId}`, null, 'DELETE'),

    pinnedMessages: channelId => apiCall(`/channels/${channelId}/pins`),
    addPin: (channelId, messageId) => apiCall(`/channels/${channelId}/pins/${messageId}`, null, 'PUT'),
    deletePin: (channelId, messageId) => apiCall(`/channels/${channelId}/pins/${messageId}`, null, 'DELETE'),

    listEmojis: guildId => apiCall(`/guilds/${guildId}/emojis`),
    getEmoji: (guildId, emojiId) => apiCall(`/guilds/${guildId}/emojis/${emojiId}`),
    createEmoji: (guildId, name, image, roles) => apiCall(`/guilds/${guildId}`, { name, image, roles }, 'POST'),
    editEmoji: (guildId, emojiId, name, roles) => apiCall(`/guilds/${guildId}/${emojiId}`, { name, roles }, 'PATCH'),
    deleteEmoji: (guildId, emojiId) => apiCall(`/guilds/${guildId}/${emojiId}`, null, 'DELETE'),

    changeNick: (guildId, nick) => apiCall(`/guilds/${guildId}/members/@me/nick`, { nick }, 'PATCH'),
    leaveServer: guildId => apiCall(`/users/@me/guilds/${guildId}`, null, 'DELETE'),

    getDMs: () => apiCall(`/users/@me/channels`),
    getUser: userId => apiCall(`/users/${userId}`),

    getCurrentUser: () => apiCall('/users/@me'),
    editCurrentUser: (username, avatar) => apiCall('/users/@me', { username, avatar }, 'PATCH'),
    listCurrentUserGuilds: () => apiCall('/users/@me/guilds'),

    listReactions: (channelOrThreadId, messageId, emojiUrl) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}/reactions/${emojiUrl}/@me`),
    addReaction: (channelOrThreadId, messageId, emojiUrl) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}/reactions/${emojiUrl}/@me`, null, 'PUT'),
    deleteReaction: (channelOrThreadId, messageId, emojiUrl) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}/reactions/${emojiUrl}/@me`, null, 'DELETE'),

    typing: channelOrThreadId => apiCall(`/channels/${channelOrThreadId}/typing`, null, 'POST'),

    delay,
    apiCall
  }

  // Is the account a bot?
  var isBotAccount = false // true for bot

  // Set your `Authorization` token here
  var authHeader = 'YOUR_AUTH_HEADER'

  if (isBotAccount) authHeader = `Bot ${authHeader}`
}
// End of api

// Your script
;(async () => {
let channelId = 'YOUR_CHANNEL_ID' // channel ID
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

  let message = `${randomGreeting} ${randomQuestion} ${randomVerb} ${randomEmotion1}${randomEmotion2}?`;

  const sentMessage = await api.sendMessage(channelId, message);
  console.log(`Sent ${++count} messages`);
  await api.delay(45000); // 45 seconds
}
})()
