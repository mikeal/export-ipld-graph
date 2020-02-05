const CID = require('cids')
const Block = require('@ipld/block')
const CarDatastore = require('datastore-car')

const all = async function * (cid, ipfs) {
  if (!CID.isCID(cid)) cid = new CID(cid)
  const _block = await ipfs.block.get(cid)
  const block = Block.create(_block.data, cid)
  yield block
  const reader = block.reader()
  for (const [,link] of reader.links()) {
    yield * all(link, ipfs)
  }
}

module.exports = async (cid, ipfs, stream) => {
  const car = await CarDatastore.writeStream(stream)
  if (!CID.isCID(cid)) cid = new CID(cid)
  car.setRoots([cid])
  for await (const block of all(cid, ipfs)) {
    await car.put(await block.cid(), block.encodeUnsafe())
  }
  await car.close()
}
