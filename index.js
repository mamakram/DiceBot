const token = process.env['TOKEN']
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', msg => {
  if (msg.content.substring(0, 2) === "?r") {
    let array = msg.content.split(" ")
    if (array.length != 2) {
      msg.channel.send(`Error. Wrong Syntax`)
    } else {
      let content = array[1]
      let array2 = content.split("d")
      if (array2.length != 2) {
        msg.channel.send(`Error. Wrong Syntax`)
      }
      else {
        let amount = parseInt(array2[0])
        let cap = parseInt(array2[1])
        let sum = 0
        let critic_fail = Math.floor((cap / 100) * 90 + 1)
        let output = `<@${msg.author.id}>` + "```ansi\n" + "\u001b[0;37mResult : "
        let counter = amount
        while (counter > 0) {
          let die = Math.floor(Math.random() * (cap)) + 1
          if (die === 1) {
            output += "\u001b[1;32m" + die + "\u001b[0;37m"
          } else if (die >= critic_fail) {
            output += "\u001b[1;31m" + die + "\u001b[0;37m"
          } else {
            output += +die
          }
          if (counter > 1) {
            output += ", "
          }
          sum += die
          counter -= 1
        }
        output += " (" + amount + "d" + cap + ")"
        if (amount > 1) { output += "\nSum: " + sum }
        output += "```"
        msg.channel.send(output)
      }
    }
  }
})

client.login(token)