const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { svg2png } = require('svg-png-converter')

// const QuickChart = require('quickchart-js');

const sendChartToDiscord = (message, png) => {

  message.channel.send({
    files: [{
      attachment: png,
      name: 'file.png',
      description: 'A description of the file'
    }]
  })
}
const createGraph = async (message) => {
  const dgraph = `
    digraph{
      main->parse;
      parse->execute;
      main->init;
      main->cleanup;
      execute->make_string;
      execute->printf;
      init->make_string;
      main->printf;
      execute->compare;
    }
  `
  const url = `https://quickchart.io/graphviz?graph=${dgraph}`
  const response = await fetch(url)

  const svg = await response.text()
  const outputBuffer = await svg2png({
    input: svg,
    encoding: 'buffer',
    format: 'png',
    quality: 1
  })
  sendChartToDiscord(message, outputBuffer)      
}
module.exports={
    createGraph
}
