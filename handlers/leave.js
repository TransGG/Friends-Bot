const {
    EmbedBuilder,
} = require('discord.js');

exports.run = async (client, interaction) => {

    client.friendQueue.forEach(x => x.id === interaction.user.id ? found = client.friendQueue.delete(x) : x)

    let channel = interaction.guild.channels.cache.find(c => c.name === "new-friends")
    let role = interaction.guild.roles.cache.find(r => r.name === "Friend Queue");

    // handle if the role or channel is not found
    if (!role || !channel) {
        return interaction.reply({
            content: `The role or channel was not found. Please contact an admin to fix this issue.`,
            ephemeral: true
        });
    }

    const leave = new EmbedBuilder()
        .setTitle("***Aw I'm sad to see you go!*** :sob: ")
        .setDescription(`**I've removed you from the friend queue.**\n\nIf you would like to join again, you can always use the button in the <#${channel.id}> or you can use the </friend:1> command!`)
        .setColor(0x00AE86)
        .setFooter({
            text: client.user.username + "#" + client.user.discriminator,
            iconURL: client.user.avatarURL()
        })

    interaction.member.roles.remove(role);

    return interaction.update({
        embeds: [leave],
        components: [],
    });

}