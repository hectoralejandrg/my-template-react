<template>
  <div>
    <component :is="optionGroup ? 'b-input-group' : 'b-form-group'"
      v-bind="optionGroup"
    >
      <b-form-input
        :placeholder="placeholder"
        type="text"
        autocomplete="off"
        :class="[!!action? 'with-action' : '']"
        :name="name"
        :disabled="disabled"
        v-model="myValue"
        @input="onSearch"
        @blur="onBlur"
        :state="(typeof msg === 'undefined') ? undefined : false"
      />
      <div class="main-box-autocomplete" v-if="showList && myValue">
        <div class="element-box-autocomplete text-center" v-if="noResults && !loadingList && searchOnType.nChar <= myValue.length">
          <span>{{$t('Sin coincidencias para')}} <em>{{ myValue }}</em>.</span>
        </div>
        <div class="element-box-autocomplete text-center" v-if="loadingList && searchOnType.nChar <= myValue.length">
          <span>
            {{$t('Buscando coincidencias para')}} <em>{{ myValue }}</em><br>
            <feather-icon icon="LoaderIcon" class="spinner m-1" size="2x"/>
          </span>
        </div>
        <div class="element-box-autocomplete text-center" v-if="myValue.length < searchOnType.nChar">
          <span>{{$t('msg-nchars', {key: searchOnType.nChars || 3})}}</span>
        </div>
        <div class="element-box-autocomplete" v-for="(option, index) in myOptions" :key="index" @click="() => onChange(option)">
          <span>{{option.text}}</span>
        </div>
      </div>
      <b-form-invalid-feedback v-if="msg && msg.text">
        {{msg.text}}
      </b-form-invalid-feedback>
    </component>
    <span v-if="clearable" :style="{opacity: myValue? 1 : 0}" class="clean-input mt-auto mb-auto" @click="clean">
    </span>
  </div>
</template>
<script>
export default {
  props: ['value', 'id', 'placeholder', 'msg', 'clearable', 'disabled', 'change', 'name', 'action', 'optionGroup', 'searchOnType'],
  name: 'field-autocomplete',
  data () {
    return {
      myValue: undefined,
      myOptionGroup: undefined,
      myOptions: [],
      showList: false,
      noResults: true,
      loadingList: false,
      isEditing: false
    }
  },
  watch: {
    value () {
      if (!this.isEditing) this.myValue = this.value?.text || ''
    },
    optionGroup () {
      this.myOptionGroup = this.optionGroup
    }
  },
  mounted () {
    this.myValue = this.value?.text || ''
  },
  methods: {
    clean () {
      this.myValue = ''
      this.onChange()
    },
    onBlur (e) {
      setTimeout(() => {
        this.showList = false
      }, 200)
    },
    onChange (option) {
      console.log('asd')
      this.myValue = option?.text || ''
      this.isEditing = false
      this.$emit('update:value', option)
      if (this.change) this.change(this.name, option)
      this.showList = false
    },
    onSearch (search) {
      // if (this.specialVerification) this.myValue = this.specialVerification(this.myValue)
      this.isEditing = true
      this.$emit('update:value', this.myValue)
      this.showList = true
      this.loadingList = true
      // const myElement = document.querySelector(`#${this.id} .vs__dropdown-toggle > .vs__selected-options > input`)
      this.myOptions = []
      if (search && search.length >= parseInt(this.searchOnType.nChars || 3)) {
        // this.searched = search
        this.noResults = false
        this.$debounce(this.id, () => {
          this.searchOnType.fx(search)
            .then(resp => {
              if (resp.length > 0) {
                this.myOptions = [...([]).concat(resp)]
              } else {
                this.noResults = true
              }
              this.loadingList = false
              // this.keySelect++
            })
            .catch(err => {
              this.loadingList = false
              this.noResults = true
            })
        }, this.searchOnType.debounce)
      }

      // this.$emit('update:value', { text: this.myValue })
      // if (this.change) this.change(this.name, { text: this.myValue })
    },
    removeField () {
      this.action.fx(this.name, this.myValue)
    }
  }
}
</script>
<style lang="scss">

span.clean-input {
    height: 0px;
    width: 100%;
    position: relative;
    display: block;
}

.clean-input::before{
    position: relative;
    z-index: 10;
    left: calc(100% - 25px);
    cursor: pointer;
    // padding: 5px;
    padding: 0px 7px;
    top: -27px;
    color: #6e6b7b;
    content: '';
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' viewBox='0 0 40 40' fill='none' stroke='gray' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-x w-4 h-4 mt-1'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
}
.main-box-autocomplete {
  position: absolute;
  background-color: white;
  // border: 1px solid transparent;
  overflow: hidden;
  width: calc(100% - 2rem);
  border-radius: 5px;
  z-index: 1;
  box-shadow: 0px 4px 25px 0px rgb(0 0 0 / 10%);
  > .element-box-autocomplete{
    cursor: pointer;
    padding: 0.5rem 1rem;
    &:hover {
      background: rgba(4, 67, 137, 0.12) !important;
      color: #044389 !important;
      white-space: nowrap;
    }
  }
}
</style>
