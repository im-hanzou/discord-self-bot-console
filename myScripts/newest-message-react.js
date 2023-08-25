var reactions = ['🤙']; // Define the reactions you want to use here

(async () => {
  while (true) {
    const messages = await api.getMessages(cid, 1);

    if (messages.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
      continue;
    }

    const latestMessage = messages[0];

    if (latestMessage.type === 0 || latestMessage.type === 19) {
      for (const reaction of reactions) {
        await api.addReaction(cid, latestMessage.id, reaction);
      }

      console.log(`Reacted to the latest message. ID=${latestMessage.id}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
  }
})();
