<template>
  <b-modal id="modal-active-account" :title="'Coincidencia de servicio'" :ok-title="$t('Confirmar')"
    ok-variant="warning" modal-class="modal-warning" ok-only centered @ok="ok">
    <h2 class="text-lg-center" >Advertencia</h2>
    <div class="d-flex align-items-center justify-content-center mb-2">
      <feather-icon
          icon="StarIcon"
          size="80"
        />
    </div>
    <b-card-text>
    Se ha detectado una coindicencia en las condiciones de la cuenta que desea activar.
    Seleccione que cuenta tendrá prioridad <b class="text-danger">*</b>
    </b-card-text>
    <b-card-text class="text-danger">
    *La coincidencia quedará inhabilitada temporalmente hasta que se desactive la cuenta con coincidencia.
    </b-card-text>
    <form-render class="mb-2" :fields="fields" :key="formRenderAccount" :form.sync="form" @send="onAccept"
      ref="formRenderAccount" containerButtonsClass="col-sm-12 col-md-3 container-button">
    </form-render>
  </b-modal>
</template>

<script>
export default {
  name: 'modal-active-account',
  data() {
    return {
      form: {},
      fields: [],
      formRenderAccount: 0
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {
    this.setInitialData()
  },
  methods: {
    setInitialData() {
      this.fields = [
        { fieldType: 'FieldSelect', name: 'account_active', containerClass: 'col-sm-12 col-md-6 container-info', placeholder : 'Elige una cuenta'}
      ]

      this.fields[0].options = [
        {
          id : 1,
          value: null,
          text: 'Pruebaaa xD'
        },
        {
          id : 2,
          value: '1',
          text: 'Cuenta 1'
        },
        {
          id : 3,
          value: '2',
          text: 'Cuenta 2'
        },
        {
          id : 4,
          value: '3',
          text: 'Cuenta 3'
        }
      ]
      this.formRenderAccount++
    },
    ok(e) {
      e.preventDefault()
      this.$refs.formRenderAccount.checkForm()
    },
    onAccept(form) {
      // console.log('Nada aun pendejo :v')
    }
  }
}
</script>

<style>
</style>
