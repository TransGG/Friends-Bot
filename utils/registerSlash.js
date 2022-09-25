module.exports = client => client.updateSlashCommands = async (guildID) => client.guilds.cache.get(guildID).commands.create({
    name: "friend",
    description: "Join/Leave the friend thread queue!",
})