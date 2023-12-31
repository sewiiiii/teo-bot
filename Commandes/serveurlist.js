const Discord = require("discord.js")
const { EmbedBuilder } = require('discord.js')

module.exports = {

    name: "serveurlist",
    description: "Renvoie une liste de serveurs auxquels le bot appartient.",
    permission: "Aucune",
    dm: true,

    async run(client, interaction) {

        const embed = new EmbedBuilder()
        .setTitle('Liste des serveurs')
        .setColor("#FFFFFF");

        let index = 1;
        for (const guild of interaction.client.guilds.cache.values()) {
            
            const channel = guild.channels.cache.find(channel => channel.type === ChannelTypes.GuildText && channel.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));
            if (!channel) {
                embed.addFields({ name: `${index}. ${guild.name}`, value: `ID: ${guild.id}\nInvitation: Je n'ai pas la permission de créer une invitation pour ce serveur.` });
                continue;
            }

            let invite = await channel.invites.create({
                maxAge: 0, 
                maxUses: 1 
            }).catch(error => {
                console.error(`Impossible de créer une invitation pour le serveur ${guild.name}:`, error);
                return null;
            });

            if (invite) {
                
                interaction.client.invites[index] = invite;
                embed.addFields({ name: `${index}. ${guild.name}`, value: `ID: ${guild.id}\nInvitation: ${invite.url}` });
            } else {
                embed.addFields({ name: `${index}. ${guild.name}`, value: `ID: ${guild.id}\nInvitation: Je n'ai pas la permission de créer une invitation pour ce serveur.` });
            }

            index++;
        }

        await interaction.reply({ embeds: [embed] });
    },
};




