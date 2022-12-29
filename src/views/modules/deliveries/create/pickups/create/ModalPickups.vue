<template>
    <b-modal id="modalPickups" :title="$t('Retiros')" modal-class="dialog-1200" ok-variant="warning" ok-only no-close-on-esc no-close-on-backdrop hide-footer >
        <create-pickup-by-form :carriers="carriers" :pickup.sync="pickup" :getPickups="getPickups" :warehouseOptions="warehouseOptions"></create-pickup-by-form>
        <!-- <tabs-pickups :carriers="carriers"></tabs-pickups> -->
    </b-modal>
</template>
<script>
import TabsPickups from './TabsPickups.vue'
import CreatePickupByForm from './CreatePickupByForm.vue'
import CreatePickupsService from '../createPickups.service'

export default {
  components: { CreatePickupByForm},
  name: 'modal-pickups',
  props: ['carriers', 'pickup', 'getPickups'],

  data() {
    return {
      warehouseOptions: [],
      createPickupsService: new CreatePickupsService(this)
    }
  },

  mounted () {
    this.getWarehouse()
  },

  methods: {
    getWarehouse () {
      if (this.$session.get('cas_user').shipper && this.$session.get('cas_user').shipper.id) {
        const params = { 
          shipper_id: this.$session.get('cas_user').shipper.id
        }
        const payload = {
          type: 'warehouse',
          paginate_by: 9999,
          page: 1
        }
        this.createPickupsService.callService('getWarehouse', payload, params)
          .then(resp => {
            this.warehouseOptions = []
            this.setWarehouseOptions(resp.data)
          })
          .catch(err => {
            console.log(err)
            this.$alert('Ocurrio un problema al obtener las bodegas')
          })
      } else {
        return this.$alert('Este usuario no tiene compañía asignada')
      }
    },

    setWarehouseOptions (data) {
      this.warehouseOptions = data.map(el => ({...el, text: el.name}))
    }
  }
}
</script>