const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Adds an image to the vault.')
        .addStringOption(option =>
            option.setName('vaulted')
                .setDescription('The person in the image. (use "Multiple" for multiple people and "Random" for random people!)')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('self-explanatory')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tags')
                .setDescription('describe the image eg "nsfw, out of pocket" (If multiple use Multiple (person and person))')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('comment')
                .setDescription('what do you think of this image')
                .setRequired(false)),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const vaulted = interaction.options.getString('vaulted');
        const tags = interaction.options.getString('tags') ?? 'No Tags';
        const image = interaction.options.getAttachment("image")
        const comment = interaction.options.getString('comment') ?? 'No Comment'
        const channel = await interaction.client.channels.fetch('1221044294362595358');

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Add to Vault')
            .setStyle(ButtonStyle.Success)

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
	        .addComponents(confirm, cancel);

        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle(vaulted)
            .setDescription(tags)
            .setImage(image.url)
            .setFooter({ text: comment })
		
        if (interaction.member.roles.cache.has('1197785502816936016')) {
            const response = await interaction.editReply({ content: 'This is what the embed will look like:', components: [row], embeds: [embed], ephemeral: true });
            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
	            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                if (confirmation.customId === 'confirm') {
                    await channel.send({ embeds: [embed] })
                    await confirmation.update({ content: `Added to the vault.`, components: [] });
                } else if (confirmation.customId === 'cancel') {
                    await confirmation.update({ content: 'Cancelled.', components: [] });
                }
            } catch (e) {
                console.log(e)
	            await interaction.editReply({ content: 'No option recieved, cancelling.', components: [] });
            }
        } else {
            await interaction.editReply({ content: "You must be an overseer to add to the vault!", ephemeral: true })
        }
	},  
};