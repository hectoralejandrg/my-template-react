<template>
  <b-modal id="modalFolder" :ok-title="$t(`${editing ? 'Modificar' : 'Crear'} folder`)" ok-variant="warning"
  ok-only no-close-on-esc no-close-on-backdrop centered @ok="ok" 
  :title="title" > <!-- :ok-disabled="!loading" -->
    <form-render :form.sync="folder" :fields.sync="fields" @send="onAccept" 
      containerButtonsClass="col-sm-12" 
      ref="formRenderFolder" :key="keyFormRender">
    </form-render>
  </b-modal>
</template>
<script>

import { mapGetters } from 'vuex'
export default {
  name: 'modal-folder',
  props: ['form', 'title'],

  data () {
    return {
      folder: {},
      editing: false,
      loading: true,
      keyFormRender: 0
    }
  },

  computed: {
    ...mapGetters({
      organizations: 'getOrganizationsGlobal'
    })
  },

  watch: {
    form () {
      this.folder = {
        ...this.form
      }
      this.editing = !!this.form.id
      if (this.editing) {
        const listOrganizations = this.organizations.rows.map(el => ({...el, text: el.name}))
        this.folder.organization = listOrganizations.filter(({id}) => this.form.organization.id === id)[0]
      }
    }
  },

  mounted () {
    this.setOrganizations()
  },

  setup () {
    let fields = []
    fields = [
      {fieldType: 'FieldInput', name: 'name', label: 'Nombre de folder', containerClass: 'col-sm-12 container-info', validation: 'required'},
      {fieldType: 'FieldInput', name: 'code', label: 'Código de folder', containerClass: 'col-sm-12 container-info', validation: 'required'},
      {fieldType: 'FieldSelect', name: 'organization', label: 'Organización', containerClass: 'col-sm-12 container-info', multiple: false, validation: 'required'}
    ]
    return { fields }
  },

  methods: {

    ok (e) {
      e.preventDefault()
      this.$refs.formRenderFolder.checkForm()
    },

    setOrganizations() {
      const indexOrganizations = this.fields.findIndex(({name}) => name === 'organization')
      if (indexOrganizations !== -1) this.fields[indexOrganizations].options = this.organizations
    },

    onAccept (form) {
      const folder = {
        name: form.name,
        code: form.code,
        organization_id: form.organization.id //map(({id}) => id)
      }
      const data = {
        name: this.form?.id ? 'updateFolder' : 'saveFolder',
        queryParams: {...folder},
        params:  { folder_id: this.form?.id },
        reload: 'getFolders'
      }
      this.$store.dispatch('fetchService', data)
    }
  }
}
</script>