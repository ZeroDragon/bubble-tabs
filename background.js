import { populateStorage, saveStorage } from './storage.js'
const cache = { autoRemove: false, maxTabs: 10, deleted: [] }
populateStorage(cache, true)

const move = async activeInfo => {
  try {
    await chrome.tabs.move(activeInfo.tabId, {index: 0});
    if (cache.autoRemove) garbageCollect()
  } catch (error) {
    if (error == 'Error: Tabs cannot be edited right now (user may be dragging a tab).') {
      setTimeout(() => move(activeInfo), 50);
    }
  }
}

const garbageCollect = async _ => {
  const tabs = await chrome.tabs.query({ active: false })
  const toDelete = tabs.slice(cache.maxTabs - 1)
  cache.deleted.unshift(...toDelete)
  cache.deleted = cache.deleted.slice(0, 50)
  saveStorage(cache)
  toDelete.forEach(({ id }) => chrome.tabs.remove(id))
}

chrome.storage.onChanged.addListener(_ => {
  populateStorage(cache)
})

chrome.tabs.onActivated.addListener(activeInfo => move(activeInfo));
