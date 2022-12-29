<template>
  <div>
    <div v-show="tabIndex === 0">
      <b-button variant="warning" class="mr-1 push-right"><feather-icon icon="ArchiveIcon" class="mr-1" />Cambiar estado</b-button>
    </div>
    <div v-show="tabIndex === 1 && statusAllowEditDelivery">
      <b-button variant="flat-warning" class="mr-1 push-right" @click="ifEditForm"><feather-icon icon="EditIcon"/></b-button> <!-- :disabled="statusAllowEditDelivery" -->
    </div>
    <div v-if="currentDelivery.booleanNewTicket && tabIndex === 2">
      <b-button variant="warning" class="mr-1 push-right"><feather-icon icon="ArchiveIcon" class="mr-1" />Abrir tickets</b-button>
    </div>
    <b-tabs align="left" class="tab-primary" v-model="tabIndex">
      <b-tab>
        <template #title>
          <div class="tab-title">
            <span> {{$t('Historial de estados')}} </span>
          </div>
        </template>
        <history-status :statusTrackings.sync="statusTrackings"></history-status>
      </b-tab>
      <b-tab>
        <template #title>
          <div class="tab-title">
            <span> {{$t('Info del envío')}} </span>
          </div>
        </template>
        <create-delivery :allowEditForm.sync="allowEditForm" :currentDelivery.sync="currentDelivery"></create-delivery>
      </b-tab> 
      <b-tab v-if="currentDelivery.booleanNewTicket">
        <template #title>
          <div class="tab-title">
            <span> {{$t('Tickets')}} </span>
          </div>
        </template>
        <tickets></tickets>
      </b-tab>
      <b-tab>
        <template #title>
          <div class="tab-title">
            <span> {{$t('Avanzado')}} </span>
          </div>
        </template>
        <advance></advance>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CreateDelivery from '../../create/new-delivery/CreateDelivery.vue'
import DeliveryInfo from './tabs/DeliveryInfo.vue'
import Advance from './tabs/Advance.vue'
import HistoryStatus from './tabs/HistoryStatus.vue'
import Tickets from './tabs/Tickets.vue'

export default {
  name: 'tabs',
  components: { Advance, HistoryStatus, Tickets, CreateDelivery },
  props: ['currentDelivery', 'statusTrackings', 'countries', 'organizations', 'statusAllowEditDelivery'],

  data () {
    return {
      tabIndex: 0,
      allowEditForm: true
    }
  },

  methods: {
    ifEditForm () {
      (!this.allowEditForm) ? this.allowEditForm = true : this.allowEditForm = false
      console.log(this.currentDelivery)
    }
  }

}
</script>