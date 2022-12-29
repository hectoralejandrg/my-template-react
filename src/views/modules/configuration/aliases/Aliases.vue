<template>
  <div>
    <b-card>
      <div class="admin-alias-button">
        <b-button variant="warning" class="push-right" @click="openModal" :disabled="loading"><feather-icon icon="PlusIcon"/> {{$t('Nuevo Alias')}}</b-button>
      </div>
      <filter-swapper :trigger="selectedRows.length === 0" id="alias_swapper" :buttons="buttons" :controlHeightButtons="controlHeight">
        <template #slot1>
          <form-render :key="keyFormRender" class="mb-2" :fields="fields" :buttonSend="buttonSend" :form.sync="formFilter" @send="filterList"
            containerButtonsClass="col-md-4 col-xl-3 mt-2">
             <template #buttons>
              <b-button variant="outline-light" class="ml-2" v-b-tooltip.hover title="Limpiar filtros" @click="cleanFilter"><feather-icon icon="RefreshCwIcon"/></b-button>  
            </template>
          </form-render>
        </template>
      </filter-swapper>
      <table-render v-if="showTable && !loading" :key="keyTableRender" id="alias" :rows.sync="rows" :schema="schema" :actions="actions" :showCheckboxes="true"
        :selectedRows.sync="selectedRows" >
         <template #name1="scope">
          <span>{{scope.rowdata.name1 ? scope.rowdata.name1 : 'General'}}</span>
        </template>
      </table-render>
      <b-skeleton height="40px" width="100%" class="mt-2 mb-2" v-show="loading"/>
      <div class="table-render-skeleton" v-show="loading">
        <b-skeleton-table         
          :columns="schema.length || 10"
          :table-props="{ }"/>
      </div>
    </b-card>
   <modal-aliases ref="modalAliases" :aliases="formFilter" @send="saveAliases" :countries="countries" :organizations="organizations" :shippersByOrganization="shippersByOrganization"></modal-aliases>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import alias_json from './alias.json'
