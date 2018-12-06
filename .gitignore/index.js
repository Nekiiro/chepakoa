const Discord = require('discord.js');

const client = new Discord.Client();

var prefix = "!";

var fs = require('fs');

client.login(process.env.TOKEN);

client.on("ready", () => {
    client.user.setGame("administrer")
})

client.on('message', message => {
    if(message.content === prefix + "aide"){
        var help_embed = new Discord.RichEmbed()
        .setTitle("Voici mes commandes d'aide :")
        .addField("!aide", "Affiche les commandes du bot")
        .addField("Commande Staff :", "Voici les commandes réservés aux admins du serveur")
        .addField("!clear", "Supprime un nombre choisi de message")
        .addField("!warn", "Met un warn à un joueur choisi")
        .addField("!deletewarn", "Supprime le warn d'un joueur choisi")
        .addField("!kick", "Kick le joueur choisi")
        .addField("!ban", "Ban le joueur choisi")
        message.channel.sendMessage(help_embed);
    }

    
    if(message.content.startsWith(prefix + "clear")) {
        if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous n'avez pas cette permission")

       let args = message.content.split(" ").slice(1);

        if(!args[0]) return message.channel.send("Tu dois mettre le nombre de messages à supprimer")
        message.channel.bulkDelete(args[0]).then();
    };

    let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));
 
