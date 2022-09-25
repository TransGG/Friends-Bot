module.exports = async (client, interaction) => {
    if (interaction.isChatInputCommand() || interaction.isButton()) {
        const command = interaction.commandName ? interaction.commandName : interaction.customId;
        const handler = client.handler.get(command)
        if (!handler) return;
        handler.run(client, interaction);
    }
}