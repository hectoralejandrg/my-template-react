<template>
  <b-modal id="modalStatusLocal" :title="$t('Estado envíame')" modal-class="dialog-800" :ok-title="$t(`${editing ? 'Modificar' : 'Crear'} estado`)" ok-variant="warning" 
  ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" :ok-disabled="loading">
    <form-render v-show="!loading" :form.sync="form" :fields="fields" @send="onAccept" ref="formRenderStatusLocal">
    </form-render>
    <div v-show="loading">
      <b-skeleton width="30%"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-2"/>
      <b-skeleton width="40%"/>
      <b-skeleton width="40%"/>
      <b-skeleton width="40%"/>
      <b-skeleton width="40%"/>
      <b-skeleton width="40%"/>
      <b-skeleton width="40%"/>
      <b-skeleton width="40%"/>
      <b-skeleton width="40%"/>
      <b-skeleton width="40%"/>
    </div>
  </b-modal>
</template>
<script>
export default {
  name: 'modal-status-local',
  props: ['status', 'send'],
  data () {
    return {
      form: {},
      fields: [],
      editing: false,
      loading: true,
      keyFormRender: 0,
      optionsTruefalse: [
        {id: 'default', text: 'Valor por defecto'},
        {id: 'terminal', text: 'Terminal'},
        {id: 'visible', text: 'Visible'},
        {id: 'in_carrier', text: 'In carrier'},
        {id: 'pudo', text: 'Pudo'},
        {id: 'home', text: 'Home'},
        {id: 'trouble', text: 'Trouble'},
        {id: 'can_edit', text: 'Editable'},
        {id: 'show_in_public_view', text: 'Mostrar en vistas publicas'},
        {id: 'show_to_sellers', text: 'Mostrar a los sellers'},
        {id: 'show_comments_in_public_view', text: 'Mostrar comentarios en vistas públicas'},
        {id: 'show_comments_to_sellers', text: 'Mostrar comentarios a sellers'},
        {id: 'repeat_to_non_admins', text: 'Repetir a no-administradores'}
      ],
      colors: [
        { id: 'primary', color: 'primary', text: 'Informativo. No requieren atención inmediata' },
        { id: 'success', color: 'success', text: 'Terminado o en proceso de terminar. Ya no se requiere atención al proceso' },
        // { id: 'warning', color: 'warning', text: 'Color warning' },
        { id: 'danger', color: 'danger', text: 'Terminado con incidencia. El se encontró con un problema terminal o que requiere atención inmediata.' },
        { id: 'dark', color: 'dark', text: 'Otros' }
      ]
    }
  },
  watch: {
    status () {
      this.form = {
        ...this.status,
        truefalse: this.optionsTruefalse.filter(opt => this.status[opt.id] === true)
      }
      this.editing = !!this.status.id
      this.loading = false
      this.keyFormRender++
    }
  },
  mounted () {
    this.fields = [
      {fieldType: 'FieldInput', name: 'code', label: 'Estado', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required'},
      {fieldType: 'FieldInput', name: 'name', label: 'Nombre', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required'},
      {fieldType: 'FieldInput', name: 'return_name', label: 'Nombre devolución', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required'},
      {fieldType: 'FieldInput', name: 'flow_action', label: 'Acción de flujo', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required'},
      {fieldType: 'FieldTextarea', name: 'observations', label: 'Observación', maxLength: 450, containerClass: 'col-sm-12 container-info'},
      // {fieldType: 'FieldInput', name: 'flow_type', label: 'Tipo de flujo', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required'},
      {fieldType: 'FieldCheckbox', multiple: true, name: 'truefalse', label: 'Opciones adicionales', containerClass: 'col-sm-12 container-info marker', align: 'v', options: this.optionsTruefalse}
      // ,
      // {fieldType: 'FieldRadio', name: 'color', label: 'Identificador visual', containerClass: 'col-sm-12 container-info marker', align: 'v', options: this.colors, validation: 'required'}
    ]
    this.loading = false
  },
  methods: {
    ok (e) {
      console.log('crar')
      e.preventDefault()
      this.$refs.formRenderStatusLocal.checkForm()
    },
    close () {
      this.$emit('update:status', {})
    },
    onAccept (data) {
      console.log(data)
      this.loading = true
      const form = {
        code: data.code,
        name: data.name,
        flow_action: data.flow_action,
        observations: data.observations || '',
        return_name: data.return_name || '',
        flow_type: data.flow_type || 'all'
      }
      this.optionsTruefalse.map(({id}) => {
        form[id] = data.truefalse.findIndex(el => el.id === id) !== -1
      })
      this.$emit('send', { form, id: this.editing ? this.status.id : null, original: data})    
    }
  }
}
</script>
<style lang="scss">
  
</style>