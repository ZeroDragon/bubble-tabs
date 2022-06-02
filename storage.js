export const populateStorage = (cache, save = false) => {
  return chrome.storage.sync.get().then(data => {
    Object.assign(cache, data)
    if (save) saveStorage(cache)
    return true
  })
}

export const saveStorage = cache => {
  chrome.storage.sync.set(cache)
}
