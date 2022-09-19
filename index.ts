import DiscordJs, { GatewayIntentBits, Guild, GuildMember, GuildMemberRoleManager, Partials, ReactionEmoji, PermissionsBitField, TextChannel, VoiceChannel } from 'discord.js'
import { CronJob } from 'cron';
//const keepAlive = require('../keep_alive.js');

const prefix = '!'
const guildId = '1018633393883332749'
var rulesReactionMsgId = '1019063295153541181'
var startTime = 0


const client = new DiscordJs.Client({

  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

const hourJob = new CronJob('01 00 * * * *', () => {
  let dateTime = new Date()
  console.log(`Hour update: Alive - UTC: ${dateTime.getUTCHours()} and current: ${dateTime.getHours()} and UTC+5: ${dateTime.getUTCHours() + 5}`)
})

const nightJob = new CronJob('00 00 22 * * *', () => {
  let dateTime = new Date()
  console.log("turning channels off")
  var server = client.guilds.cache.get(guildId)
  if (!server) { return }
  var textChannels = server.channels.cache.filter(ch => ch.type === 0 && ch.id === '1018678127859339285' && ch.type === 0 || ch.id === '1018693100014669894' && ch.type === 0 || ch.id === '1018659133441978460' && ch.type === 0 || ch.id === '1018660046755876865' && ch.type === 0)
  textChannels?.forEach(element => {
    if (!server) { return }
    const channel = server.channels.cache.get(element.id)
    if (!channel) { return } if (!channel.isTextBased()) { return }
    (channel as TextChannel).permissionOverwrites.create(channel.guild.roles.everyone, { SendMessages: false, ViewChannel: false })
  })
  console.log("voice")
  var voiceChannels = server.channels.cache.filter(ch => ch.type === 2 && ch.id === '1018633394348896356' || ch.type === 2 && ch.id === '1018732046820053052')
  voiceChannels.forEach(element => {
    if (!server) { return }
    const channel = server.channels.cache.get(element.id)
    if (!channel) { return } if (!channel.isVoiceBased()) { return }
    (channel as VoiceChannel).permissionOverwrites.create(channel.guild.roles.everyone, { Connect: false, ViewChannel: false })
  })


})

const dayJob = new CronJob('00 00 07 * * *', () => {
  let dateTime = new Date()
  console.log("opening channels!")
  var server = client.guilds.cache.get(guildId)
  if (!server) { return }
  var textChannels = server.channels.cache.filter(ch => ch.type === 0 && ch.id === '1018678127859339285' && ch.type === 0 || ch.id === '1018693100014669894' && ch.type === 0 || ch.id === '1018659133441978460' && ch.type === 0 || ch.id === '1018660046755876865' && ch.type === 0)
  textChannels?.forEach(element => {
    if (!server) { return }
    const channel = server.channels.cache.get(element.id)
    if (!channel) { return } if (!channel.isTextBased()) { return }
    (channel as TextChannel).permissionOverwrites.create(channel.guild.roles.everyone, { SendMessages: true, ViewChannel: false })
  })
  console.log("voice")
  var voiceChannels = server.channels.cache.filter(ch => ch.type === 2 && ch.id === '1018633394348896356' || ch.type === 2 && ch.id === '1018732046820053052')
  voiceChannels.forEach(element => {
    if (!server) { return }
    const channel = server.channels.cache.get(element.id)
    if (!channel) { return } if (!channel.isVoiceBased()) { return }
    (channel as VoiceChannel).permissionOverwrites.create(channel.guild.roles.everyone, { Connect: true, ViewChannel: false })
  })
})


function callback(err: any) {
  console.error(err);
}

client.once('ready', c => {
  console.log(`Ready! Logged in as ${client?.user?.tag}`)
  let dateTime = new Date()
  startTime = dateTime.getTime()
  console.log(startTime)
  nightJob.start()
  dayJob.start()
  hourJob.start()
})

client.on('messageReactionAdd', async (reaction, user) => {
  try {
    await reaction.fetch();
    if (reaction.message.id === rulesReactionMsgId) {
      console.log(reaction.emoji.name)
      if (reaction.emoji.name === '✅') {
        if (reaction.message.author?.id === client.user?.id) {
          if (reaction.message.guild) {
            var role = reaction.message.guild.roles.cache.find(role => role.id === "1018923824655384616")
            if (!role) return
            let member = reaction.message.guild.members.fetch(user.id)
              ; (await member).roles.add(role)
            console.log("Roles removed! ")
          }
        }
      }
    }
  } catch (error) {
    console.error('Something went wrong when fetching the message:', error);
    // Return as `reaction.message.author` may be undefined/null
    return;
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  try {
    await reaction.fetch();
    if (reaction.message.id === rulesReactionMsgId) {
      if (reaction.emoji.name === '✅') {
        if (reaction.message.author?.id === client.user?.id) {
          if (reaction.message.guild) {
            var role = reaction.message.guild.roles.cache.find(role => role.id === "1018923824655384616")
            if (!role) return
            let member = reaction.message.guild.members.fetch(user.id)
              ; (await member).roles.remove(role)
            console.log("Role removed! ")
          }
        }
      }
    }
  } catch (error) {
    console.error('Something went wrong when fetching the message:', error);
    // Return as `reaction.message.author` may be undefined/null
    return;
  }
});

client.on('messageCreate', (msg) => {
  if (msg) {
    if (msg.content.charAt(0) !== prefix || msg.author.bot) {
      return
    }

    const msgCmd = msg.content.substring(1).toLowerCase()


    // Send message
    if (msgCmd.includes('sendmsg')) {
      var messageOnly = msg.content.replace(prefix + 'sendmsg ', '')
      msg.channel.send(messageOnly.replace(' setreaction', '')).then(sent => { // 'sent' is that message you just sent
        if (msgCmd.includes('setreaction')) {
          rulesReactionMsgId = sent.id
        }
      });
      msg.delete()
      return
    }

    // Edit message
    if (msgCmd.includes('editmsg')) {
      var messageOnly = msg.content.replace(prefix + 'sendmsg ', '')
      var editId = messageOnly.substring(messageOnly.indexOf(' ') + 1)
      msg.channel.messages.fetch(editId)
        .then(message => message.delete)
        .catch(console.error)
      msg.delete()
      return
    }

    // Create reaction
    if (msgCmd.includes('sendreaction')) {
      var cmdOnly = msgCmd.replace('sendreaction ', '')
      var msgId = cmdOnly.substring(0, cmdOnly.indexOf(' '))
      var reactionEmoji = cmdOnly.substring(cmdOnly.indexOf(' ') + 1)
      msg.channel.messages.fetch(msgId)
        .then(message => message.react(reactionEmoji))
        .catch(console.error);
      msg.delete()
      return
    }


    // Ping pong
    if (msgCmd === 'ping') {

      msg.reply({
        content: `🏓Latency is ${msg.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`
      })
    }
    if (msgCmd === 'uptime') {
      let dateTime = new Date()
      var currentTime = dateTime.getTime()
      msg.reply({
        content: `Current bot uptime is ${currentTime - startTime}ms`
      })
    }

    // Name change
    if (msgCmd.includes('name')) {
      if (msg.member) {
        if (msg.author.id === msg.guild?.ownerId) {
          msg.reply("Unable to change username of the owner")
          return
        }
        if (msg.member.roles.cache.some(role => role.name === 'Name changed')) {
          msg.reply("You have already changed your name once. Ask an administrator to change your name!")
          return
        }

        if (msgCmd.replace('name ', '') === '') {
          msg.reply("Name cannot be left blank")
          return
        }

        if (msg.guild) {
          var role = msg.guild.roles.cache.find(role => role.name === "Name changed")
          if (!role) return
          msg.member.roles.add(role)
          console.log("Roles added! ")
        }
        var correctUsername = msgCmd.replace('name ', '')
        msg.member.setNickname(correctUsername).catch(callback)



        msg.reply({
          content: 'Name has been changed',
        })
      }
    }
  }
})

client.login('MTAxODcwMDk3NTI2NTAyNjA0OA.GjVRbY.k9mgdLk9HUXO1djqpopAJ6tiwzccaryP-Xi_dQ')
//keepAlive()