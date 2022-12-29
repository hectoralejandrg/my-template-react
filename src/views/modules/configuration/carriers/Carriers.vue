<template>
  <div>
    <b-card>
      <div class="carriers-button">
        <b-button
          variant="warning"
          class="push-right"
          @click="goToCreateCarrier"
          ><feather-icon icon="PlusIcon" />Nuevo carrier</b-button
        >
      </div>
      <filter-swapper
        v-if="!loading.first"
        :buttons="buttons"
        :controlHeightButtons="controlHeight"
        :trigger="selectedRows.length === 0"
      >
        <template #slot1>
          <form-render
            :key="keyFormRender"
            :fields="fields"
            :buttonSend="buttonSend"
            class="mb-2"
            :form.sync="formFilter"
            @send="filterList"
            containerButtonsClass="col-sm-12 col-md-8 col-lg-3 container-button mt-2"
          >
            <template #buttons>
              <b-button
                variant="outline-light"
                v-b-tooltip.hover
                title="Limpiar filtros"
                class="ml-2"
                @click="cleanFilter"
                ><feather-icon icon="RefreshCwIcon"
              /></b-button>
            </template>
          </form-render>
        </template>
      </filter-swapper>
      <div v-show="!loading.first">
        <table-render
          id="table_folders"
          :schema="schema"
          :rows="rows"
          :actions="actions"
          :loading="loading.carriers"
          showCheckboxes="true"
          :selectedRows.sync="selectedRows"
        >
        </table-render>
        <pagination
          :pagination="pagination"
          :noDigits="false"
          :showSize="true"
        />
      </div>
      <b-skeleton
        height="40px"
        width="100%"
        class="mt-2 mb-2 spacing-label-field"
        v-show="loading.first"
      />
      <div class="table-render-skeleton" v-show="loading.first">
        <b-skeleton-table
          :rows="pagination.limit || 10"
          :columns="schema.length || 10"
          :table-props="{}"
        />
      </div>
      <modal-upload-coberturas></modal-upload-coberturas>
    </b-card>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import ModalUploadCoberturas from './ModalUploadCoberturas.vue'
export default {
  name: 'config-carriers',
  components: { ModalUploadCoberturas },
  data() {
    return {
      profileFile: null,
      buttons: [],
      formFilter: {},
      selectedRows: [],
      payloadFilter: {},
      controlHeight: { class: 'row mb-2 spacing-label-field' },
      buttonSend: { title: 'Buscar', icon: 'SearchIcon', color: 'warning' },
      schema: [],
      rows: [],
      fields: [],
      actions: [],
      pagination: {
        page: 1,
        total: 40,
        limit: 10
      },
      loading: {
        first: true,
        carriers: true
      },
      keyFormRender: 0,
      showingActions: false
    }
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      carriers: 'getCarriers',
      carrieStatus: 'getCarrierStatus'
    })
  },
  mounted() {
    this.setInitialData()
  },
  watch: {
    carriers() {
      this.rows = this.carriers.rows.map(value => ({ ...value, status: value.status?.name }))
      this.selectedRows = []
      this.loading.first = false
      this.loading.carriers = false
    },
    'pagination.page'() {
      this.getCarriers()
    },
    'pagination.limit'() {
      this.getCarriers()
    },
    countries() {
      this.setCountries('watch')
    },
    carrieStatus() {
      const index = this.fields.findIndex(el => el.name === 'carrier_status')
      if (index !== -1) this.fields[index].options = this.carrieStatus
    },
    profileFile() {
      console.log(this.profileFile)
      console.log(this.progressFileUploadValue)
    },
    progressFileUploadValue() {
    }
  },
  methods: {
    setInitialData() {
      this.schema = [
        { label: 'Id', sortable: true, key: 'id' },
        { label: 'Nombre', sortable: true, key: 'name' },
        { label: 'Pais', sortable: true, key: 'country_carrier' },
        { label: 'Estado', key: 'status' },
        { label: 'Código', key: 'code', class: ['text-center'], style: { width: '15%' } },
        { label: 'Acciones', key: 'actions', class: ['text-center'] }
      ]
      this.fields = [
        { fieldType: 'FieldInput', name: 'search_string', label: 'Informacion', containerClass: 'col-sm-12 container-info col-md-3' },
        { fieldType: 'FieldSelect', name: 'country_id', label: 'Pais', containerClass: 'col-sm-12 container-info col-md-2' },
        { fieldType: 'FieldSelect', name: 'carrier_status', label: 'Estado', containerClass: 'col-sm-12 container-info col-md-2' }]
      this.buttons = [{ name: 'delete', text: 'Eliminar', color: 'danger', icon: 'TrashIcon', action: this.confirmDeleteMultipleCarriers }]
      this.actions = [
        {
          action: id => {
            const currentCarrier = this.rows.find(value => value.id === id)
            this.$router.push({ name: 'details-carriers', params: { id : currentCarrier.id, name: currentCarrier.name, breadcrumb: { name: currentCarrier.name } } })
          }, icon: 'FileTextIcon', color: 'success', text: 'Detalles de Carriers'
        },
        { action: id => this.confirmDeleteCarrier(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' },
        { action: () => this.openModalUploadCoberturas(), icon: 'FileIcon', color: 'success', text: 'Subir planilla carriers' }]
      this.getAllInitialData()
    },
    getAllInitialData() {
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.getCarriers()
      } else {
        this.$alert(this.$t('msg-error-permission'))
        return null
      }
      if (this.countries && !!this.countries.length) { //Para cuando se cambia de pantalla dentro del sitio sin actualizar
        this.setCountries()
      }
    },
    getCarriers() {
      this.selectedRows = []
      this.loading.carriers = true
      const queryParams = {
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...this.payloadFilter
      }
      this.$store.dispatch('fetchService', { name: 'getCarriers', queryParams })
      this.$store.dispatch('fetchService', { name: 'getCarrierStatus' })
    },
    setCountries() {
      const index = this.fields.findIndex(el => el.name === 'country_id')
      if (index !== -1) this.fields[index].options = this.countries
    },
    filterList(form) {
      this.payloadFilter = {}
      Object.keys(form).map(key => {
        this.payloadFilter[key] = form[key].id || form[key]
      })
      if (this.pagination.page !== 1) this.pagination.page = 1; else this.getCarriers()
    },
    cleanFilter() {
      this.formFilter = {}
      this.keyFormRender++
      this.filterList(this.formFilter)
    },
    confirmDeleteCarrier(_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), () => this.deleteCarrier(_id))
    },
    deleteCarrier(id) {
      this.$store.dispatch('fetchService', { name: 'deleteCarriers', params: { carrier_id: id }, onSuccess: this.successDeleteCarrier })
    },
    successDeleteCarrier() {
      this.getCarriers()
      this.$success(this.$t('msg-exito-eliminar-elemento'))
    },
    confirmDeleteMultipleCarriers() {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleCarriers)
    },
    deleteMultipleCarriers() {
      const services = this.selectedRows.map(id => ({ name: 'deleteCarriers', params: { carrier_id: id } }))
      this.$store.dispatch('fetchMultipleServices', { services, showPackSuccess: true, onSuccess: this.successDeleteMultipleCarriers })
    },
    successDeleteMultipleCarriers() {
      this.getCarriers()
      this.$success(this.$t('msg-exito-eliminar-multiple'))
    },
    goToCreateCarrier() {
      this.$router.push({ name: 'create-carriers' })
    },
    openModalUploadCoberturas() {
      this.$bvModal.show('modal-upload-coberturas')
    }
  }
}
</script>

<style lang='scss'>
.carriers-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
</style>
