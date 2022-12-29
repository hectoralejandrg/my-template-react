<template>
  <div :id="id">
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.prevent="handleSubmit(checkForm)"  class="row">
      <div v-for="(field, index) in myFields" :key="`${index}${keyFormRender}`" class="" :id="field.name"
        :class="[
          field.containerClass? field.containerClass : 'col-md-4 col-xl-3'
        ]">
        <label class="label-form" v-if="field.label && field.label !== ''"
          :title="`${field.label}${validateAll || (field.validation && field.validation.includes('required'))? ' (Obligatorio)' : ''}`">
          <span>{{ !field.noTranslate ? $t(field.label) : field.label }}</span>
          <span class="text-danger" v-if="(validateAll || (field.validation && field.validation.includes('required'))) && field.label && field.label !== ''"> *</span>
        </label>
        <validation-provider
          :name="field.noTranslate ? $t(field.label) : field.label"
          :ref="field.name"
          :class="setSpecialValidation(field.validation)"
          :rules="`${setSpecialValidation(field.validation) || ''}|${(validateAll? 'required' : '')}`"
          v-slot="validationContext"
        >
          
          <component v-if="field.useCheckAll && field.options && field.options.length"
            :name="`${field.name}_checkall`"
            :id="`${id}_${field.name}_checkall`"
            :key="`${field.name}${index}_checkall`"
            :is="'FieldCheckbox'"
            :action="field.action"
            :options="optionsCheckAll"
            :change="(name, value) => changeCheckAll(name, value, field)"
            :disabled="field.disabled || hasDependency(field) || !!disableAll"
            :value.sync="checkAll"
            />
          
          <component v-if="!field.useSlot && !field.useSkeleton"
            :name="field.name"
            :id="`${id}_${field.name}`"
            :key="`${field.name}${index}`"
            :is="field.fieldType"
            :msg="validationContext.validated && !validationContext.valid ? {
              type: 'danger',
              text: validationContext.errors[0]
            } : undefined"
            :action="field.action"
            :placeholder="getPlaceholder(field)"
            :options.sync="field.options"
            v-bind="field"
            :disabled="field.disabled || hasDependency(field) || !!disableAll"
            :value.sync="form[field.name]"
            :loading.sync="field.loading"
            />
        </validation-provider>
        <div v-if="field.useSlot">
          <slot :name="field.name" :class="field.skipLine ? 'hidden' : ''">
          </slot>
        </div>
        <div v-if="field.useSkeleton">
          <div :name="field.name" :class="field.skipLine ? 'hidden' : ''">
            <b-skeleton v-if="!field.useLabel" width="30%" class="mb-05"/>
            <b-skeleton type="input" width="100%"/>
          </div>
        </div>
      </div>
      <div :class="containerButtonsClass? containerButtonsClass : ''">
        <b-button v-if="buttonSend" 
          :title="$t(buttonSend && buttonSend.title? buttonSend.title : !buttonSend.text? 'Buscar' : null)"
          v-b-tooltip.hover
          type="submit"
          :disabled="buttonSend.disabled || !!disableAll"
          :variant="buttonSend && buttonSend.color? buttonSend.color : 'primary'" 
          :class="buttonSend && buttonSend.class? buttonSend.class : ''">
          <feather-icon v-if="buttonSend && buttonSend.icon" :icon="buttonSend.icon" :class="buttonSend.iconClass"/>
          {{$t(buttonSend && buttonSend.text? buttonSend.text : '')}}
        </b-button>
        <slot name="buttons">
        </slot>
      </div>
      <slot name="extra"></slot>
      </b-form>
    </validation-observer>
  </div>
</template>
<script>
import FieldInput from '@/views/components/custom/form-render/fields/FieldInput.vue'
import FieldSelect from '@/views/components/custom/form-render/fields/FieldSelect.vue'
import FieldDatepicker from '@/views/components/custom/form-render/fields/FieldDatepicker.vue'
import FieldCheckbox from '@/views/components/custom/form-render/fields/FieldCheckbox.vue'
import FieldTags from '@/views/components/custom/form-render/fields/FieldTags.vue'
import FieldTextarea from '@/views/components/custom/form-render/fields/FieldTextarea.vue'
import FieldRadio from '@/views/components/custom/form-render/fields/FieldRadio.vue'
import FieldRTE from '@/views/components/custom/form-render/fields/FieldRTE.vue'
import FieldAutocomplete from '@/views/components/custom/form-render/fields/FieldAutocomplete.vue'
import { extend } from 'vee-validate'

