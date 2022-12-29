<template>
  <b-modal id="modalAliases" :title="$t(`${editingAlias ? 'Editar alias' : 'Nuevo alias'}`)" size="sm" :ok-title="$t(`${editingAlias ? 'Editar alias' : 'Nuevo alias'}`)" ok-variant="warning" 
     ok-only no-close-on-esc no-close-on-backdrop centered @close="close" @ok="ok" :ok-disabled="loading">
    <form-render v-show="!loading" :form.sync="form" :fields="fields" @send="onAccept" containerButtonsClass="col-sm-12" 
    ref="formRenderAlias">
    </form-render>
    <div v-show="loading">
      <b-skeleton width="30%"/>
      <b-skeleton type="input"/>
      <b-skeleton width="30%" class="mt-1"/>
      <b-skeleton type="input"/>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import internalLevels from './internalLevels'
export default {
  name:'modalAliases',
  props: ['aliases', 'send', 'countries', 'organizations', 'shippersByOrganization', 'lastLevelSelected'],
  data () {
    return {
      form: {},
      fields: [],
      loading: true,
      editingAlias: false,
      keyFormRender: 0,
      isAdmin: false,
      internalLevels,
      myLastLevel: null,
      isDifCountry: true
    }
  },
  computed: {
    ...mapGetters({
      levels: 'getLevels'
    })
  },
  watch: {
    aliases: {
      handler () {
        this.editingAlias = !!this.aliases.id
        this.loading = true
        this.isDifCountry = this.form.country?.code !== this.aliases.country?.code
        
        this.form = {
          ...this.aliases
        }
        // Si es solo visualización mostramos los campos de alias ya seteados con su valor
        if (this.isDifCountry) this.setInitialData()
        this.myLastLevel = 0
        if (!!this.aliases.country) {
          let hasLevelsWithValue = false
          this.myLastLevel = this.internalLevels[this.aliases.country.code.toLowerCase()].display.slice(-1)[0]
          Object.keys(this.aliases).map(key => {
            if (/(\blevel\d_aliases)/g.test(key) && !!this.aliases[key]?.id) {
              hasLevelsWithValue = true
              this.myLastLevel = parseInt(key.replace('level', '').replace('_aliases', ''))
            }
          })
          this.changeCountry(null, this.aliases.country, true)
        }
        this.loading = false
      }, deep: true
    },
    // myLastLevel () {
    //   this.form = {
    //     ...this.form,
    //     alias_type: { id: this.myLastLevel }
    //   }
    //   if (this.country) this.changeAliasType('alias_type', this.form.alias_type)
    // },
    countries () {
      const index = this.fields.findIndex(el => el.name === 'country')
      this.fields[index].options = this.countries
      this.loading = false
    },
    organizations () {
      const index = this.selectionIndex('organization_id')
      this.fields[index].options = this.organizations
      this.loading = false
    },
    shippersByOrganization () {
      const index = this.selectionIndex('shipper_id')
      this.fields[index].options = this.shippersByOrganization
      this.loading = false
    },
    levels () {
      this.loadedLevels()
    }
  },
  mounted () {
    this.setInitialData()
    const scope = this
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      setTimeout(() => {
        Object.keys(scope.form).map(key => {
          if (/(\blevel\d_aliases)/g.test(key) && !!scope.form[key]?.id) {
            const nextLevel = parseInt(key.replace('level', '').replace('_aliases', '')) + 1
            scope.$refs.formRenderAlias.setManualOptions(`level${nextLevel}_aliases`, scope.form[key][`level${nextLevel}`])
          }
        })
      }, 0)
      this.keyFormRender++
    })
  },
  methods: {
    setInitialData() {
      if (!!this.editingAlias) {
        this.fields = [ 
          {fieldType: 'FieldInput', name: 'name', label: 'Alias', containerClass: 'col-sm-12 mt-05'}
        ]
      }
      // Si es una solicitud mostramos los campos a llenar
      else {
        this.isAdmin = ['admin', 'superadmin'].includes(this.$session.get('cas_user').role)
        this.fields = [
          {fieldType: 'FieldSelect', name: 'country', label: 'País', options: this.countries, change: this.changeCountry, validation: 'required', containerClass: 'col-sm-12 mt-05' }, 
          {fieldType: 'FieldSelect', name: 'organization_id', clearable: true, label: 'Organización(Opcional)', containerClass: 'col-sm-12 mt-05', options: this.organizations, change: this.changeOrganization},
          {fieldType: 'FieldSelect', name: 'shipper_id', clearable: true, useLabel: true, useSkeleton: false, label: 'Shipper(Opcional)', containerClass: 'col-sm-12 mt-05', options: this.shippersByOrganization, dependency: 'organization_id', change: this.changeShipper},
          {fieldType: 'FieldInput', name: 'name', label: 'Alias', containerClass: 'col-sm-12 mt-05'}
        ]
      }
      this.loading = false
    },
    ok (e) {
      e.preventDefault()
      this.$refs.formRenderAlias.checkForm()
    },
    close () {
      this.$emit('update:aliases', {})
    },
    onAccept (data) {
      this.loading = true
      let form = {}
      if (!!this.editingAlias) {
        form = {
          name: data.name ? data.name : ''
        }
      } 
      else { 
        form = {
          name: data.name ? data.name : '',
          country: data.country ? data.country.id : '',
          place_id: data.level3_aliases ? data.level3_aliases.platform_id : data.level2_aliases.platform_id,
          company_id : data.shipper_id ? data.shipper_id.id : data.organization_id.id,
          name1: data.shipper_id ? data.shipper_id.name1 : null
        }
      }
      this.$emit('send', {  form, id: this.editingAlias ? this.aliases.id : null, original: data})
    },
    changeCountry (name, value, hasPlaces = false) {
      if (!hasPlaces || this.isDifCountry) this.fields = this.fields.filter(el => el.name.indexOf('level') === -1 && el.name.indexOf('skeleton') === -1 && el.name.indexOf('alias_type') === -1)
      this.country = value
      //limpia todo
      if (!value?.id) return null
      //Guardo los campos normales

      //Pego los campos originales
      if (value?.id) {
        if (!hasPlaces) {
          this.showSkeletonPlaces()
          this.getLevels(value)
        } else if (this.isDifCountry) {
          this.loadedLevels()
        } else if (!this.isDifCountry) {
          this.setAliasType()
        }
      }
      
    },

    showSkeletonPlaces () {
      const indexSplice = this.fields.findIndex(el => el.name === 'shipper_id') + 1
      const display = this.internalLevels[this.country.code.toLowerCase()].display
      display.map(el => {
        this.fields.splice(indexSplice, 0, { name: `skeleton${el}`, useSkeleton: true, containerClass: 'col-sm-12 mt-05' })
      })
    },

    setAliasType () {
      this.form.alias_type = null
      const countryCode = this.country.code.toLowerCase()
      this.fields = this.fields.filter(el => el.name.indexOf('alias_type') === -1)
      if (this.internalLevels[countryCode].display.length > 1) {
        const texts = this.$i18nImport(`${countryCode}.es`)[`${countryCode}.es`]
        const index = this.fields.findIndex(el => el.name === 'country')
        const options = this.internalLevels[countryCode].display.map(level => ({ id: level, text: texts[`Place_level${level}`]}))
        this.fields.splice(index + 1, 0, 
          {fieldType: 'FieldSelect', name: 'alias_type', clearable: true, label: 'Tipo de Alias', containerClass: 'col-sm-12 mt-05', options, change: this.changeAliasType}
        )
        let alias_type = null
        if (this.myLastLevel) {
          alias_type = options.find(el => el.id === this.myLastLevel)
        } else {
          alias_type = options.slice(-1)[0]
        }
        setTimeout(() => {
          this.form = {
            ...this.form,
            alias_type
          }
          this.changeAliasType('alias_type', this.form.alias_type)
        }, 0)
      }
    },
    changeAliasType (name, value) {
      this.myLastLevel = value?.id || null
      const countryCode = this.country.code.toLowerCase()
      if (!!value?.id && this.internalLevels[countryCode].display.length > 1) {
        const indexDisplay = this.internalLevels[countryCode].display.findIndex(el => el === value.id)
        // this.internalLevels[countryCode].displaySpecial = this.internalLevels[countryCode].display.slice(0, indexDisplay + 1)
        // this.internalLevels[countryCode].requiredSpecial = [this.internalLevels[countryCode].displaySpecial.slice(-1)[0]]
        const display = this.internalLevels[countryCode].display.slice(0, indexDisplay + 1)
        const indexFieldLevels = this.fields.findIndex(el => el.name === 'levels_aliases')
        const country = {
          ...this.fields[indexFieldLevels].country,
          requiredLevels: [value.id],
          displayLevels: display,
          maxLevel: Math.max(...display)
        }
        const fieldOrigin = { fieldType: 'FieldsLevels', name: 'levels_aliases', extraName: 'aliases', country, dependency: 'country', change: this.changePlaceLevel, containerClass: 'col-sm-12 mt-05' }
        const indexSplice = this.fields.findIndex(el => el.name === 'levels_aliases')
        this.fields.splice(indexSplice, 1, fieldOrigin)
        // this.keyFormRender++
      }
    },
    getLevels (country) {
      /* this.loading.levels = true */
      this.$store.dispatch('fetchService', { name: 'getLevels', params: {country: country.code.toLowerCase() }})
    },
    loadedLevels () {
      this.fields = this.fields.filter(el => el.name.indexOf('level') === -1 && el.name.indexOf('skeleton') === -1)
      this.enableSearch = false
      const full_places = this.$generateArrayPlacesFromTree(this.levels)
      this.country = this.isAdmin ? this.country : this.$session.get('cas_user').country
      const indexSplice = this.fields.findIndex(el => el.name === 'shipper_id') + 1
      const country = {
        code: this.country.code.toLowerCase(),
        requiredLevels: this.internalLevels[this.country.code.toLowerCase()].required,
        displayLevels: this.internalLevels[this.country.code.toLowerCase()].display,
        maxLevel: Math.max(...this.internalLevels[this.country.code.toLowerCase()].required),
        levels: full_places,
        loadLevelsOnSelection: false
      }
      const fieldOrigin = { fieldType: 'FieldsLevels', name: 'levels_aliases', extraName: 'aliases', country, dependency: 'country', change: this.changePlaceLevel, containerClass: 'col-sm-12 mt-05' }
      this.fields.splice(indexSplice, 0, fieldOrigin)
      this.setAliasType()
      // this.keyFormRender++
      /* this.loading.levels = false */
      
    },
    changePlaceLevel (name, value, next) {
      this.enableSearch = true
      this.form = {
        ...this.form,
        [next]: undefined
      }

    },
    // Buscamos el indice de un campo segun su nombre
    selectionIndex(name) {
      return this.fields.findIndex(el => el.name === name)
    },
    changeOrganization (name, value) {
      this.form = {
        ...this.form,
        shipper_id: null
      }
      const index = this.selectionIndex('shipper_id')

      this.fields[index].options = []
      if (!value?.id) {
        return null
      }
      const queryParams = {}

      // Parametros a pasar en la llamada a getOrganization
      const params = {
        id: this.organizationId || this.form.organization_id?.id || 0
      }
      // Llamamos al endpoint que obtiene los shippers segun la empresa seleccionada
      this.getShipper(this.form.organization_id.id)
     
    },
    changeShipper(name, value) {
    },
    // Obtención de shippers 
    getShipper(companyId) {

      const index = this.selectionIndex('shipper_id')

      const queryParams = {}

      const params = {
        organization_id: companyId ||  0
      }
      this.fields[index].useSkeleton = true
      this.$store.dispatch('fetchService', { name: 'getShippersByOrganization', queryParams, params, onSuccess: () => this.fields[index].useSkeleton = false})
    }
  }
 
}
</script>
