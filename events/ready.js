const {
    AttachmentBuilder,
    EmbedBuilder,
    ThreadAutoArchiveDuration,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

module.exports = async (client) => {
    console.log("Bot started!");

    client.guilds.cache.forEach(guild => {
        client.updateSlashCommands(guild.id);
    });

    // send a message in the process.env.FRIEND_CHANNEL channel with a embed
    const embed = new EmbedBuilder()
        .setTitle("Friend Queue\n***Click the button below to join the friend queue!***")
        .setDescription(`***What is the friend queue?***

The friend queue is a place where you can meet new people and make new friends in a safe and slower paced environment then general!

2-4 people within the friend queue will be matched together every 10 minutes and will be given their own private thread which will auto archive after one hour of inactivity.

In this thread you can talk about anything you want, but please make sure it abides by the rules of the server.

> You will only be a part of this queue for 1 hour. If you are not matched within that time, you will be removed from the queue automatically. You will receive a DM if you are removed

Once you are matched you will receive an @mention, make sure not to miss it <3

> You can leave the queue at any time by clicking the button below or by using the </friend:1> command.`)
        .setColor(0x00AE86)
        .setFooter({
            text: client.user.username + "#" + client.user.discriminator,
            iconURL: client.user.avatarURL()
        })


    // client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.FRIEND_CHANNEL).send({
    //     embeds: [embed],
    //     components: [
    //         new ActionRowBuilder().addComponents(
    //             new ButtonBuilder({})
    //             .setCustomId(`friend`)
    //             .setLabel("Join / Leave Friend Queue")
    //             .setStyle(2),
    //         )
    //     ]
    // });


    setInterval(() => {
        client.friendQueue.forEach(user => {
            if (Date.now() - user.time > 3600000) {

                let guild = client.guilds.cache.get(user.guild)

                let role = guild.roles.cache.find(r => r.name === "Friend Queue");

                let guildMember = guild.members.cache.get(user.id)

                let channel = guild.channels.cache.find(c => c.name === "new-friends")

                guildMember.roles.remove(role);
                client.friendQueue.delete(user);

                guildMember.send({
                    content: `You have been removed from the friend queue because you have been in the queue for over 1 hour. You can join the queue again by clicking the button in the <#${channel.id}> channel`
                });
            }
        });

        if (client.friendQueue.size >= 2) {
            let users = [...client.friendQueue];

            let groups = [];
            while (users.length > 1) {
                groups.push(users.splice(0, Math.floor(Math.random() * 3) + 2));
            }

            // const thread = channel.threads.cache.find(x => x.name === 'food-talk');
            // await thread.members.add('140214425276776449');

            groups.forEach(async group => {

                let guilds = group.reduce((r, a) => {
                    r[a.guild] = [...r[a.guild] || [], a];
                    return r;
                }, {});

                let token = Math.random().toString(36).substr(2, 9);

                // for each key in the guilds object
                for (const key in guilds) {
                    if (Object.hasOwnProperty.call(guilds, key)) {
                        const element = guilds[key];

                        let guild = client.guilds.cache.get(key)

                        let guildMembers = element.map(x => guild.members.cache.get(x.id))

                        let role = guild.roles.cache.find(r => r.name === "Friend Queue");

                        let channel = guild.channels.cache.find(c => c.name === "new-friends")
                        let logs = guild.channels.cache.find(c => c.name === "friend-logs")

                        // Check if the guild is able to have private threads
                        let privateThreadAccess = guild.features.includes("PRIVATE_THREADS")

                        let thread = await channel.threads.create({
                            name: `Friend Queue - ${token}`,
                            autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
                            type: privateThreadAccess ? ChannelType.PrivateThread : ChannelType.PublicThread,
                            reason: 'Friend thread created',
                        });

                        group.forEach(x => {
                            if (x.guild == key) {
                                x.thread = thread.id
                            }
                        })

                        guildMembers.forEach(async member => {
                            await thread.members.add(member);
                            member.roles.remove(role);
                            client.friendQueue.forEach(x => x.id === member.user.id ? client.friendQueue.delete(x) : x)
                        });

                        const welcomeMessage = new EmbedBuilder()
                            .setAuthor({
                                name: client.user.username + "#" + client.user.discriminator,
                                iconURL: client.user.avatarURL()
                            })
                            .setTitle("Welcome to your friend thread!")
                            .setDescription(`${group.map(user => `***${user.tag}***`).join(", ")} have all been matched together across ${Object.keys(guilds).length} servers!

Please be respectful to each other and have fun!

> This thread will auto archive after one hour of inactivity`)
                            .setImage("https://i.imgur.com/t3zhm4k.png")
                            .setColor("0xFFC0CB")

                        // const attachment = new AttachmentBuilder('./video/report.gif', {
                        //     name: 'guide.gif'
                        // })

                        const rules = new EmbedBuilder()
                            .setTitle(":octagonal_sign: Rules (IMPORTANT) :octagonal_sign: ")
                            .setDescription(`There are some rules you must follow in this thread. If you do not follow these rules, you will be removed from the thread and banned from using the bot again and depending on the infraction you may be banned from the server.

**1. Follow all of the rules of the server itself.**

**2. Do not re-direct the conversation to private messages.** 
> This is to prevent people from being able to bypass the rules / harm others. Please respect this rule.

**3. Do not make others feel uncomfortable or unwelcome.** 
> This includes but is not limited to: racism, sexism, homophobia, transphobia, etc, this is not the place to talk about heavy topics or politics.

***If at any point you feel uncomfortable or unsafe, please contact a moderator or admin immediately.***`)
                            .setColor("0xFFC0CB")
                            .setImage("https://i.imgur.com/t3zhm4k.png")

                        const report = new EmbedBuilder()
                            .setTitle("***How to contact Staff / Report a message***")
                            .setDescription(`
**1. Right click a message you feel uncomfortable with and click "Apps" then "Report Message"***
> This will report directly to the TransPlace sever staff, this does not go to the discord staff.

**2. You can also contact a moderator or admin by creating a mod ticket in the <#995343855069175858> channel.**

**3. Mention a moderator or admin in the thread.**
> Please keep this as a last resort if the above two options do not work. If you mention a moderator or admin in the thread it will show up in the thread that you've mentioned them.

***The first two mentioned methods are kept completely hidden from anyone outside of moderators, no one will see a message saying you’ve made a report or opened a ticket, aside from our mod team.***

> A video guide is attached below to help you understand how to report a message.`)
                            // .setImage("attachment://guide.gif")
                            .setImage("https://i.imgur.com/qC8zJZc.gif")
                            .setColor("0xFFC0CB")
                        thread.send({
                            content: `A new friend thread has been created!
You have been matched with ${group.length - 1} other ${group.length - 1 == 1 ? "person" : "people"}!`,
                            embeds: [welcomeMessage, rules, report],
                            // files: [attachment]
                        })

                        const logEmbed = new EmbedBuilder()
                            .setAuthor({
                                name: client.user.username + "#" + client.user.discriminator,
                                iconURL: client.user.avatarURL()
                            })
                            .setDescription('A new friend thread has been created!')
                            .setTimestamp()
                            .setColor("0xFFC0CB")
                            .addFields([{
                                name: '**Users From This Server:**',
                                value: guildMembers.map(x => `<@${x.id}>`).join(", "),
                            }, {
                                name: '**All Users:**',
                                value: group.map(x => `\`User\`: <@${x.id}> - \`ID\`: ${x.id}`).join("\n"),
                            }, ])


                        logs.send({
                            embeds: [logEmbed],
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder({})
                                    .setURL(`https://discord.com/channels/${guild.id}/${thread.id}`)
                                    .setLabel("Open Thread")
                                    .setStyle(5),
                                )
                            ]
                        })


                        await channel.messages.fetch({
                            limit: 10
                        }).then(messages => {
                            messages.forEach(message => {
                                if (message.author.id == client.user.id && message.content.startsWith("Friend Queue")) {
                                    message.delete();
                                }

                            });
                        });
                    }
                }

                client.link.set(token, group)
                
            });
        }
    }, 60000 / 4);

}