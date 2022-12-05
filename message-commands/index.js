const { createGraph } = require("../services/graphviz-helper")


const lookForCommand = (message) => {
    // 835044781839089664 is the valorant channel
	// if(message.channelId === '835044781839089664' && /lf\dm/.test(message.content.toLocaleLowerCase())){
	// 	let rawdata = fs.readFileSync(path.join(__dirname, 'looking-for-queue.json'))
	// 	let lookingForQueue = await JSON.parse(rawdata);
	// 	let mentionString = ''

	// 	if(lookingForQueue.length === 0) {
	// 		message.channel.send('No one is on deck')
	// 		return
	// 	}
	// 	for(index in lookingForQueue){
	// 		mentionString += ` <@${lookingForQueue[index]}>`
	// 	}
	// 	mentionString += ' WAKE UP BITCHES ITS VALOTIME'
	// 	message.channel.send(mentionString)

	// }
}

const messageCommandProvider = (message) => {
    lookForCommand(message)
    if(message.content=='test_graph'){
        createGraph(message)
    }
}
module.exports = {
    messageCommandProvider
}