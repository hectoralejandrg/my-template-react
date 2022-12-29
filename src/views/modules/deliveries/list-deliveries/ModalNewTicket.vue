<template>
  <b-modal id="modalNewTicket" :title="$t('Nuevo ticket')" modal-class="custom-dialog dialog-800" :ok-title="$t(`Crear ticket`)" ok-variant="warning" 
  ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" :ok-disabled="loading">
    <form-render v-show="!loading" :form.sync="form" :fields="fields" @send="onAccept" :key="keyFormRender" containerButtonsClass="col-sm-12" ref="formRenderNewTicket">
    </form-render>
    <div v-show="loading">
      <b-skeleton width="30%"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input" height="100px"/>
    </div>
  </b-modal>
</template>
<script>
import { DateTime } from 'luxon'
import DeliveriesListService from './deliveriesList.service.js'
export default {
  name: 'modal-new-ticket',
  props: ['delivery'],
  data () {
    return {
      form: {},
      fields: [],
      fieldExtraInfo: {fieldType: 'FieldTextarea', name: 'information', label: 'Información adicional', containerClass: 'col-sm-12 container-info', validation: 'required'},
      editing: false,
      loading: true,
      keyFormRender: 0,
      deliveriesListService: new DeliveriesListService(this)
    }
  },
  watch: {
    delivery () {
      this.loading = true
      this.form = {}
      this.fields = [
        {fieldType: 'FieldSelect', name: 'ticket_type', label: 'Tipo de ticket', containerClass: 'col-sm-12 container-info', validation: 'required', change: this.addExtraFields, clearable: false},
        {...this.fieldExtraInfo}
      ]
      if (this.delivery?.id) this.getTicketTypesByDelivery()
    }
  },
  mounted () {
    this.fields = [
      {fieldType: 'FieldSelect', name: 'ticket_type', label: 'Tipo de ticket', containerClass: 'col-sm-12 container-info', validation: 'required', change: this.addExtraFields, clearable: false},
      {...this.fieldExtraInfo}
    ]
  },
  methods: {
    getTicketTypesByDelivery () {
      //this.$options.filters.dbDateToFormat(this.delivery.order.status.date, 'D T')
      this.deliveriesListService.callService('getTicketTypesByDelivery', {date: this.delivery.order.status.date }, {code: this.delivery.order.status.status_code})
      // this.deliveriesListService.callService('getTicketTypesByDelivery', {date: '2021-09-09 00:00:00'}, {code: 'NOT_DELIVERED'})
        .then(resp => {
          if (resp.data.length === 0) {
            this.fields[0].options = []
            this.$alert(this.$t('msg-unable-open-ticket'))
            this.$bvModal.hide('modalNewTicket')
            this.$emit('update:delivery', {})
          } else {
            this.fields[0].options = resp.data.map(el => ({text: el.name, ...el}))
          }
          this.keyFormRender++
          this.loading = false
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-cargar-datos', {code: err}))
          // this.$emit('update:delivery', {})
        })
    },
    addExtraFields (name, value) {
      this.fields = this.fields.slice(0, 1)
      if (value.extra_fields) {
        value.extra_fields.map(field => {
          if (['full_address', 'phone'].includes(field.name)) {
            this.fields.push({...field, fieldType: 'FieldInput',  containerClass: 'col-sm-12 container-info', type: 'text'})
          } else if (['complement'].includes(field.name)) {
            this.fields.push({...field, fieldType: 'FieldTextarea',  containerClass: 'col-sm-12 container-info'})
          } else if (['place'].includes(field.name)) {
            this.fields.push({fieldType: 'FieldSelect', label: 'Place_level1', name: 'level1', containerClass: 'col-sm-12 container-info'})
            this.fields.push({...field, fieldType: 'FieldSelect',  containerClass: 'col-sm-12 container-info', dependency: 'level1'})
            this.loadOptionsField(field.name, this.fields.length - 1)
          }
        })
      }
      if (this.delivery?.order?.status?.code === 'RETRY' || !value.extra_fields) this.fields.push(this.fieldExtraInfo)
      this.keyFormRender++
    },
    loadOptionsField (name, index) {
      this.deliveriesListService.callService(`${name}Options`)
        .then(resp => {
          this.fields[index].options = resp.data
        })
    },
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderNewTicket.checkForm()
    },
    close () {
      this.$emit('update:delivery', {})
    },
    calculateTotals (list, element) {
      let total = 0
      list.map(el => {
        total += el[element]
      })
      return total
    },
    onAccept (data) {
      // this.loading = true
      const form = {
        ...data,
        delivery: {
          id: this.delivery.id,
          imported_id: this.delivery.imported_id,
          tracking_number: this.delivery.tracking_number,
          created_at: this.delivery.created_at,
          n_packages: this.delivery.qty,
          volume: this.calculateTotals(this.delivery.order.packages, 'volume'),
          weight: this.calculateTotals(this.delivery.order.packages, 'weight'),
          price: this.calculateTotals(this.delivery.order.packages, 'price'),
          origin: {
            full_address: this.delivery.origin.address.full_address,
            place_id: this.delivery.origin.address.place_id, //falta
            place_name: this.delivery.origin.address.level3
          },
          destination: {
            full_address: this.delivery.destination.address.full_address,
            place_id: this.delivery.destination.address.place_id, //falta
            place_name: this.delivery.destination.address.level3
          },
          customer: {
            email: this.delivery.destination.contact.email,
            name: this.delivery.destination.contact.name,
            phone: this.delivery.destination.contact.phone
          }
        },
        current_delivery_status: this.delivery.order.status,
        carrier: this.delivery.carrier,
        account: {},
        company: {...this.delivery.shipper},
        creator: {
          first_name: this.$session.get('cas_user').name,
          last_name: this.$session.get('cas_user').lastname,
          email: this.$session.get('cas_user').email,
          role: this.$session.get('cas_user').role
        },
        current_type: {...data.ticket_type},
        message: ''
      }
      console.log(form, this.delivery)

      // this.$emit('send', { form })
    }
  }
}
</script>
<style lang="scss">
  
</style>