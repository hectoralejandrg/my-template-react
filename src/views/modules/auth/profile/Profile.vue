<template>
  <b-tabs
    vertical
    content-class="col-12 col-md-9 mt-1 mt-md-0"
    pills
    nav-wrapper-class="col-md-3 col-12"
    nav-class="nav-left"
  >
    <b-tab active>
      <template #title>
        <feather-icon icon="UserIcon" size="18" class="mr-50"/>
        <span class="font-weight-bold">{{$t('General')}}</span>
      </template>
      <account-setting-general/>
    </b-tab>

    <b-tab>
      <template #title>
        <feather-icon icon="LockIcon" size="18" class="mr-50"/>
        <span class="font-weight-bold">{{$t('Cambiar contraseña')}}</span>
      </template>
      <account-setting-password />
    </b-tab>

    <!--b-tab>
      <template #title>
        <feather-icon icon="InfoIcon" size="18" class="mr-50"/>
        <span class="font-weight-bold">{{$t('Información')}}</span>
      </template>
      <account-setting-information v-if="options.info" :information-data="options.info"/>
    </b-tab>

    <b-tab>
      <template #title>
        <feather-icon icon="LinkIcon" size="18" class="mr-50"/>
        <span class="font-weight-bold">{{$t('Redes sociales')}}</span>
      </template>
      <account-setting-social v-if="options.social" :social-data="options.social"/>
    </b-tab>

    <b-tab>
      <template #title>
        <feather-icon icon="BellIcon" size="18" class="mr-50"/>
        <span class="font-weight-bold">{{$t('Notificaciones')}}</span>
      </template>
      <account-setting-notification v-if="options.notification" :notification-data="options.notification"/>
    </b-tab-->
  </b-tabs>
</template>

<script>
import { BTabs, BTab } from 'bootstrap-vue'
import AccountSettingGeneral from './AccountSettingGeneral.vue'
import AccountSettingPassword from './AccountSettingPassword.vue'
import AccountSettingInformation from './AccountSettingInformation.vue'
import AccountSettingSocial from './AccountSettingSocial.vue'
import AccountSettingNotification from './AccountSettingNotification.vue'

export default {
  components: {
    BTabs,
    BTab,
    AccountSettingGeneral,
    AccountSettingPassword
    // AccountSettingInformation,
    // AccountSettingSocial,
    // AccountSettingNotification
  },
  data() {
    return {
      options: {}
    }
  }
}
</script>
