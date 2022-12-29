<template>
  <div>
    <b-card>
      <generic-addresses/>
    </b-card>
  </div>
</template>
<script>
import GenericAddresses from '@/views/components/custom/generic-addresses/GenericAddresses.vue'
export default {
  name: 'addresses',
  components: { GenericAddresses },
  data () {
    return {}
  }
}
</script>
<style lang='scss'>
</style>