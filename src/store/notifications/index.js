import * as fb from '@/firebase'

export default {
  state: {
    list: []
  },
  getters: {},
  mutations: {
    setNotifications(state, val) {
      state.list = val
    },
    setNotificationsRead(state, val) {
      state.notificationsRead = val
    }
  },
  actions: {
    markAsRead({ dispatch }, id) {
      fb.notificationsCollection.doc(id)
        .update({views: fb.incFB(1)})
      dispatch('updateUserNotificationRead', id)
    },
    updateUserNotificationRead({ commit, state }, id) {
      const notifications = state.list
      const idUser = fb.auth.currentUser.uid
      const ref = fb.accountsCollection.doc(idUser)

      ref.onSnapshot(resp => {
        let notificationsRead = resp.data().notificationsRead
        notificationsRead = [... new Set(notifications
          .filter(notification => notificationsRead.includes(notification.id))
          .map(notification => notification.id)
          .concat(id))]

        ref.update({notificationsRead})
      })
    }
  }
}