import internalLevels from './internalLevels'
import ModalAliases from './ModalAliases.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
export default {
  name: 'alias',
  components: {ModalAliases},
  data () {
    return {
      alias: [],
      buttons: [],
      currentAliases: {},
      controlHeight: { class: 'row mb-2 spacing-label-field'},
      selectedRows: [],
      schema: [],
      actions: [],
      rows: [],
      enableSearch: false,
      buttonSend: {icon: 'SearchIcon', color: 'warning', title: 'Filtrar', disabled: true},
      fields: [],
      formFilter: {},
      payloadFilter: {},
      showTable: false,
      loading: false,
      keyTableRender: 0,
      keyFormRender: 0,
      isAdmin: false,
      internalLevels
    }
  },
  // Endpoints globales para los selectores de organizations, shippers, countries y levels
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      levels: 'getLevels',
      organizations: 'getOrganizationsGlobal',
      shippersByOrganization: 'getShippersByOrganization'
    })
  },
  watch: {
    countries() {
      if (this.countries && !!this.countries.length) this.setInitialData()
    },
    enableSearch () {
      this.buttonSend.disabled = !this.enableSearch
    }
  },
  mounted () {
    this.getAllInitialData()
    this.buttons = [
      { name: 'delete', text: 'Eliminar', color: 'danger',  icon: 'TrashIcon', action: this.confirmDeleteMultipleAlias}
    ] 
  },
  methods: {
    // Función para inicializar la data
    getAllInitialData () {
      if (this.countries && !!this.countries.length) this.setInitialData()
    }, 
    setInitialData () {
      this.isAdmin = ['admin', 'superadmin'].includes(this.$session.get('cas_user').role)
      this.fields = [
        {fieldType: 'FieldSelect', name: 'country', label: 'País', options: this.countries, change: this.changeCountry, validation: 'required', containerClass: 'col-12 col-md-3 col-lg-2 container-info' }
      ]
      // Setear el campo de country con la sesión de usuario, esta comentando porque no se si todos los usuarios tienen country
      /*this.changeCountry(null, this.$session.get('cas_user').country)*/
    },
    // Esquemas de la tabla y acciones
    setSchema() {
      this.getAllAlias()
      this.loading = false
      this.schema = [
        {label: 'Alias', sortable: true, key: 'name'},
        {label: 'Empresa', sortable: true, key: 'name1', useSlot: true},
        {label: 'Acciones', key: 'actions', class: ['text-center']}
      ]
      this.actions = [
        { action: id => this.openEdit(id), icon: 'Edit2Icon', color: 'success', text: 'Editar' },
        { action: id => this.confirmDeleteAlias(id), icon: 'TrashIcon', color: 'danger', text: 'Eliminar' }
      ]
      this.showTable = true
    },
    // Función para filtrar la data recibida (json de prueba) segun los campos seleccionados de país y places
    getAllAlias() {
      this.alias = alias_json
      this.rows = this.alias.filter((info) => {
        if (this.payloadFilter.country_id && this.payloadFilter.place_id)  return info.country_id === this.payloadFilter.country_id && info.place_id === this.payloadFilter.place_id
      } 
      )   
    },
    // Función para editar el alias
    updateAliases (data) {
      const index = this.rows.findIndex(row => row.id === data.id)
      this.rows[index] = {
        ...this.rows[index],
        name: data.form.name,
        updated_at: this.printDate()

      } 
      this.keyTableRender++ 
    },
    // Función de prueba para generar el día en que se ha creado el alias
    printDate () {
      const options = {
        hour: 'numeric',                         
        minute: 'numeric',                        
        second: 'numeric' 
      }
      return new Date().toLocaleDateString('sv-SE', options)
    },
    // Función para agregar un nuevo alias, tiene datos de prueba
    addAliasTable (data) {
      this.rows.unshift({
        ...data.form,
        'id': Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 5),
        'marketplace_id': null,
        'created_at': this.printDate(),
        'updated_at': null,
        'deleted_at': null
      })
    },
    // Función que llama a addAliasTable y cierra el modal
    saveAliases (data) {
      this.$refs.modalAliases.loading = true
      this.$bvModal.hide('modalAliases')
      if (!!data.id) this.updateAliases(data)
      else this.addAliasTable(data)
      
    },
    // Función para abrir el modal de nuevo alias(modalAliases) es el mismo modal pero condicionado para cada caso
    openModal () {
      // this.currentAliases = { ...this.formFilter }
      this.$bvModal.show('modalAliases')
    },
    // Función para abrir el modal de editar alias(modalAliases) es el mismo modal pero condicionado para cada caso
    openEdit (_id) {
      this.currentAliases = this.rows.filter(({id}) => id === _id)[0]
      this.lastLevelSelected = null
      this.$bvModal.show('modalAliases')
    },
    // Función para obtener la data de los selector Country y Level, luego de tener la data filtrada llamamos al setSchema
    filterList (form) { 
      this.loading = true
      this.payloadFilter = {}
      if (!!form.country) { this.payloadFilter.country_id = form.country.id }
      if (!!form.level3_aliases || !!form.level2_aliases) { this.payloadFilter.place_id = form.level3_aliases ? form.level3_aliases.platform_id : form.level2_aliases.platform_id } 
      this.setSchema()
    },
    // Limpio todos lo filtros
    cleanFilter () {
      this.formFilter = {}
      this.keyFormRender++
      this.filterList(this.formFilter) 
      this.setInitialData()
      this.showTable = false
    },
    // Confirmar eliminación individual
    confirmDeleteAlias(_id) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteAlias(_id))
    },
    // Confirmar eliminación multiple
    confirmDeleteMultipleAlias () {
      this.$yesno(this.$t('msg-pregunta-eliminar-seleccionados'), this.deleteMultipleAlias)
    },
    //Eliminación multiple
    deleteMultipleAlias () {
      if (this.rows.length === this.selectedRows.length) {
        this.rows.splice(0)
      } else { 
        this.selectedRows.map(id => {
          const index = this.rows.findIndex(el => el.id === id)
          if (index !== -1) {
            this.rows.splice(index, 1)
          }
        })  
      } 
      this.selectedRows = []
      
    },
    //Eliminación individual
    deleteAlias(id) {
      this.rows.splice(id, 1)
    },
    // Obtiene el valor del país seleccionado
    changeCountry (name, value) {
      this.fields = this.fields.filter(el => el.name.indexOf('level') === -1 && el.name.indexOf('skeleton') === -1)
      this.country = value
      this.formFilter = {
        country: value,
        level1_aliases: null,
        level2_aliases: null,
        level3_aliases: null,
        level4_aliases: null,
        level5_aliases: null
      }
      //limpia todo
      if (!value?.id) return null
      //Guardo los campos normales

      const display = this.internalLevels[this.country.code.toLowerCase()].display

      display.map(el => {
        this.fields.push({ name: `skeleton${el}`, useSkeleton: true, containerClass: 'col-12 col-md-3 col-lg-2 container-info' })
      })

      //Pego los campos originales
      if (value?.id) {
        this.getLevels(value)
      }
      
    },
    //Llama a los getLevels y a loadedLevels
    getLevels (country) {
      /* this.loading.levels = true */
      this.$store.dispatch('fetchService', { name: 'getLevels', params: {country: country.code.toLowerCase() }, onSuccess: this.loadedLevels})
    },
    // Carga los levels segun el país seleccionado
    loadedLevels () {
      this.enableSearch = false
      const full_places = this.$generateArrayPlacesFromTree(this.levels)
      this.country = this.isAdmin ? this.formFilter.country : this.$session.get('cas_user').country
      this.fields = this.fields.filter(el => el.name.indexOf('skeleton') === -1)
      const indexSplice = this.fields.findIndex(el => el.name === 'country') + 1
      const country = {
        code: this.country.code.toLowerCase(),
        requiredLevels: this.internalLevels[this.country.code.toLowerCase()].required,
        displayLevels: this.internalLevels[this.country.code.toLowerCase()].display,
        maxLevel: Math.max(...this.internalLevels[this.country.code.toLowerCase()].required),
        levels: full_places,
        loadLevelsOnSelection: false
      }
      const fieldOrigin = { fieldType: 'FieldsLevels', name: 'levels_aliases', extraName: 'aliases', country, dependency: 'country', change: this.changePlaceLevel, containerClass: 'col-12 col-md-3 col-lg-2 container-info' }
      this.fields.splice(indexSplice, 0, fieldOrigin)

      /* this.loading.levels = false */
    },
    // Limpia los selectores al cambiar de place
    changePlaceLevel (name, value, next) {
      this.enableSearch = true
      this.formFilter = {
        ...this.formFilter,
        [next]: undefined
      }
    }
  }
  
}
</script>
<style lang='scss'>
.admin-alias-button {
  top: -3.5rem !important;
  right: 0rem !important;
  position: absolute !important;
  z-index: 9;
}
@media (min-width: 1200px) {
  .col-new {
    flex: 0 0 25%;
    max-width: 25%;
  }
}
</style>