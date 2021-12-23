const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('quick.db')
client.on('ready', async () => {
    console.log("Ready")
})


client.on('message', async message => {
    if (message.author.bot) return;

    if(message.channel.type !== "text") {
        let active = db.fetch(`support_${message.author.id}`)

        let guild = client.guilds.cache.get('GUILD ID')

        let channel, found = true

        try {
            if (active) client.channels.cache.get(active.channelID).guild
        } catch (e) {
            found = false;
        }

        if(!active || !found) {
            active = {}

            channel = await guild.channels.create(`${message.author.username}-${message.author.discriminator}`, {
                parent: '719312548721066056',
                topic: `?complete to close the ticket | Support for ${message.author.tag} | ID: ${message.author.id}`
            })

            let author = message.author

            const newChannel = new Discord.MessageEmbed()
            .setColor(0x36393e)
            .setAuthor(author.tag, author.displayAvatarURL())
            .setFooter("Support Ticket Created||Please keep patience a staff member will come to assist you soon!")
            .addField('User', author)
            .addField("ID", author.id)

            channel.send(newChannel)

            const newTicket = new Discord.MessageEmbed()
            .setColor(0x36393e)
            .setFooter('Support Ticket Created')
            .setAuthor(`Hello ${author.tag}`, author.displayAvatarURL())

            author.send(newTicket)

            active.channelID = channel.id
            active.targetID = author.id

            channel = client.channels.cache.get(active.channelID)

            const dm = new Discord.MessageEmbed()
            .setColor(0x36393e)
            .setFooter(`Your message has been sent -- Please
            do
            (go back to the server and check the ticket with your name on it for assistance.`)
            .setAuthor(`Thank You ${message.author.tag}`, message.author.displayAvatarURL())

            message.author.send(dm)

            //new ticket
            const embed = new Discord.MessageEmbed()
            .setColor(0x36393e)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .setFooter(`Message Recieved -- ${message.author.tag}`)
            channel.send(embed)

            //update data

            db.set(`support_${message.author.id}`, active)
            db.set(`supportChannel_${channel.id}`, message.author.id)


        }

        let support = db.fetch(`supportChannel_${message.channel.id}`)

        console.log(message.channel.id)

        if(support) 
        {
            support = db.fetch(`support_${support}`)

            let supportUser = this.client.users.cache.get(support.targetID)

            if(!supportUser) return message.channel.delete()


            if (message.content.toLowerCase() === "?complete") {
                const complete = new Discord.MessageEmbed()
                .setColor(0x36393e)
                .setAuthor(`Hey, ${message.author.tag}`, supportUser.displayAvatarURL())
                .setFooter(`Ticket Closed --> ServerName`)
                .setDescription(`Your ticket has been marked as complete to reopen a new ticket message the bot`)

                supportUser.send(complete)

                message.channel.delete()

                db.delete(`support_${support.targetID}`)
            }

            const embed = new Discord.MessageEmbed()
            .setColor(0x36393e)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .setFooter(`Message Recieved -- Envisions Scrims NA`)

            this.client.users.cache.get(support.targetID).send(embed)


            message.delete({timeout: 1000})

            embed.setFooter(`Message sent -- ${supportUser.tag}`).setDescription(message.content)

            return message.channel.send(embed)
      }
    }
})







client.login("BOT-TOKEN")
