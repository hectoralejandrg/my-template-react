<template>
    <b-modal id="modalEvaluatePickup" title="Evaluar Retiro" modal-class="dialog-600" ok-title="Evaluar Retiro" @close="close" @ok="ok" ok-variant="warning" 
    ok-only no-close-on-esc no-close-on-backdrop >
        <div class="mb-1">
          <form-render v-show="!loading" :form.sync="form" :fields="fields" @send="onEvaluate" containerButtonsClass="col-sm-12" ref="formRenderPickup"></form-render>
        </div>
    </b-modal>
</template>
<script>

export default {
  name: 'modal-evaluate-pickup',
  props: ['currentPickup', 'send'],

  data () {
    return {
      fields: [],
      form: {},
      keyFormRender: 0,
      loading: true,
      optionsPickupsStatus: [
        { id: 1, text: 'El retiro fue efectuado', value: 'done'},
        { id: 2, text: 'El transportista se presentó o llamó, pero la carga no estaba lista', value: 'not_ready'},
        { id: 3, text: 'Transportista no se presentó', value: 'absence'},
        { id: 4, text: 'Otro', value: 'other'}
      ]
    }
  },

  watch:{
    currentPickup () {
      this.form = {
        ...this.currentPickup
      }
      this.keyFormRender++
    }
  },

  mounted() {
    this.setInitialData()
  },

  methods: {

    setInitialData () {

      this.fields = [
        {fieldType: 'FieldSelect', name: 'status_evaluate', label: 'Estado de Retiro', containerClass: 'col-sm-12 col-md-12 container-info', 
          validation: 'required', options: this.optionsPickupsStatus, change: this.addExtraFields }
      ]

      this.loading = false

    },

    onEvaluate (data) {
      const payload = {
        evaluation: {
          status: {
            code: data.status_evaluate.value,
            name: data.status_evaluate.text
          }
        },
        user: {
          first_name: this.$session.get('cas_user').name,
          last_name: this.$session.get('cas_user').lastname,
          email: this.$session.get('cas_user').email,
          role: this.$session.get('cas_user').role
        }
      }
      if (data.information) payload.evaluation.aditional_info = data.information
      this.$emit('send', payload)
    },

    ok (e) {
      e.preventDefault()
      this.$refs.formRenderPickup.checkForm()
    },

    close () {
      this.$emit('update:currentPickup', {})
    },

    addExtraFields (name, value) {
      const index = this.fields.findIndex(({name}) => name === 'information')
      if (index !== -1) {
        this.fields.splice(index, 1)
      }
      if (value.id === 4) {
        this.fields.splice(1, 0,
          {fieldType: 'FieldTextarea', name: 'information', label: 'Informacion adicional', containerClass: 'col-sm-12 container-info' }
        )
      }
    }
  }

}

</script>