if (message.content.startsWith(prefix + "warn")){
 
if (message.channel.type === "dm") return;
 
var mentionned = message.mentions.users.first();
 
if(!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) return message.reply("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**").catch(console.error);
 
if(message.mentions.users.size === 0) {
 
  return message.channel.send("**:x: Vous n'avez mentionnée aucun utilisateur**");
 
}else{
 
    const args = message.content.split(' ').slice(1);
 
    const mentioned = message.mentions.users.first();
 
    if (message.member.hasPermission('MANAGE_GUILD')){
 
      if (message.mentions.users.size != 0) {
 
        if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">") {
 
          if (args.slice(1).length != 0) {
 
            const date = new Date().toUTCString();
 
            if (warns[message.guild.id] === undefined)
 
              warns[message.guild.id] = {};
 
            if (warns[message.guild.id][mentioned.id] === undefined)
 
              warns[message.guild.id][mentioned.id] = {};
 
            const warnumber = Object.keys(warns[message.guild.id][mentioned.id]).length;
 
            if (warns[message.guild.id][mentioned.id][warnumber] === undefined){
 
              warns[message.guild.id][mentioned.id]["1"] = {"raison": args.slice(1).join(' '), time: date, user: message.author.id};
 
            } else {
 
              warns[message.guild.id][mentioned.id][warnumber+1] = {"raison": args.slice(1).join(' '),
 
                time: date,
 
                user: message.author.id};
 
            }
 
            fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
message.delete();
 
            message.channel.send(':warning: | **'+mentionned.tag+' à été averti**');
 
message.mentions.users.first().send(`:warning: **Warn |** depuis **${message.guild.name}** donné par **${message.author.username}**\n\n**Raison:** ` + args.slice(1).join(' '))
 
          } else {
 
            message.channel.send("Erreur mauvais usage: "+prefix+"warn <user> <raison>");
 
          }
 
        } else {
 
          message.channel.send("Erreur mauvais usage: "+prefix+"warn <user> <raison>");
 
        }
 
      } else {
 
        message.channel.send("Erreur mauvais usage: "+prefix+"warn <user> <raison>");
 
      }
 
    } else {
 
      message.channel.send("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**");
 
    }
 
  }
 
}
 
 
 
  if (message.content.startsWith(prefix+"seewarns")||message.content===prefix+"seewarns") {
 
    if (message.channel.type === "dm") return;
 
    if(!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) return message.reply("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**").catch(console.error);
 
        const mentioned = message.mentions.users.first();
 
        const args = message.content.split(' ').slice(1);
 
        if (message.member.hasPermission('MANAGE_GUILD')){
 
          if (message.mentions.users.size !== 0) {
 
            if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">") {
 
              try {
 
                if (warns[message.guild.id][mentioned.id] === undefined||Object.keys(warns[message.guild.id][mentioned.id]).length === 0) {
 
                 message.channel.send("**"+mentioned.tag+"** n'a aucun warn :eyes:");
 
                 return;
 
                }
 
              } catch (err) {
 
                message.channel.send("**"+mentioned.tag+"** n'a aucun warn :eyes:");
 
                return;
 
             }
          
             let arr = [];
 
             arr.push(`**${mentioned.tag}** a **`+Object.keys(warns[message.guild.id][mentioned.id]).length+"** warns :eyes:");
 
             for (var warn in warns[message.guild.id][mentioned.id]) {
 
              arr.push(`**${warn}** - **"`+warns[message.guild.id][mentioned.id][warn].raison+
 
               "**\" warn donné par **"+message.guild.members.find("id", warns[message.guild.id][mentioned.id][warn].user).user.tag+"** a/le **"+warns[message.guild.id][mentioned.id][warn].time+"**");
 
            }
 
             message.channel.send(arr.join('\n'));
 
           } else {
 
             message.channel.send("Erreur mauvais usage: "+prefix+"seewarns <user> <raison>");
 
            console.log(args);
 
          }
 
         } else {
 
           message.channel.send("Erreur mauvais usage: "+prefix+"seewarns <user> <raison>");
 
          }
 
        } else {
 
          message.channel.send("Désolé mais vous n'avez pas la permission d'effectuer cette comande");
 
     }
 
    }
 
 
 
 
 
    if (message.content.startsWith(prefix+"deletewarns")||message.content===prefix+"deletewarns") {
 
    if (message.channel.type === "dm") return;
 
    if(!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) return message.reply("Désolé mais vous n'avez pas la permission d'effectuer cette comande").catch(console.error);
 
       const mentioned = message.mentions.users.first();
 
       const args = message.content.split(' ').slice(1);
 
        const arg2 = Number(args[1]);
 
       if (message.member.hasPermission('MANAGE_GUILD')){
 
         if (message.mentions.users.size != 0) {
 
           if (args[0] === "<@!"+mentioned.id+">"||args[0] === "<@"+mentioned.id+">"){
 
            if (!isNaN(arg2)) {
 
             if (warns[message.guild.id][mentioned.id] === undefined) {
 
                  message.channel.send(mentioned.tag+" n'a aucun warn");
 
                return;
 
                } if (warns[message.guild.id][mentioned.id][arg2] === undefined) {
 
                  message.channel.send("**Ce warn n'existe pas**");
 
               return;
 
             }
 
             delete warns[message.guild.id][mentioned.id][arg2];
 
             var i = 1;
 
             Object.keys(warns[message.guild.id][mentioned.id]).forEach(function(key){
 
                 var val=warns[message.guild.id][mentioned.id][key];
 
                  delete warns[message.guild.id][mentioned.id][key];
 
                  key = i;
                
                   warns[message.guild.id][mentioned.id][key]=val;
 
                  i++;
 
             });
 
             fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
                if (Object.keys(warns[message.guild.id][mentioned.id]).length === 0) {
 
                  delete warns[message.guild.id][mentioned.id];
 
               }
 
                message.channel.send(`Le warn de **${mentioned.tag}**\': **${args[1]}** vient d'être supprimé.`);
 
                return;
               
              } if (args[1] === "tout") {
 
                delete warns[message.guild.id][mentioned.id];
                
                fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {if (err) console.error(err);});
 
                message.channel.send(`Les warns de  **${mentioned.tag}** viennent d'être supprimés.`);
 
                return;
 
              } else {
 
             message.channel.send("Erreur mauvais usage: "+prefix+"deletewarns <utilisateur> <nombre>");
 
              }
 
            } else {
 
              message.channel.send("Erreur mauvais usage: "+prefix+"deletewarns <utilisateur> <nombre>");
 
            }
 
         } else {
 
           message.channel.send("Erreur mauvais usage: "+prefix+"clearwarns <utilisateur> <nombre>");
            
       }
 
     } else {
 
       message.channel.send("**:x: Vous n'avez pas la permission `Gérer le serveur` dans ce serveur**");
 
        }
 
     }

     if(message.content.startsWith(prefix + "ban")) {
         if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.channel.send("Désolé mais vous n'avez pas la permission d'effectuer cette comande.");

         if(message.mentions.users.size === 0) {
             return message.channel.send("Vous devez mentionner l'utilisateur que vous souhaitez ban.")
         }

         var ban = message.guild.member(message.mentions.users.first());
         if(!ban) {
             return message.channel.send("Je ne pense pas que cet utilisateur soit sur ce serveur.");
         }

         if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
             return message.channel.send("Désolé mais vous n'avez pas la permission de ban un joueur.");
         }
         ban.ban().then(member => {
             message.channel.send(`${member.user.username} viens d'être ban par : ${message.author.username}`)
         }

         )
     }

     if(message.content.startsWith(prefix + "kick")) {
         if(!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return message.channel.send("Désolé mais vous n'avez la permission de kick un joueur.");

         if(message.mentions.users.size === 0) {
             return message.channel.send("Vous devez mentionner l'utilisateur que vous souhaitez kick.")
         }

         var kick = message.guild.member(message.mentions.users.first());
         if(!kick) {
             return message.channel.send("Je ne pense pas que cet utilisateur soit sur ce serveur.")
         }

         if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
             return message.channel.send("Désolé mais vous n'avez pas la permission de kick un joueur.");
         }

         kick.kick().then(member => {
             message.channel.send(`${member.user.username} vient d'être kick par : ${message.author.username}`)
         });
     }

})
