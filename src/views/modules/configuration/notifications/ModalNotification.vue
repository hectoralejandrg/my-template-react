<template>
  <div class="rule-dialog">
    <b-modal id="modalNewNotification" :ok-title="$t(acceptText)" size="lg" :title="$t('Notificación')" ok-variant="warning" 
      ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" :ok-disabled="loading">
      <form-render :form.sync="form" :fields="fields" @send="updateOrCreate" ref="formRenderNewNotification"/>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: 'modal-notification',
  props: ['data'],
  data () {
    return {
      content: '',
      acceptText: 'Crear',
      title: '',
      form: {},
      company: {},
      today : new Date(),
      fields: [],
      loading: false
    }
  },
  watch: {
    data () { 
      this.acceptText = !!this.data.id ? 'Guardar' : 'Crear'
      this.form = {
        ...this.data
      }
    }
  },
  mounted () {
    this.fields = [
      { fieldType: 'FieldInput', label: 'Título', name: 'title', containerClass: 'container-info col-sm-12', validation: 'required'},
      { fieldType: 'FieldRTE', label: 'Contenido', name: 'content', containerClass: 'container-info col-sm-12', validation: 'required'}
      // { fieldType: 'FieldCheckbox', multiple: true, name: 'active', containerClass: 'container-info col-sm-12 mt-5', options: [{id: true, text: 'Activo'}]}
    ]
  },
  methods: {
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderNewNotification.checkForm()
    },
    close () {
      this.$emit('update:data', {})
    },
    updateOrCreate (myForm) {
      this.loading = true
      const payload = {title: myForm.title, content:myForm.content, created: new Date().getTime()}
      if (!this.data.id) {
        this.$root.$data.notificationsCollection.doc(this.data.id).set(payload)
          .then(resp => {
            this.form = {}
            this.$emit('update:data', {})
            this.$bvModal.hide('modalNewNotification')
            this.loading = false
          })
          .catch(err => {
            this.$alert(this.$t('msg-problema-guardar', {code: err}))
            this.loading = false
          })
      } else {
        this.$root.$data.notificationsCollection.doc(this.data.id).update(payload)
          .then(resp => {
            this.$bvModal.hide('modalNewNotification')
            this.form = {}
            this.loading = false
          })
          .catch(err => {
            this.$alert(this.$t('msg-problema-guardar', {code: err}))
            this.loading = false
          })
      }
    }
  }
}
</script>


<style lang="scss">
.label-bold {
  font-size: 12px;
}
.contenedor-searchable {
  .is-criteria {
    margin-top: 5px;
    margin-left: 5px;
    font-size: 10px;
    font-weight: 600;
  }
  .vs-checkbox {
    width: 12px;
    height: 12px;
  }
}
</style>
<style scoped lang="scss">
.tip {
  /*border-left: 4px solid #3ebc6d;*/
  background: #cfcbf9;
  color: #5247c7;
  padding:3px 5px;
  width:380px;
  text-align: center;
  margin:auto;
  margin-top: 20px;
}
.rule-dialog {
  .vs-dialog {
    height: 1900px;
  }
}
kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
  line-height: 10px;
  color: #1708ad;
  vertical-align: middle;
  background-color: #d2cef9;
  border: 1px solid #594ee9;
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 #d1d5da;
}
/*.vs-dialog-cancel-button {*/
/*  display: none !important;*/
/*}*/
.boton {
  margin:auto;
  margin-top: 20px;
}
.btn-remove {
  cursor: pointer;
  background: #ccc !important;
  &:hover {
    background: #ea5455 !important;
  }
}
</style>