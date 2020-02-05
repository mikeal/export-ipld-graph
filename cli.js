#!/usr/bin/env node
const exporter = require('./')
const IPFS = require('ipfs')
const fs = require('fs')

const options = yargs => {
  yargs.positional('cid', {
    desc: 'Content Identified'
  })
  yargs.positional('output', {
    desc: 'Output file, prints to stdout if omitted'
  })
}

const run = async argv => {
  const node = await IPFS.create()
  const writable = argv.output ? fs.createWriteStream(argv.output) : process.stdout
  await exporter(argv.cid, node, writable)
  node.stop()
  process.exit()
}

const yargs = require('yargs')
// eslint-disable-next-line
const args = yargs
  .command('$0 <cid> [output]', 'Export a car file for the full graph from IPFS', options, run)
  .argv
