let myStorage = window.localStorage;
function addItem(item) {
  let lastValue = myStorage.getItem('canvas')
  myStorage.clear()
  if (lastValue !== null) {
    let tmp = JSON.parse(lastValue)
    tmp.push(item)
    myStorage.setItem('canvas', JSON.stringify(tmp))
  }
  else {
    let res = []
    res.push(item)
    myStorage.setItem('canvas', JSON.stringify(res))
  }
};
function getItems() {
  return JSON.parse(myStorage.getItem('canvas'))
}

export { myStorage, addItem, getItems }