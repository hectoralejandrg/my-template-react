<template>
  <b-modal id="modalUser" :title="$t('Usuario')" modal-class="custom-dialog dialog-800" :ok-title="$t(`${editing ? 'Modificar' : 'Crear'} usuario`)" ok-variant="warning" 
  ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" :ok-disabled="loading">
    <form-render v-show="!loading" :form.sync="form" :fields="fields" @send="onAccept" containerButtonsClass="col-sm-12" ref="formRenderUser">
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
import { getTimeZones } from '@vvo/tzdb'
export default {
  name: 'modal-user',
  props: ['user', 'send', 'shippers', 'organizations'],
  data () {
    return {
      form: {},
      fields: [],
      editing: false,
      loading: true,
      keyFormRender: 0,
      optionsTimezone: getTimeZones().map(el => ({...el, id: el.name, text: el.currentTimeFormat})),
      optionsTypeFormats: [
        { id: 'dd-mm-yyyy', text: 'Día-Mes-Año' },
        { id: 'mm-dd-yyyy', text: 'Mes-Día-Año' },
        { id: 'yyyy-mm-dd', text: 'Año-Mes-Día' },
        { id: 'yyyy-dd-mm', text: 'Año-Día-Mes' }
      ],
      optionsUserPerform: [{id: 'executive', text: 'Ejecutivo'}]
    }
  },
  watch: {
    user () {
      this.form = {
        ...this.user,
        timezone: this.user.timezone ? this.optionsTimezone.filter(el => el.id === this.user.timezone)[0] : null,
        date_format: this.user.date_format ? this.optionsTypeFormats.filter(el => el.id === this.user.date_format)[0] : null,
        user_perform: this.user.user_perform ? this.optionsUserPerform.filter(el => el.id === this.user.user_perform)[0] : null,
        status: this.user.status ? [{id: true, text: 'Activo'}] : []
      }
      this.editing = !!this.user.id
      this.loading = false
      this.keyFormRender++
    },
    organizations () {
      const index = this.fields.findIndex(el => el.name === 'organization')
      this.fields[index].options = this.organizations
      this.loading = false
    }
  },
  mounted () {
    console.log(this.optionsTimezone)
    this.fields = [
      {fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
      {fieldType: 'FieldInput', name: 'lastname', label: 'Apellido', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
      {fieldType: 'FieldInput', type: 'email', name: 'email', label: 'E-mail', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'email|required'},
      {fieldType: 'FieldSelect', name: 'organization', label: 'Organización', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: this.organizations},
      {fieldType: 'FieldSelect', name: 'user_perform', label: 'Función de usuario', containerClass: 'col-sm-12 col-md-6 container-info', options: this.optionsUserPerform},
      // {fieldType: 'FieldSelect', name: 'role', label: 'Rol', clearable: false, containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required'},
      {fieldType: 'FieldSelect', name: 'date_format', label: 'Formato fecha', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: this.optionsTypeFormats},
      {fieldType: 'FieldSelect', name: 'timezone', label: 'Zona horaria', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required', options: this.optionsTimezone},
      {fieldType: 'FieldCheckbox', multiple: true, name: 'status', containerClass: 'col-sm-12 col-md-6 container-info mt-2', options: [{id: true, text: 'Activo'}]}
    ]
    // this.getMasterRoles()
  },
  methods: {
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderUser.checkForm()
    },
    close () {
      this.$emit('update:user', {})
    },
    onAccept (data) {
      this.loading = true
      // this.savePermissions()
      const form = {
        name: data.name,
        lastname: data.lastname,
        email: data.email.toLowerCase(),
        timezone: data.timezone?.id || '',
        date_format: data.date_format?.id || '',
        // role: data?.role?.id || '',
        organization: !!data.organization ? {...data.organization} : {},
        user_perform: data.user_perform?.id || '',
        status: !!(data.status && data.status.length === 1),
        fullName: `${data.name} ${data.lastname}`
      }
      this.$emit('send', { form, id: this.editing ? this.user.id : null, original: data})
    },
    savePermissions () {
      this.$root.$data.accountsCollection.doc(this.form.id).update({role: this.form.role})
        .then(resp => {
          this.$success(this.$t('El rol se ha actualizado correctamente'))
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-guardar', {code: err}))
        })
    },
    getMasterRoles () {
      this.$root.$data.db.collection('masterRoles')
        .onSnapshot(resp => {
          this.optionsRoles = []
          resp.docs.map(el => {
            this.optionsRoles.push({id: el.id, text: this.$options.filters.title(el.id), value: el.data()})
          })
          const index = this.fields.findIndex(({name}) => name === 'role')
          this.fields[index].options = this.optionsRoles
          this.keyFormRender++
        })
    }
  }
}
</script>
<style lang="scss">
  
</style>