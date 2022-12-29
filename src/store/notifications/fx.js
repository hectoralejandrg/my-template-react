
const stripHTML = (html) => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}
const parseRows = (rows) => {
  const notifications = []
  // this.newNotifications = 0
  let index = 0
  for (const rawRow of rows) {
    const row = rawRow.data()
    const id = rawRow.id
    const notifIsRead = true// (this.$session.get('cas_user').notificationsRead || []).includes(id)
    // this.newNotifications = this.newNotifications + (!notifIsRead ? 1 : 0)
    notifications.push({
      id,
      title: row.title,
      subtitle: `${stripHTML(row.content.replace(/></g, '> <')).substring(0, 100)}...`,
      content: row.content,
      type: notifIsRead ? 'light-success' : 'light-warning',
      icon: notifIsRead ? 'CheckCircleIcon' : 'AlertTriangleIcon',
      index
    })
    index++
  }
  // this.notifications = [...notifications]
  return notifications
}

const getNotificationsRead = () => {
  return []
}

export { parseRows, getNotificationsRead }