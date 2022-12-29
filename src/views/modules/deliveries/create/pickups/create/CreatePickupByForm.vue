<template>
    <div>
      <div class="row">
        <div class="col-sm-12">
          <form-render class="mb-2" :fields="fields" :key="keyFormRender" :form.sync="form" @send="savePickup" ref="formRenderPickup" :buttonSend="buttonSend" containerButtonsClass="col-sm-12 container-button">
            <template #breakForm><div class="border-top mb-2 mt-2"></div></template>
          </form-render>
        </div>
      </div>
    </div>
</template>
<script> 

import DeliveryService from '../../delivery.service'
import CreatePickupsService from '../createPickups.service'

export default {
  name: 'create-pickup-by-form',
  props: ['carriers', 'pickup', 'getPickups', 'warehouseOptions'],

  data () {
    return {
      fields: [],
      keyFormRender: 0,
      form: {},
      formFilter: {},
      validateFormInitial: [false, false],
      formFullPayload: {},
      warehouseOptions1: [
        { id: 1, text: 'Bodega 1', value: 'cod_bod' },
        { id: 2, text: 'Bodega 2', value: 'cod_bod' },
        { id: 3, text: 'Bodega 3', value: 'cod_bod' },
        { id: 4, text: 'Bodega 4', value: 'cod_bod' },
        { id: 5, text: 'Bodega 5', value: 'cod_bod' }
      ],
      editing: false,
      buttonSend: {color: 'warning', text: `${this.editing ? 'Modificar' : 'Crear'} retiro`, icon: 'PlusIcon', class: 'push-right' },
      rangeSchedule: [
        { id: 1, text: '9:00 - 12:00' },
        { id: 2, text: '12:00 - 15:00' },
        { id: 3, text: '15:00 - 18:00' },
        { id: 4, text: '18:00 - 21:00' }
      ],
      optionsPackageAverage: [
        { id: 'xs', text: 'Sobre'},
        { id: 's', text: 'Pequeño' },
        { id: 'm', text: 'Mediano' },
        { id: 'l', text: 'Grande' },
        { id: 'c', text: 'Más Grande' }
      ],
      deliveryService: new DeliveryService(this),
      createPickupsService: new CreatePickupsService(this)
    }
  },

  mounted () {
    this.setInitialData()
  },

  watch: {
    carriers () {
      this.fields[1].options = this.carriers
      this.keyFormRender++
      console.log(this.carriers)
    },
    
    pickup () {
      this.form = {...this.pickup}
    }

  },
  
  methods: {
    setInitialData () {
      this.fields = [
        { fieldType: 'FieldSelect', name: 'company', label: 'Empresa', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required' },
        { fieldType: 'FieldSelect', name: 'carrier', label: 'Carrier', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required'},
        { fieldType: 'FieldSelect', name: 'warehouse', label: 'Lugar de retiro / Bodega', containerClass: 'col-sm-12 container-info col-md-6', validation: 'required'},
        { fieldType: 'FieldInput', name: 'qty', label: 'Cantidad de envíos', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'weight', label: 'Peso (Kgs)', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
        { fieldType: 'FieldRadio', name: 'size', label: 'Volumen promedio', containerClass: 'col-sm-12 container-info', validation: 'required', align: 'h', 
          change: this.addExtraFields, options: this.optionsPackageAverage 
        },
        { name: 'breakForm', useSlot:true, containerClass: 'col-sm-12' },
        { fieldType: 'FieldDatepicker', label: 'Fecha de búsqueda', name: 'pickup_date', clearable: true, containerClass: 'col-sm-12 container-info col-md-6' },
        { fieldType: 'FieldSelect', name: 'range_time', label: 'Rango de retiro', containerClass: 'col-sm-12 container-info col-md-6', options: this.rangeSchedule },
        { fieldType: 'FieldInput', name: 'contact', label: 'Nombre de contacto', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required' },
        { fieldType: 'FieldInput', name: 'phone', label: 'Celular', containerClass: 'col-sm-12 col-md-6 container-info', validation: 'required' },
        { fieldType: 'FieldTextarea', name: 'information', label: 'Observaciones', containerClass: 'col-sm-12 container-info' }
      ]

      if (!['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.fields.splice(0, 1)
        this.setFieldProperties('carrier', 'options', this.carriers, 1)
        this.setFieldProperties('warehouse', 'options', this.warehouseOptions)
      } else {
        this.setFieldProperties('carrier', 'options', this.carriers)
        this.setFieldProperties('warehouse', 'options', this.warehouseOptions)
      }

      this.form.size = this.optionsPackageAverage[0]
      this.getShippers()
      this.keyFormRender++ 
    },

    checkInfo () {
      this.$refs.formRenderPickup.checkForm()
    },

    savePickup (data) {
      const payload = {
        company: {
          id: '620', 
          name: 'Empresa Prueba api', // data.company.name1,
          code: '620 - Empresa Prueba api' // data.company.text
        },
        // marketplace: {
        //   id: data.company.id,
        //   name: data.company.name1,
        //   code: data.company.text
        // },
        carrier_code: data.carrier.code,
        warehouse_code: data.warehouse.value,
        qty: data.qty,
        weight: data.weight,
        size: data.size.id,
        contact_name: data.contact,
        contact_phone: data.phone,
        range_time: data.range_time.text,
        pick_up_date: this.$options.filters.moment(data.pickup_date, 'YYYY-MM-DD'),
        information: data.information
      }
      const params = {shipper_id: 620 } 
      console.log(params)
      this.createPickupsService.callService('savePickup', payload, params)
        .then(resp => {
          console.log(resp)
          this.$bvModal.hide('modalPickups')
          this.getPickups()
        })
        .catch(err => {
          console.log(err)
          this.$alert('Este retiro no pudo ser guardado')
        })
      console.log(payload)
    },

    getShippers (value) {
      this.deliveryService.callService('getShippers', {paginate_by: 9999, page: 1 })
        .then(resp => {
          this.fields[0].options = resp.data.map(el => ({...el, text: `${el.id} - ${el.name1}`}))
          this.keyFormRender++
        })
    },

    addExtraFields (name, value) {
      const index = this.fields.findIndex(({name}) => name === 'height')
      if (index !== -1) {
        this.fields.splice(index, 3)
      }
      if (value.id === 'c') {
        this.fields.splice(5, 0, 
          { fieldType: 'FieldInput', name: 'height', label: 'Altura de paquete', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
          { fieldType: 'FieldInput', name: 'width', label: 'Ancho de paquete', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' },
          { fieldType: 'FieldInput', name: 'length', label: 'Largo de paquete', containerClass: 'col-sm-12 col-md-3 container-info', validation: 'required' }
        )
      }
      this.keyFormRender++
    },

    setFieldProperties (field, properties, content, indexToChange) {
      const index = this.fields.findIndex(({name}) => name === field)
      if (indexToChange) {
        const copyFieldToChange = this.fields[index]
        const copyFieldChanged = this.fields[indexToChange]
        this.fields.splice(indexToChange, 1, copyFieldToChange)
        this.fields.splice(index, 1, copyFieldChanged)
        this.fields[indexToChange][properties] = content
      }
      this.fields[index][properties] = content
    }
  } 
}
</script>