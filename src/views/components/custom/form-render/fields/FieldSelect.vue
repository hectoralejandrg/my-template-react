<template>
  <div>
    <!-- :calculate-position="(dropdownList, component, style) => setPositionList(dropdownList, component, style, mainColor)"  -->
    <v-select v-model="myValue" @input="onChange"
    :id="id"
    :key="keySelect"
    :calculate-position="setPositionList" 
    :placeholder="placeholder || 'Seleccione una opción'" :dir="'ltr'" label="text" :multiple="!!multiple"
    :disabled="disabled" :reduce="reduce"
    :options="myOptions"
    :filter="filter"
    :map-keydown="(map, vm) => handlers(map, vm)"
    @search="onSearch"
    @search:focus="onSearchFocus"
    @search:blur="onSearchBlur" :class="[
      !!mainColor? `v-select--${mainColor}` : '',
      (typeof msg === 'undefined')? '' : 'is-invalid',
      multiple? 'select-multiple' : '',
    ]" append-to-body
    :clearable="clearable">
      <template v-slot:no-options="{ search, searching }">
        <span v-if="validateShowText(search, searching, 'no-match-normal') && !loading">
          {{$t('Sin coincidencias para')}} <em>{{ search }}</em>.
        </span>
        <span v-if="validateShowText(search, searching, 'no-options-normal') && !loading">
          {{$t('No hay opciones cargadas.')}}
        </span>
        <span v-if="loading">
          <!-- {{$t('Cargando registros')}}<br> -->
          {{$t('Buscando coincidencias para')}} <em>{{ search }}</em><br>
          <feather-icon icon="LoaderIcon" class="spinner m-1" size="2x"/>
        </span>
        <!-- <span v-if="validateShowText(search, searching, 'search-match')">
          {{$t('Buscando coincidencias para')}} <em>{{ search }}</em><br>
          <feather-icon icon="LoaderIcon" class="spinner m-1" size="2x"/>
        </span> -->
        <span v-if="validateShowText(search, searching, 'invalid-length') && !loading">
          {{$t('msg-nchars', {key: searchOnType.nChars || 3})}}
        </span>
      </template>
      <template #option="{ id, text, name, icon, color, header }" class="algo">
        <feather-icon style="width: 17px" v-if="showIcon" :icon="icon || 'square'" :class="[`option-select-icon`, `text-${!isSelected(id) ? color || '' : 'white'}`]"/>
        <span v-if="!mainColor" :class="[header ? 'header-group' : '', `text-${!isSelected(id) ? color || '' : 'white'}`]" > {{ text || name }} {{header}}</span>
        <span v-else :class="[header ? 'header-group' : '']" > {{ text || name }} {{header}}</span>
      </template>
      <!--li slot="list-footer" class="pagination">
        <button @click="pagination.page--">Prev</button>
        <button @click="pagination.page++">Next</button>
      </li-->
    </v-select>
    <b-form-invalid-feedback v-if="msg && msg.text">
      {{msg.text}}
    </b-form-invalid-feedback>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import { createPopper } from '@popperjs/core'

