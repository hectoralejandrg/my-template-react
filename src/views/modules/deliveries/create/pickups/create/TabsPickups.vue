<template>
  <div>
    <b-tabs align="left" class="tab-primary" v-model="tabIndex" justified>
      <b-tab>
        <template #title>
          <div class="tab-title">
            <feather-icon icon="SendIcon" />
            <span> {{$t('Retiros')}} </span>
          </div>
        </template>
        <list-pickups></list-pickups>
      </b-tab>
      <b-tab>
        <template #title>
          <div>
            <feather-icon icon="FileTextIcon" />
            <span> {{$t('Crear por formulario')}} </span>
          </div>
        </template>
        <create-pickup-by-form :carriers="carriers"></create-pickup-by-form>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>

import ListPickups from './ListPickups.vue'
import CreatePickupByForm from './CreatePickupByForm.vue'

export default {
  name:'tabs-pickups',
  components: {ListPickups, CreatePickupByForm},
  props: ['carriers'],

  data () {
    return {
      tabIndex: 0
    }
  },

  mounted () {

  },

  methods: {
    
  }
}
</script>

<style lang="scss">
</style>
