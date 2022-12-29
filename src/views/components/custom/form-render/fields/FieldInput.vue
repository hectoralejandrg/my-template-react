<template>
  <div>
    <component :is="optionGroup ? 'b-input-group' : 'b-form-group'"
      v-bind="optionGroup"
    >
      <b-form-input
        :placeholder="placeholder"
        :type="myType || 'text'"
        :class="[!!action? 'with-action' : '']"
        :name="name"
        :disabled="disabled"
        v-model="myValue"
        @input="onChange"
        @blur="onBlur"
        :options="options"
        :min="min"
        :max="max"
        :state="(typeof msg === 'undefined') ? undefined : false"
      />
      
      <b-input-group-append is-text v-if="type === 'password'">
        <feather-icon
          :icon="passwordToggleIcon"
          class="cursor-pointer"
          @click="togglePassword"
        />
      </b-input-group-append>
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
  props: ['value', 'placeholder', 'type', 'msg', 'clearable', 'disabled', 'change', 'name', 'action', 'min', 'max', 'optionGroup', 'options', 'specialVerification', 'blur', 'changeDebounce'],
  name: 'field-input',
  data () {
    return {
      myValue: undefined,
      myType: undefined,
      myOptionGroup: undefined
    }
  },
  watch: {
    value () {
      this.myValue = this.value
    },
    type () {
      this.myType = this.type
    },
    optionGroup () {
      this.myOptionGroup = this.optionGroup
    }
  },
  mounted () {
    this.myValue = this.value
    this.myType = this.type
  },
  computed: {
    passwordToggleIcon () {
      return this.myType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    }
  },
  methods: {
    clean () {
      this.myValue = ''
      this.onChange()
    },
    togglePassword () {
      this.myType = this.myType === 'password' ? 'text' : 'password'
    },
    onBlur () {
      if (this.blur) this.blur(this.name, this.myValue)
    },
    onChange () {
      if (this.specialVerification) this.myValue = this.specialVerification(this.myValue)
      this.$debounce(name, () => {
        this.$emit('update:value', this.myValue)
        if (this.change) this.change(this.name, this.myValue)
      }, (this.changeDebounce || 0))
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
</style>
