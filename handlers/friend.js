const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

exports.run = async (client, interaction) => {

    let already = false;

    const check = new EmbedBuilder()
        .setTitle("***You are already in the friend queue!*** :scream:")
        .setDescription(`**Were you looking to leave the friend queue?**\n\nIf so, click the button below.`)
        .setColor(0x00AE86)
        .setFooter({
            text: client.user.username + "#" + client.user.discriminator,
            iconURL: client.user.avatarURL()
        })

    client.friendQueue.forEach(x => x.id === interaction.user.id ? already = true : x)

    if (already) return interaction.reply({
        embeds: [check],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder({})
                .setCustomId(`leave`)
                .setLabel("Leave Friend Queue")
                .setStyle(2)
            )
        ],
        ephemeral: true
    });

    const banned = new EmbedBuilder()
        .setTitle("***You have been banned from using the Friend Queue.*** :cold_sweat:")
        .setDescription(`*If you believe this is a mistake, please contact a staff member.*`)
        .setColor(0x00AE86)
        .setFooter({
            text: client.user.username + "#" + client.user.discriminator,
            iconURL: client.user.avatarURL()
        })

    let channel = interaction.guild.channels.cache.find(c => c.name === "new-friends")
    let role = interaction.guild.roles.cache.find(r => r.name === "Friend Queue");
    let friendBannedRole = interaction.guild.roles.cache.find(r => r.name === "Friend Banned");

    if (!role || !channel || !friendBannedRole) {
        return interaction.reply({
            content: `The required roles or required channel was not found. Please contact an admin to fix this issue.\n\nRequired channel titled: "new-friends"\nRequired channel titled: "friend-logs"\nRequired role titled: "Friend Queue"\nRequired role titled: "Friend Banned"`,
            ephemeral: true
        });
    }

    if (interaction.member.roles.cache.has(friendBannedRole.id)) return interaction.reply({
        embeds: [banned],
        ephemeral: true
    });



    const embed = new EmbedBuilder()
        .setTitle("***You have joined the friend queue!*** :tada:")
        .setDescription(`**You will only be a part of this queue for 1 hour.**

> *If you are not matched within that time, you will be removed from the queue.*

***Once you are matched you will receive an @mention, make sure not to miss it!*** :heart:

> You can leave the queue at any time by clicking the button inside of <#${channel.id}> or by using the </friend:1> command.`)
        .setColor(0x00AE86)
        .setFooter({
            text: client.user.username + "#" + client.user.discriminator,
            iconURL: client.user.avatarURL()
        })

    interaction.reply({
        embeds: [embed],
        ephemeral: true
    });

    // add the friend role to the user
    interaction.member.roles.add(role);

    // add the user to the friend queue with their id and the time they joined
    client.friendQueue.add({
        id: interaction.member.id,
        tag: interaction.member.user.tag,
        guild: interaction.guild.id,
        channel: interaction.channel.id,
        time: Date.now(),
    });

}