<template>
  <b-nav-item-dropdown
    class="dropdown-notification mr-25"
    menu-class="dropdown-menu-media"
    right
  >
    <template #button-content>
      <feather-icon
        :badge="newNotifications || ''"
        badge-classes="bg-danger"
        class="text-body"
        icon="BellIcon"
        size="21"
      />
    </template>

    <!-- Header -->
    <li class="dropdown-menu-header">
      <div class="dropdown-header d-flex">
        <h4 class="notification-title mb-0 mr-auto">
          Notificaciones
        </h4>
        <b-badge v-if="newNotifications > 0"
          pill
          variant="light-primary"
        >
          {{newNotifications}} nueva{{newNotifications !== 1? 's' : ''}}
        </b-badge>
      </div>
    </li>

    <!-- Notifications -->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="scrollable-container media-list scroll-area"
      tagname="li"
    >
      <!-- Account Notification -->
      
      <b-link
        v-if="!loading"
        v-for="notification in notifications.list"
        :key="notification.subtitle"
        @click="() => openNotification(notification.id)"
      >
        <b-media>
          <template #aside>
            <b-avatar
              size="32"
              :variant="notification.type"
            >
              <feather-icon :icon="notification.icon || ''" />
            </b-avatar>
          </template>
          <p class="media-heading">
            <span class="font-weight-bolder">
              {{ notification.title }}
            </span>
          </p>
          <small class="notification-text">{{ notification.subtitle }}</small>
        </b-media>
      </b-link>
      <b-link v-if="loading">
        <b-media class="text-center">
          <feather-icon icon="RefreshCwIcon" class="spinner" size="3x"/> 
        </b-media>
      </b-link>
      <b-link v-if="notifications && notifications.length === 0 && !loading">
        <b-media class="text-center">
          No tienes notificaciones
        </b-media>
      </b-link>
    </vue-perfect-scrollbar>

    <!-- Cart Footer 
    <li class="dropdown-menu-footer"><b-button v-if="newNotifications > 0"
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
      block
      @click="markAllRead"
    >Marcar todas como leídas</b-button>
    </li>  -->
    <modal-show-notification :notifications="notifications.list" :indexNotification.sync="indexNotification"></modal-show-notification>
  </b-nav-item-dropdown>
</template>

<script>
import { mapState } from 'vuex'
import ModalShowNotification from './ModalShowNotification.vue'
import {
  BBadge, BMedia, BLink, BAvatar, BButton, BNavItemDropdown
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BNavItemDropdown,
    BBadge,
    BMedia,
    BLink,
    BAvatar,
    VuePerfectScrollbar,
    // BButton,
    ModalShowNotification
  },
  directives: {
    Ripple
  },
  data () {
    return {
      systemNotifications: [],
      loading: false,
      newNotifications: 0,
      indexNotification: -1
    }
  },
  computed: {
    ...mapState(['notifications'])
  },
  watch: {
    indexNotification (curr, prev) {
      if (curr !== -1) this.$store.dispatch('markAsRead', this.notifications.list[curr].id)
    }
  },
  mounted () {
    // this.getNotifications()
  },
  methods : {
    openNotification (_id) {
      this.indexNotification = this.notifications.list.findIndex(({id}) => id === _id)
      this.$bvModal.show('modalShowNotification')
    }
    // stripHTML (html) {
    //   const tmp = document.createElement('DIV')
    //   tmp.innerHTML = html
    //   return tmp.textContent || tmp.innerText || ''
    // },
    // parseRows (rows) {
    //   const notifications = []
    //   this.newNotifications = 0
    //   let index = 0
    //   for (const rawRow of rows) {
    //     const row = rawRow.data()
    //     const id = rawRow.id
    //     const notifIsRead = (this.$session.get('cas_user').notificationsRead || []).includes(id)
    //     this.newNotifications = this.newNotifications + (!notifIsRead ? 1 : 0)
    //     notifications.push({
    //       id,
    //       title: row.title,
    //       subtitle: `${this.stripHTML(row.content.replace(/></g, '> <')).substring(0, 100)}...`,
    //       content: row.content,
    //       type: notifIsRead ? 'light-success' : 'light-warning',
    //       icon: notifIsRead ? 'CheckCircleIcon' : 'AlertTriangleIcon',
    //       index
    //     })
    //     index++
    //   }
    //   this.notifications = [...notifications]
    //   this.loading = false
    //   this.keyTableRender++
    // },
    // getNotifications () {
    //   this.$root.$data.notificationsCollection
    //     .onSnapshot(resp => this.parseRows(resp.docs))
    // },
    // getNotificationsRead () {
    //   if (!this.refUser) {
    //     const user = this.$root.$data.auth.currentUser
    //     if (user) {
    //       this.refUser = this.$root.$data.accountsCollection.doc(user.uid)
    //       this.refUser.onSnapshot(resp => {
    //         this.notificationsRead = resp.data().notificationsRead
    //       })
    //     }
    //   }
    // },
    // updateReadNotifications(currentIndex) {
    //   this.getNotificationsRead()
    //   if (!!this.refUser && this.notifications && this.notifications.length > 0 && currentIndex !== -1) {
    //     const notificationsRead = [... new Set(this.notifications
    //       .filter(noti => this.notificationsRead.includes(noti.id))
    //       .map(noti => noti.id)
    //       .concat(this.notifications[currentIndex].id))]
        
    //     this.refUser.update({notificationsRead})
    //       .then(resp => {
    //         const user = {
    //           ...this.$session.get('cas_user'),
    //           notificationsRead
    //         }
    //         this.$session.set('cas_user', user)
    //         this.updateNotification(this.notifications[currentIndex].id)
    //       })
    //       .catch(err => console.error(err))
    //   }
    // },
    // updateNotification (id) {
    //   this.$root.$data.notificationsCollection.doc(id)
    //     .update({views: this.$root.$data.incFB(1)})
    // },
    // markAllRead () {
    //   this.notifications.map((_, index) => {
    //     this.updateReadNotifications(index)
    //   })
    // }
  },
  setup() {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false
    }

    return {
      perfectScrollbarSettings
    }
  }
}
</script>

<style>

</style>
