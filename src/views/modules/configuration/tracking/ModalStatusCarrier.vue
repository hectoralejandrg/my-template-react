<template>
  <b-modal id="modalStatusCarrier" :title="$t('Estado carrier')" :ok-title="$t(`${editing ? 'Modificar' : 'Crear'} estado`)" ok-variant="warning" 
  ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" :ok-disabled="loading">
    <form-render v-show="!loading" :form.sync="form" :fields="fields" @send="onAccept" containerButtonsClass="col-sm-12" ref="formRenderStatusCarrier">
    </form-render>
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
  name: 'modal-status-carrier',
  props: ['status', 'send', 'carriers'],
  data () {
    return {
      form: {},
      fields: [],
      editing: false,
      loading: true,
      keyFormRender: 0
    }
  },
  watch: {
    status () {
      this.form = {
        ...this.status,
        customization: this.status.customization ? JSON.stringify(this.status.customization) : '',
        carrier: this.carriers.filter(({id}) => id === this.status.carrier_id)[0]
      }
      this.editing = !!this.status.id
      this.keyFormRender++
    },
    carriers () {
      this.fields[0].options = this.carriers
      this.loading = false
    }
  },
  mounted () {
    this.fields = [
      {fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier', containerClass: 'col-sm-12 container-info', validation: 'required'},
      {fieldType: 'FieldInput', name: 'code', label: 'Código estado', containerClass: 'col-sm-12 container-info', validation: 'required'},
      {fieldType: 'FieldTextarea', name: 'customization', label: 'Customización', containerClass: 'col-sm-12 container-info'}
    ]
  },
  methods: {
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderStatusCarrier.checkForm()
    },
    close () {
      this.$emit('update:status', {})
    },
    validateJSON (text) {
      try {
        const myJSON = JSON.parse(text)
        return !!myJSON
      } catch (err) {
        console.error(err)
        this.$alert(this.$t('msg-customization-json'))
        return false
      }
    },
    onAccept (data) {
      const custom = data.customization ? this.validateJSON(data.customization) : true
      this.loading = custom
      if (custom) {
        const form = {
          carrier_id: data.carrier.id,
          code: data.code,
          customization: data.customization || null
        }
        this.$emit('send', { form, id: this.editing ? this.status.id : null, original: data})
      }
    }
  }
}
</script>
<style lang="scss">
  
</style>