export default {
  name: 'form-render',
  components: { FieldInput, FieldSelect, FieldDatepicker, FieldCheckbox, FieldTextarea, FieldRadio, FieldRTE, FieldAutocomplete, FieldTags },
  props: ['fields', 'form', 'buttonSend', 'containerButtonsClass', 'validateAll', 'send', 'id', 'disableAll'],
  data () {
    return {
      validation: true,
      formSended: false,
      defaultValuesSetted: false,
      myFields: [],
      selectorsLevel: {},
      keyFormRender: 0,
      checkAll: null,
      optionsCheckAll: [{id: true, text: 'Marcar todos los visibles'}]
    }
  },
  watch: {
    fields () {
      this.setMyFields(this.fields, 'watchFields')
    },
    form: {
      handler (form, prevForm) {
        this.$emit('update:form', form)
      },
      deep: true
    }
  },
  methods: {
    setMyFields (fields = [], origin) {
      this.myFields = []
      const fieldLevels = fields.find(field => field.fieldType === 'FieldsLevels')
      if (fieldLevels?.name) {
        this.selectorsLevel = this.$generatePlacesLevels(fieldLevels.country.levels, fieldLevels.country.maxLevel, fieldLevels.country.displayLevels)
      }
      [...fields].map(field => {
        if (field.fieldType !== 'FieldsLevels') {
          this.myFields.push(field)
        } else {
          if (field.skipLine) {
            this.myFields.push({ name: 'lineX', useSkeleton: true, skipLine: true, containerClass: 'col-12' })
          }
          this.myFields = this.myFields.concat(this.addPlacesLevelFields(field, origin))
        }
      })
    },
    addPlacesLevelFields (field, origin) {
      if (field.country.code === 'tl') field.country.code = 'cl'
      const texts = this.$i18nImport(`${field.country.code}.es`)[`${field.country.code}.es`]
      const newFields = []
      Object.keys(this.selectorsLevel).map((key, index) => {
        const currentLevel = parseInt(key.split('level')[1])
        // delete this.form[`${key}_${field.extraName}`]
        // if (field.customMaxLevel.useCheckAll) myFinalOptions = [{id: true, text: 'Marcar todos'}]
        const myField = {
          fieldType: field.customMaxLevel?.useCheckbox && field.country.maxLevel === currentLevel ? 'FieldCheckbox' : 'FieldSelect', 
          multiple: field.customMaxLevel?.useCheckbox && field.country.maxLevel === currentLevel,
          name: `${key}_${field.extraName}`, 
          label: texts[`Place_${key}_${field.extraName}`], 
          containerClass: field.containerClass || 'col-sm-12 container-info col-md-3 col-lg-2',
          options: field.country.maxLevel === currentLevel && field.country.displayLevels.length > 1 ? [] : this.selectorsLevel[key].sort((a, b) => a.name > b.name ? 1 : -1), 
          dependency: field.dependency,
          ...(field.customMaxLevel?.specialProps && field.country.maxLevel === currentLevel ? field.customMaxLevel?.specialProps : {})
        }
        
        if (index !== 0 && (!field.customMaxLevel?.loadOnAllSelectors || field.country.maxLevel !== currentLevel)) {
          myField.dependency = `${Object.keys(this.selectorsLevel)[index - 1]}_${field.extraName}`
        }
        if (field.country[`${key}Search`]) {
          myField.searchOnType = {
            fx: field.country[`${key}Search`],
            nChars: 3,
            debounce: 300,
            manualSearch: true
          }
        }
        if (!field.loadLevelsOnSelection) {
          if (!field.customMaxLevel?.useCheckbox || field.country.maxLevel !== currentLevel) {
            myField.change = (name, value) => this.changePlaceLevel(name, value, `${key}_${field.extraName}`, Object.keys(this.selectorsLevel)[index + 1], field)
          } else {
            myField.change = (name, value) => this.changeCheckboxPlaceLevel(name, value, `${key}_${field.extraName}`, Object.keys(this.selectorsLevel)[index + 1], field)
          }
        } else {
          myField.change = (name, value) => field.change(name, value, key, Object.keys(this.selectorsLevel)[index + 1], field)
        }
        myField.validation = field.country.requiredLevels.includes(currentLevel) ? 'required' : ''
        // if (myField.useCheckAll) {
        //   newFields.push({ fieldType: 'FieldCheckbox', multiple: true, name: `${myField.name}_checkall`, options: [{id: true, text: 'Marcar todos'}], containerClass: 'col-12 container-info'})
        // }
        newFields.push(myField)
      })
      return newFields
    },
    changeCheckAll (name, value, field) {
      let options = []
      if (!this.form[field.name]?.length) this.form[field.name] = []
      if (!!value) {
        options = this.form[field.name].concat(...field.options)
      } else {
        options = this.form[field.name].filter(el => {
          return !(field.options.map(opt => opt.id)).includes(el.id)
        })
      }
      options = [...new Set(options)]
      this.form[field.name] = options
      const indexMaxLevel = this.myFields.findIndex(el => el.name === field.name)
      this.myFields[indexMaxLevel].change(field.name, this.form[field.name] || [], null)

    },
    changeCheckboxPlaceLevel (name, value, current, next, field) {
      field.change(name, value, next)
    },
    setManualOptions (name, options) {
      const indexPlaceLevel = this.myFields.findIndex(el => el.name === name)
      if (indexPlaceLevel !== -1) this.myFields[indexPlaceLevel].options = options
      this.myFields[indexPlaceLevel].loading = false
      // this.keyFormRender++
    },
    changePlaceLevel (name, value, current, next, field) {
      const currentNext = `${next}_${name.split('_')[1]}`
      const index = this.myFields.findIndex(el => el.name === currentNext)
      const indexMaxLevel = this.myFields.findIndex(el => el.name === `level${field.country.maxLevel}_${field.extraName}`)
      const myFinalOptions = []

      // Si quedan hijos por cargar y hay valor actual seleccionado
      if (next && value?.id) {
        // Para mostrar los resultados del nivel final asociados al nivel actual sin importar cual sea.
        if (field.customMaxLevel?.loadOnAllSelectors && !field.country?.stepByStep) {
          this.myFields[indexMaxLevel].options = this.selectorsLevel[current.replace(`_${field.extraName}`, '')]
            .find(el => el.id === this.form[name].id)[`level${field.country.maxLevel}`]
            .sort((a, b) => a.name > b.name ? 1 : -1)
        }
        // Para validar si debe limpiarse el siguiente selector en base a 
        // Cuando se quieran los resultados del nivel final siempre, y tambien cuando el selector actual es el penultimo.
        if (!field.customMaxLevel?.loadOnAllSelectors || (field.customMaxLevel?.loadOnAllSelectors && currentNext !== `level${field.country.maxLevel}_${field.extraName}`)) {
          delete this.form[currentNext]
        }
        // currentOptions = value[next]
        if (!field.country?.stepByStep) this.myFields[index].options = value[next].sort((a, b) => a.name > b.name ? 1 : -1)
      }
      // Si se limpia el selector actual
      if (!value?.id) {
        const keyIndex = Object.keys(this.selectorsLevel).findIndex(key => key === current)
        const prev = keyIndex > 0 ? Object.keys(this.selectorsLevel)[keyIndex - 1] : null

        // Si este no es el primer nivel y el nivel previo tiene uno seleccionado
        if (prev && this.form && this.form[`${prev}_${field.extraName}`] && this.form[`${prev}_${field.extraName}`].id && !field.country?.stepByStep) {
        // Para mostrar los resultados del nivel final asociados al nivel actual sin importar cual sea.
          if (field.customMaxLevel?.loadOnAllSelectors) {
            next = null
            this.myFields[indexMaxLevel].options = this.selectorsLevel[`level${this.form[`${prev}_${field.extraName}`].level_num}`]
              .find(el => el.id === this.form[`${prev}_${field.extraName}`].id)[`level${field.country.maxLevel}`]
              // .filter(el => el[`parent_${prev}`] === this.form[`${prev}_${field.extraName}`].id && el.level_num === field.country.maxLevel)
              .sort((a, b) => a.name > b.name ? 1 : -1)
          }
        } else {
          this.myFields[indexMaxLevel].options = [] //field.customMaxLevel?.independantSelection ? [] : this.selectorsLevel[`level${field.country.maxLevel}`]
        }
        // Si además de limpiar el selector actual, este no es el último
        if (next) {
          
          // Para validar si debe limpiarse el siguiente selector en base a 
          // Cuando se quieran los resultados del nivel final siempre, y tambien cuando el selector actual es el penultimo.
          if (!field.customMaxLevel?.loadOnAllSelectors || (field.customMaxLevel?.loadOnAllSelectors && currentNext !== `level${field.country.maxLevel}_${field.extraName}`)) {
            delete this.form[currentNext]
          }
          // delete this.form[currentNext]
          const nextIndex = Object.keys(this.selectorsLevel).findIndex(key => key === next)
          // Si hay más niveles despues del actual, debe limpiarlos tambien
          const nextKey = Object.keys(this.selectorsLevel)[nextIndex] || null
          this.changePlaceLevel(currentNext, null, nextKey, Object.keys(this.selectorsLevel)[nextIndex + 1] || null, field)
        }
      }
      //Especial para cuando el nivel final es un tipo Checkbox
      if (field.customMaxLevel?.useCheckbox && field.customMaxLevel?.specialProps?.useCheckAll) {
        const allSelected = this.myFields[indexMaxLevel].options.every(el => {
          const myIds = (this.form[`level${field.country.maxLevel}_${field.extraName}`] || []).map(el => el.id)
          return (myIds).includes(el.id)
        })
        this.checkAll = allSelected ? this.optionsCheckAll : false
        this.myFields[indexMaxLevel].change(`level${field.country.maxLevel}_${field.extraName}`, this.form[`level${field.country.maxLevel}_${field.extraName}`] || [], null)
      }
      field.change(name, value, currentNext)
    },
    setSpecialValidation (string = '') {
      const index = string.indexOf('dni:')
      let aux = string
      if (index !== -1) {
        aux = string.substring(index + 4, string.length)
        const index2 = aux.indexOf('|')
        if (index !== -1) {
          aux = aux.substring(index2, aux.length)
        }
        if (aux === 'session') aux = this.$session.get('cas_user').country.code.toLowerCase()
        if (this.form[aux]) string = string.replace(string.substring(index + 4, index + 4 + aux.length), this.form[aux].code)

      }
      return string
    },
    onlyCheckForm () {
      return this.$refs.observer.validate().then(success => {
        const finalForm = {}
        Object.keys(this.form).map((key) => {
          if (( 
            (Array.isArray(this.form[key])) || 
            (!Array.isArray(this.form[key]) && (this.form[key] || this.form[key] === 0 || this.form[key] === '0')) ||
            (typeof this.form[key] === 'boolean')
          ) && this.myFields.findIndex(({name}) => name === key) !== -1) {
            finalForm[key] = this.form[key]
          }
        })
        this.$emit('update:form', this.form)
        return success
      })
    },
    checkForm () {
      this.$refs.observer.validate().then(success => {
        const finalForm = {}
        Object.keys(this.form).map((key) => {
          if (( 
            (Array.isArray(this.form[key])) || 
            (!Array.isArray(this.form[key]) && (!!this.form[key] || this.form[key] === 0 || this.form[key] === '0')) ||
            (typeof this.form[key] === 'boolean')
          ) && this.myFields.findIndex(({name}) => name === key) !== -1) {
            finalForm[key] = this.form[key]
          }
        })
        if (success) {
          this.$emit('send', finalForm)
        }
        this.$emit('update:form', this.form)
      })
    },
    hasDependency (field) {
      if (field.dependency) {
        return !this.form[field.dependency]
      } else {
        return false
      }
    },
    cleanForm (e) {
      // this.form = {}
    },
    getPlaceholder (field) {
      if (['FieldInput', 'FieldTextarea'].includes(field.fieldType) && !field.placeholder && field.placeholder !== '') {
        return `${this.$t('Ingrese')} ${(!field.noTranslate ? this.$t(field.label) : field.label).toLowerCase()}`
      } else if (['FieldSelect'].includes(field.fieldType) && !field.placeholder && field.placeholder !== '') {
        return `${this.$t('Seleccione')} ${(!field.noTranslate ? this.$t(field.label) : field.label).toLowerCase()}`
      } else if (field.placeholder && field.placeholder !== '') {
        return !field.noTranslate ? this.$t(field.placeholder) : field.placeholder
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.setMyFields(this.fields, 'mounted')
    // this.form = {...this.form}
  }
}
</script>
<style lang="scss">
  .container-info > :nth-child(2):not([fieldtype="FieldCheckbox"]):not([fieldtype="FieldRadio"]):not([fieldtype="FieldSwitch"]):not([fieldtype="FieldTextarea"]) {
    > button{
      margin-bottom: 22px
    }
  }
  
  // input.form-control{
  //   height: 37px !important;
  // }

  .input-multiple.active + .remove-button{
    top: -36px;
  }
  .textarea-multiple.active + .remove-button{
    top: -35px;
  }

  .condition-multiple.active + .remove-button{
    top: -37px;
  }
  .remove-button{
    height: 0;
    width: 100%;
    padding-right: 2rem;
    position: relative;
    > div > div{
      width: 20px;
      height: 20px;
      svg{
        width: 20px !important;
        height: 20px !important;
      }
    }
  }
  .input-multiple.active > div[fieldtype=FieldInput] > .input-group ,
  .textarea-multiple.active > div[fieldtype=FieldTextarea] > textarea.form-control,
  .condition-multiple.active > div[fieldtype=FieldSelect] > .v-select {
    width: calc(100% - 40px);
  }
  .textarea-multiple.active > div[fieldtype=FieldTextarea] > .textarea-counter-value{
    margin-right: 50px !important;
  }

  .sub-label-form{
    top: -5px; position: relative;
  }
  
</style>
