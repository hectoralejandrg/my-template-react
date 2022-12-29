<template>
  <div>
    <b-card>
      <!-- <div class="permission-tracking-button">
        <modular-permissions modalClass="dialog-800" module="tracking"/>
      </div> -->
      <pre></pre>
      <div v-if="!Object.keys(modularPermissions).length || modularPermissions.add">
        <div class="tracking-button-0">
          <b-button variant="warning" class="push-right" @click="() => openModal('modalStatusLocal')" :disabled="loading"><feather-icon icon="PlusIcon"/> Crear estado envíame</b-button>
        </div>
        <div class="tracking-button-1 hidden">
          <b-button variant="warning" class="push-right" @click="() => openModal('modalStatusCarrier')" :disabled="loading"><feather-icon icon="PlusIcon"/> Crear estado carrier</b-button>
        </div>
        <div class="tracking-button-2 hidden">
          <b-button variant="warning" class="push-right" @click="() => openModal('modalTranslation')" :disabled="loading"><feather-icon icon="PlusIcon"/> Crear traducción</b-button>
        </div>
      </div>

      <b-tabs align="left" class="tab-primary" v-model="tabIndex">
        <b-tab>
          <template #title>
            <div>
              <feather-icon icon="MapPinIcon"/>
              <span> {{$t('Estados Envíame')}}</span>
            </div>
          </template>
          <crud-status-local></crud-status-local>
        </b-tab>
        <b-tab>
          <template #title>
            <div>
              <feather-icon icon="TruckIcon"/>
              <span> {{$t('Estados carriers')}}</span>
            </div>
          </template>
          <crud-status-carrier :carriers="listCarriers"></crud-status-carrier>
        </b-tab>
        <b-tab >
          <template #title>
            <div>
              <feather-icon icon="RepeatIcon"/>
              <span> {{$t('Traducciones estados')}}</span>
            </div>
          </template>
          <crud-translation :carriers="listCarriers"></crud-translation>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CrudStatusLocal from './CrudStatusLocal.vue'
import CrudStatusCarrier from './CrudStatusCarrier.vue'
import CrudTranslation from './CrudTranslation.vue'
import TrackingService from './tracking.service'

export default {
  components: { CrudStatusLocal, CrudStatusCarrier, CrudTranslation },
  name: 'config-tracking',
  data () {
    return {
      tabIndex: 0,
      form: {},
      buttonCreateText: 'estado envíame',
      translation: {},
      listCarriers: [],
      loading: true,
      modalName: 'modalStatusLocal',
      isAdmin: false,
      listUsers: [],
      trackingService: new TrackingService(this),
      myPermissions: null
    }
  },

  computed: {
    ...mapGetters({
      mySession: 'getSession',
      modularPermissions: 'getModularPermissions'
    })
  },

  watch: {
    tabIndex (curr, prev) {
      this.changeTab(this.tabIndex)
      this.$animateCSS(`.tracking-button-${prev}`, 'backOutRight', 'fast')
      this.$animateCSS(`.tracking-button-${curr}`, 'backInDown', 'faster')
    },
    paginationTranslations (page) {
      this.getAllTranslations()
    },
    mySession () {
      if (this.mySession.id) this.setInitialData()
    },
    myPermissions (curr) {
      console.log(curr)
    }
  },
  
  mounted () {
    if (this.mySession.id) this.setInitialData()
  },
  methods: {
    openModal (curr) {
      this.changeTab(curr)
      this.$bvModal.show(this.modalName)
    },
    changeTab (curr) {
      this.modalName = curr
      switch (curr) {
      case 'modalStatusLocal':
        this.buttonCreateText = 'estado envíame'
        break
      case 'modalStatusCarrier':
        this.buttonCreateText = 'estado carrier'
        break
      case 'modalTranslation':
        this.buttonCreateText = 'traducción'
        break
      }
    },
    setInitialData () {
      this.getAllStatus()
      // this.fbUsersTrackingPermission()
      this.isAdmin = ['superadmin'].includes(this.$session.get('cas_user').role)
    },
    // fbUsersTrackingPermission () {
    //   this.listUsers = []
    //   this.$root.$data.db.collection('specialPermissions').doc('tracking').collection('users')
    //     .onSnapshot(resp => {
    //       this.myPermissions = resp.docs.find(doc => doc.id === this.$session.get('cas_user').email)?.data()
    //       this.$store.commit('setModularPermissions', this.myPermissions)
    //     })
    // },

    addUsersPermissions (data) {
      this.$root.$data.db.collection('specialPermissions').doc('tracking').collection('users').doc(`${data.email}`).set(data.permissions)
        .then(resp => {
          this.$refs.modalPermissionTracking.form = {}
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    },
    getAllStatus () {
      const services = [
        {name: 'getCarriers'}
      ]
      this.trackingService.callMultipleServices(services, true)
        .then(response => {
          this.setDataCarriers(response.getCarriers)
        })
        .catch(err => {
          console.error(err)
        })
        .finally(end => {
          this.loading = false
        })
    },
    setDataCarriers (data) {
      this.listCarriers = data.data.map(carrier => ({...carrier, text: carrier.name}))
    }
  }
}
</script>
<style lang="scss">
div[class^="tracking-button"] {
  top: 2rem !important;
  right: 2rem !important;
  position: absolute !important;
  z-index: 9;
}

.permission-tracking-button {
  top: 2rem !important;
  right: 17rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>
