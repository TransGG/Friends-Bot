const {
    EmbedBuilder,
} = require('discord.js');

exports.run = async (client, interaction) => {

    client.friendQueue.forEach(x => x.id === interaction.user.id ? found = client.friendQueue.delete(x) : x)

    const leave = new EmbedBuilder()
        .setTitle("***Aw I'm sad to see you go!*** :sob: ")
        .setDescription(`**I've removed you from the friend queue.**\n\nIf you would like to join again, you can always use the button in the <#${process.env.FRIEND_CHANNEL}> or you can use the </friend:1> command!`)
        .setColor(0x00AE86)
        .setFooter({
            text: client.user.username + "#" + client.user.discriminator,
            iconURL: client.user.avatarURL()
        })

    interaction.member.roles.remove(process.env.FRIEND_ROLE);

    return interaction.update({
        embeds: [leave],
        components: [],
    });

}