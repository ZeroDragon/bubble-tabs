import { populateStorage, saveStorage } from './storage.js'
const cache = {}

populateStorage(cache).catch(console.error).then(_ => {
  autoRemove.checked = Boolean(cache.autoRemove)
  maxTabs.value = cache.maxTabs
  drawCollected()
})
autoRemove.addEventListener('change', event => {
  cache.autoRemove = Boolean(event.target.checked)
  saveStorage(cache)
})
maxTabs.addEventListener('keyup', event => {
  const input = (event.target.value.match(/\d/g)|| [1]).join('')
  const validated = Math.max(parseInt(input, 10), 1)
  event.target.value = validated
  cache.maxTabs = validated
  saveStorage(cache)
})
const drawCollected = _ => {
  while (collectedTabs.firstChild) collectedTabs.removeChild(collectedTabs.firstChild)
  const elements = new Set()
  cache.deleted.forEach(({url, title}, k) => {
    const element = liTemplate.content.firstElementChild.cloneNode(true)
    const anchor = element.querySelector('a')
    const index = element.querySelector('span.index')
    const remover = element.querySelector('span.deleter')
    anchor.setAttribute('href', url)
    anchor.innerHTML = title
    index.innerHTML = k + 1
    remover.addEventListener('click', _ => deleteItem(k))
    elements.add(element)
  })
  collectedTabs.append(...elements)
}
const deleteItem = index => {
  if (index === -1) cache.deleted = []
  else cache.deleted = cache.deleted.filter((_, k) => k !== index)
  saveStorage(cache)
  drawCollected()
}
clearCollected.addEventListener('click', _ => deleteItem(-1))
