## get started
* * *
*once you have added Charisma to your server, there's a whole list of features that you can start taking advantage of, and here's a few to get you started*
* * *
##### an auto assigned "autorole"
you can do:\
`//set guild.config.autorole <role>`\
which will configure Charisma to automatically give newcomers that role provided it's within Charisma's jurisdiction
* * *
##### logging user update notifications
you can first define a "log channel" by doing:\
`//set guild.config.logchannel <channel>`\
(make sure Charisma has permission to send messages in the channel)\
after you've done that, you can enable all the notification messages:
<br><br>
`//enable logs.joins`\
`//enable logs.leaves`\
`//enable logs.bans`\
`//enable logs.nicknamechanges`\
`//enable logs.namechanges`
<br><br>
all of which do exactly what they look like they do\
<br>
and if at any point, you wish to disable some of these logs, you can just use the `//disable` command like you would `//enable`\
*(please note: if at any point Charisma loses her ability to send messages in the log channel, the `logchannel` value in the config will be reset when/if any log events are triggered)*\
<br>
if you feel inclined to do so, you can even change the colors of the log embed messages. if you do `//get guild.colors.logs` you can see all the colors you can change related to the log feature. which you can then do `//set guild.colors.logs.<type of log> #hexcolor` to change the color
* * *
##### enabling an experience / leveling system
another "core feature" of Charisma is her advanced experience system\
you can enable it by doing:\
`//enable leveling`\
which allows everyone to recieve experience when they send messages\
by default, the "exp curve" is set to `2.2`, but it can be changed to any number ranging from `0.1` to `5.0` *(both of those values are not recommended)*\
to change the curve, all you have to do is: `//set guild.config.expcurve <number>`
* * *
##### changing the command prefix
by default, the command prefix is set to `//`, but that can be changed of course,
all you have to do is: `//set guild.config.prefix <new prefix>`\
*(please note that the prefix can have a max character length of 3)*\
after that command was run, you can start using commands with your new prefix