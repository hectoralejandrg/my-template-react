<template>
  <div>
    <b-card>
      <div class="button-open-modal" v-show="[0].includes(tabIndex)">
        <b-button variant="warning" class="push-right" @click="() => openModal(null)" :disabled="loading.button"><feather-icon icon="PlusIcon" /> Nuevo</b-button>
      </div>
      <b-tabs align="left" class="tab-primary" v-model="tabIndex">
        <b-tab>
          <template #title>
            <div class="tab-title">
              <feather-icon icon="TruckIcon" />
              <span> {{ $t("Autorizar Carriers") }} </span>
            </div>
          </template>
          <authorized-carrier-organization :openModal="openModal"></authorized-carrier-organization>
          <modal-authorized-carrier :formTab="form"></modal-authorized-carrier>
        </b-tab>
       </b-tabs>
    </b-card>
  </div>
</template>
<script>


import AuthorizedCarrierOrganization from './authorizedCarrierOrganization/AuthorizedCarrierOrganization.vue'
import ModalAuthorizedCarrier from './authorizedCarrierOrganization/ModalAuthorizedCarrierOrganization.vue'
export default {
  name: 'details-organizations',
  components: {
    AuthorizedCarrierOrganization,
    ModalAuthorizedCarrier
  },
  data() {
    return {
      form: {},
      tabIndex: 0,
      loading: {
        button: false,
        initial: true
      }
    }
  },
  watch: {
    tabIndex() {
      this.form = {}
    }
  },
  mounted() {
  },
  methods: {
    openModal(data) {
      if (data) this.form = data
      else this.form = {}
      switch (this.tabIndex) {
      case 0:
        this.$bvModal.show('modalAuthorizedCarrier')
        break
      default:
        break
      }
    }
  }
}
</script>

<style lang="scss">
.button-open-modal {
  top: -3.4rem !important;
  right: 0rem !important;
  position: absolute !important;
}
</style>