export default {
  name: 'field-select',
  components: { vSelect },
  props: ['id', 'options', 'value', 'placeholder', 'msg', 'multiple', 'change', 'name', 'disabled', 'reduce', 'clearable', 'max', 'specialVerification', 'mainColor', 'searchOnType', 'loading', 'pagination', 'search'],
  data () {
    return {
      showIcon: false,
      hasEvent: false,
      noResults: false,
      myValue: undefined,
      myOptions: [],
      searched: undefined,
      keySelect: 0
    }
  },
  watch: {
    value () {
      this.searched = ''
      this.myValue = this.value
    },
    options (options) {
      this.myOptions = this.options
      this.showIcon = this.myOptions && options.findIndex(option => !!option.icon) !== -1
    }
  },
  methods: {
    filter (options, search) {
      return search.length ? options.filter(el => {
        return el.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(search.toLowerCase()) !== -1 ||
          el.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1 ||
          el.text.toLowerCase().indexOf(search.toLowerCase()) !== -1
      }) : options
    },
    isSelected (_id) {
      if (!this.myValue) return false
      else if (this.multiple) return this.myValue.findIndex(({id}) => id === _id) !== -1
      else return this.myValue.id === _id
    },
    validateShowText (search, searching, code) {
      switch (code) {
      case 'no-match-normal': 
        return searching && !!search && 
        (
          !this.searchOnType || 
          (this.searchOnType.manualSearch && search.length >= (this.searchOnType.nChars || 1)) || 
          (this.noResults && this.searchOnType && search.length >= (this.searchOnType.nChars || 1))
        )
    
      case 'no-options-normal': 
        return !searching && !this.searchOnType
        
      case 'search-match': 
        return this.searchOnType && search.length >= (this.searchOnType.nChars || 1) && !this.noResults
    
      case 'invalid-length': 
        return this.searchOnType && search.length < (this.searchOnType.nChars || 1)
    
      default:
        return false
      }
    },
    handlers (map, vm) {
      // if (!this.hasEvent && this.searchOnType) {
      //   this.hasEvent = true
      //   const myElement = vm.$el.querySelector('.vs__dropdown-toggle > .vs__selected-options > input')
      //   if (this.searchOnType.persistSearch) {
      //     // this.myValue = this.searched
      //     myElement.value = this.searched
      //   }
      //   myElement.addEventListener('keyup', (e) => {
      //     this.myOptions = []
      //     if (myElement.value && myElement.value.length >= parseInt(this.searchOnType.nChars || 3)) {
      //       if (this.searchOnType.allowSearchAsValue) this.myValue = myElement.value
      //       this.searched = myElement.value
      //       this.noResults = false
      //       this.$debounce(vm.$el.querySelector('.vs__dropdown-toggle').id, () => {
      //         this.searchOnType.fx(myElement.value)
      //           .then(resp => {
      //             if (resp.length > 0) {
      //               this.myOptions = ([]).concat(resp)
      //             } else {
      //               this.noResults = true
      //             }
      //           })
      //           .catch(err => {
      //             this.noResults = true
      //           })
      //       }, this.searchOnType.debounce)
      //     }
      //   })
      // }
      return {
        ...map
      }
    },
    onChange () {
      if (this.specialVerification) this.myValue = this.specialVerification(this.myValue)
      if (this.multiple && this.max && this.myValue && this.myValue.length > this.max) {
        this.myValue = this.myValue.slice(0, this.max)
        // this.msg.text = `Solo puede seleccionar ${this.max} opciones`
        // this.msg.type = 'danger'
      } else {
        // this.msg = { text: '', type: '' }
      }
      this.$emit('update:value', this.myValue)
      if (this.change) this.change(this.name, this.myValue)
    },
    onSearchFocus () {
      if (this.searchOnType?.persistSearch) {
        const prevSearch = this.searched
        const myElement = document.querySelector(`#${this.id} .vs__dropdown-toggle > .vs__selected-options > input`)
        setTimeout(() => {
          if (!!prevSearch) {
            document.querySelector(`#${this.id}`).classList.add('vs--searching')
            myElement.value = prevSearch
            // this.onSearch(prevSearch)
          }
        }, 0)
      }
    },
    onSearchBlur () {
      if (this.searchOnType?.allowSearchAsValue && !this.myValue?.id) this.myValue = this.searched
    },
    onSearch (search) {
      if (search && search.length >= parseInt(this.searchOnType.nChars || 3)) {
        this.searched = search
        this.noResults = false
        if (this.searchOnType.manualSearch) {
          this.$emit('update:loading', true)
          this.$debounce(document.querySelector(`#${this.id} .vs__dropdown-toggle`).id, () => {
            this.searchOnType.fx(this.name, search)
          }, this.searchOnType.debounce)
        } else  {
          this.$debounce(document.querySelector(`#${this.id} .vs__dropdown-toggle`).id, () => {
            this.searchOnType.fx(search)
              .then(resp => {
                if (resp.length > 0) {
                  this.myOptions = [...([]).concat(resp)]
                } else {
                  this.noResults = true
                }
                // this.keySelect++
              })
              .catch(err => {
                this.noResults = true
              })
          }, this.searchOnType.debounce)
        }
      }
    },
    setPositionList (dropdownList, component, {width}, mainColor) {
      dropdownList.style.width = width
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset', options: {
              offset: [0, -1]
            }
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn ({state}) {
              const { popper } = state.elements
              component.$el.classList.toggle('drop-up', state.placement === 'top')
            }
          }]
      })
      return () => popper.destroy()
    }
  },
  mounted () {
    this.myOptions = this.options
    this.myValue = this.value
    this.showIcon = this.myOptions && this.myOptions.findIndex(option => option.icon) !== -1

  }
}
</script>
<style lang="scss">
div[fieldtype="FieldSelect"] > .invalid-feedback{
  display: block !important;
}
.vs__dropdown-menu {
  z-index: 1040 !important;
}
.v-select.is-invalid > .vs__dropdown-toggle{
  border: var(--danger) 1px solid;
}
.v-select.is-invalid{
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23ea5455'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23ea5455' stroke='none'/%3E%3C/svg%3E");
  background-position-x: calc(100% - 20px);
  background-position-y: 0.8rem, 2rem;
  background-size: 15px 15px, calc(0.725em + 0.438rem) calc(0.725em + 0.438rem);
  background-repeat: no-repeat, no-repeat;
  background-color: rgb(255, 255, 255);
}
.v-select:not(.select-multiple)>.vs__dropdown-toggle>.vs__selected-options>.vs__selected {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}.v-select>.vs__dropdown-toggle>.vs__selected-options {
    width: calc(100% - 50px);
    min-height: 30px;
}
</style>
