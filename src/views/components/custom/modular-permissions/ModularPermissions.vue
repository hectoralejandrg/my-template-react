<template>
  <div>
    <b-button v-if="hasPermissions"
      id="modular-permissions" 
      v-b-tooltip.hover.left="$t('Configurar accesos')"
      @click="openModal"
      variant="warning">
      <feather-icon icon="SettingsIcon" size="15"/>
    </b-button>
    <modal-modular-permissions v-if="hasPermissions" :modularPermissions="modularPermissions"/>
  </div>
</template>
<script>
import ModalModularPermissions from './ModalModularPermissions'
import modularPermissions from './modularPermissions.js'
export default {
  name: 'modular-permissions',
  components: {ModalModularPermissions},
  data () {
    return {
      objPermissions: { users: {}, roles: {}, positions: {}},
      modularPermissions: {},
      hasPermissions: false
    }
  },
  computed: {
    currentModule () {
      // console.log(this.$route.name)
      return this.$route.name
    }
  },
  watch: {
    currentModule () {
      this.modularPermissions = modularPermissions[this.currentModule]
      this.hasPermissions = !!Object.keys((this.modularPermissions || {}))?.length
      this.getModularPermissions('roles')
      this.getModularPermissions('users')
      this.getModularPermissions('positions')
    },
    objPermissions: {
      handler () {
        let arrayPermissions = []
        const currentPermissions = {}
        Object.values(this.objPermissions).map(el => {
          arrayPermissions = arrayPermissions.concat(el)
        })
        arrayPermissions.map(el => {
          if (el.permissions && [this.$session.get('cas_user').email, this.$session.get('cas_user').role, this.$session.get('cas_user').position].includes(el.value)) {
            Object.keys(el.permissions).map(key => {
              currentPermissions[key] = el.permissions[key] || currentPermissions[key]
            })
          }
        })
        this.$store.commit('setModularPermissions', currentPermissions)
      }, deep: true
    }
  },
  methods: {
    openModal () {
      this.$bvModal.show('modalModularPermissions')
    },
    getModularPermissions(type) {
      this.$root.$data.db.collection('specialPermissions').doc(this.$route.name).collection(type)
        .onSnapshot(resp => {
          this.objPermissions[type] = resp.docs.map(doc => {
            return {
              id: doc.id,
              type_id: type,
              value: doc.id, 
              permissions : {...doc.data()}
            }
          })
        })
    }
  }
}
</script>
<style lang="scss">
  #modular-permissions {
    position: fixed;
    right: 0px;
    top: calc(50% - 40px);
    border-right-color: transparent !important;
    z-index: 1050;
    padding: 0px;
    width: 38px;
    height: 38px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
</style>