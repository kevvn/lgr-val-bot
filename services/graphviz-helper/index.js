const { svg2png } = require('svg-png-converter')
const { db } = require('../firestore')

// const QuickChart = require('quickchart-js');
const DB_USER_COLLECTION = "LGR_Users"
const sendChartToDiscord = (message, png) => {

  message.channel.send({
    files: [{
      attachment: png,
      name: 'file.png',
      description: 'A description of the file'
    }]
  })
}
const createGridLabel = (elemArray, col) => {
  const numRows = Math.ceil(elemArray.length/col);
  const initialSubArray = elemArray.slice(0,col) 
  let returnString = `{${initialSubArray.join('|')}}`
  for(let i = 1 ; i < numRows ; i++) {
    const subArray = elemArray.slice(i*col,(i+1)*col);
    returnString = `${returnString}|{${subArray.join('|')}}`
  }
  return returnString;
}
const createGraph = async (message) => {
  let graphUsers = ["SERVER [shape=box]","Bots [shape=box]", "SERVER->Bots"];
  const userIdtoUsername = {};
  const members = await message.guild.members.fetch()
  const dbStoredInviteData = await db.collection(DB_USER_COLLECTION).get()
  const storedData = {}
  dbStoredInviteData.docs.map(user => {
    let userId = user.id
    const data = user.data()
    storedData[userId] = data.inviteFrom;
  })
  for ([_,member] of members) {
    userIdtoUsername[member.user.id] =  {
      username: member.nickname || member.user.username,
      bot: member.user.bot
    }
  }
  const unvouched = []
  for ( [id, {username, bot}] of Object.entries(userIdtoUsername)) {
    const inviterId = storedData[id]
    if(inviterId==="0"){
      graphUsers.push(`"${username}" [shape=box]`)
      graphUsers.push(`SERVER->"${username}"`)
    }
    else if(!inviterId){
      if(bot) {
        graphUsers.push(`"${username}" [shape=box]`)
        graphUsers.push(`Bots->"${username}"`)
      } else {
        unvouched.push(`${username}`)
      }
    }else{
      if(userIdtoUsername[inviterId]) {
        graphUsers.push(`"${username}" [shape=box]`)
        graphUsers.push(`"${userIdtoUsername[inviterId].username}"->"${username}"`)
      } else {
        console.log("ERROR",inviterId, id, userIdtoUsername[inviterId])
      }
    }
  }
  const dgraph = `
    digraph{
      ${graphUsers.join(';\n')};
      label = "Discord";
    }
  `
  const  unvochedGrid = `
    graph{
      Unvouched [width=3, shape=record, label="{Unknown Invite|${createGridLabel(unvouched,5)}}"];
    }
  `
  const url = `https://quickchart.io/graphviz?graph=${dgraph}`
  const recordUrl = `https://quickchart.io/graphviz?graph=${unvochedGrid}`
  const response = await fetch(url)
  const unvouchedRecord = await fetch(recordUrl)

  const svg = await response.text()
  const outputBuffer = await svg2png({
    input: svg,
    encoding: 'buffer',
    format: 'png',
    quality: 1
  })
  const gridSvg = await unvouchedRecord.text()
  const gridOutputBuffer = await svg2png({
    input: gridSvg,
    encoding: 'buffer',
    format: 'png',
    quality: 1
  })
  sendChartToDiscord(message, outputBuffer)
  sendChartToDiscord(message, gridOutputBuffer)      
      
}
module.exports={
    createGraph
}
