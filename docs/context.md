# Context API

## For all events
                      
### ctx.bot: Bot
### ctx.rtm: RtmClient
### ctx.webClient: WebClient
### ctx.team: Team
### ctx.userId: ?string
### ctx.channelId: ?string
### ctx.logger: Logger
### ctx.user: ?User
### ctx.dm: ?DM
### ctx.channel: ?Channel
### ctx.group: ?Group
### ctx.userDM: ?DM
### ctx.mention(userId: ?string): string
### ctx.fromMe: boolean

## For RTM Events

### ctx.event: Object    
### ctx.reply(text: string)
Note: requires a channelId       
### ctx.replyInDM(text: string)
Note: requires a channelId
### ctx.addEmoji(emoji: string)
### ctx.addEmoji(emoji: string)


## For interactive message

### ctx.reply(string: string, { replace = true: boolean })
### ctx.replyEphemeral(string: string, { replace = true: boolean })
