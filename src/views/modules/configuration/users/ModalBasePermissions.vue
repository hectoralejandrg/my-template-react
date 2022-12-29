<template lang="">
  <b-modal id="modalBasePermissions" :title="$t('Base permisos')" modal-class="custom-dialog dialog-800" :ok-title="$t(`Guardar`)" ok-variant="warning" 
  :ok-disabled="loading" no-close-on-esc no-close-on-backdrop centered @ok="ok" >
    <b-form-textarea id="jsonBasePermissions" @input="prettyPrint" v-model="value" cols="20" rows="30"></b-form-textarea>
    <div v-show="loading">
      <b-skeleton width="30%"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
    </div>
  </b-modal>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      value: ''
    }
  },
  mounted () {
    this.$root.$data.resourcesPermissionsCollection.doc('default')
      .onSnapshot(resp => {
        this.value = JSON.stringify(resp.data(), undefined, 4)
      })
  },
  methods: {
    prettyPrint() {
      // const ugly = document.getElementById('jsonBasePermissions').value
      // const obj = JSON.parse(ugly)
      // const pretty = JSON.stringify(obj, undefined, 4)
      // document.getElementById('jsonBasePermissions').value = pretty
    }, 
    ok (e) {
      e.preventDefault()
      if (this.$isJson(this.value)) {
        this.$root.$data.resourcesPermissionsCollection.doc('default').set(JSON.parse(this.value))
          .then(resp => {
            this.$bvModal.hide('modalBasePermissions')
          })
      } else {
        this.$alert('El texto no pudo ser guardado como JSON')
      }
    }
  }
}
</script>
<style lang="">
  
</style>