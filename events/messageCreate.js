module.exports = async (client, message) => {
    if (message.author.bot) return;
    const channelName = message.channel.name;

    if (channelName.startsWith("Friend Queue - ")) {
        const token = channelName.split("Friend Queue - ")[1];
        const queue = client.link.get(token);
        if (!queue) return;

        let sent = [];

        queue.forEach(user => {
            if (user.guild == message.guild) return;
            if (sent.includes(user.thread)) return;

            client.channels.fetch(user.channel).then(async channel => {
                const webhooks = await channel.fetchWebhooks();

                let webhook;
                if (!webhooks || webhooks.size == 0) {
                    webhook = await channel.createWebhook({
                        name: 'Chihiro Proxy Webhook',
                    })
                } else {
                    webhook = webhooks.first();
                }
                if (message.attachments.size > 0) {
                    message.attachments.forEach(attachment => {
                        console.log(attachment)
                    });
                }

                await webhook.send({
                    content: message.content,
                    username: message.author.nickname ? message.author.nickname + ` | From ${message.guild.name}` : message.author.username + ` | From ${message.guild.name}`,
                    avatarURL: message.author.avatarURL(),
                    threadId: user.thread,
                    
                });

                sent.push(user.thread);
            });
        });
    }
}