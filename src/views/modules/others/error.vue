<template>
  <div class="misc-wrapper">
    <b-link class="brand-logo" :to="'/'">
      <img src="@/assets/images/logo/enviame.svg" alt="login" class="mx-auto" width="200">
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <h2 class="mb-1">
          {{$t($route.meta.error.title)}} 🔐
        </h2>
        <p class="mb-2">
          {{$t($route.meta.error.subtitle)}}
        </p>
        <!-- <b-button
          variant="primary"
          class="mb-1 btn-sm-block"
          :to="loginRoute()"
        >{{$t('Volver al inicio')}}</b-button> -->
        <b-img
          fluid
          :src="imgUrl"
          :alt="$t($route.meta.error.title)"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { BLink, BImg, BButton } from 'bootstrap-vue'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

export default {
  components: {
    BLink, BImg//, BButton
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/not-authorized.svg')
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require(`@/assets/images/pages/${this.$route.meta.error.code}-dark.svg`)
        return this.downImg
      }
      return this.downImg
    }
  },
  methods: {
    loginRoute() {
      const user = this.$session.get('cas_user')
      return getHomeRouteForLoggedInUser(user ? user.role : null)
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
