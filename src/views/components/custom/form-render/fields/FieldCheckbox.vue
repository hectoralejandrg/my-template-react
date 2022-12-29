<template>
  <div>
    <b-form-group>
      <b-form-checkbox
        v-for="option in options"
        :key="option.id"
        :value="option"
        v-model="myValue"
        v-if="option.visible || typeof option.visible === 'undefined'"
        :class="[option.class, optionClass]"
        @change="onChange"
        :name="name"
        :disabled="disabled"
        :inline="align === 'h'"
        :state="(typeof msg === 'undefined') ? undefined : false"
      >
        {{ option.text }}
      </b-form-checkbox>
      <b-form-invalid-feedback v-if="msg && msg.text">
        {{msg.text}}
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>
<script>
export default {
  name: 'field-checkbox',
  props: ['options', 'value', 'align', 'msg', 'disabled', 'change', 'name', 'optionClass', 'multiple'],
  data () {
    return {
      myValue: [],
      myOptions: []
    }
  },
  mounted () {
    this.setChecked()
  },
  watch: {
    value: {
      handler() {
        this.setChecked()
      }, deep: true
    },
    options () {
      this.setChecked()
    }
  },
  methods: {
    setChecked () {
      // console.log(this.options, this.value, this.myValue)
      if (!!this.multiple) {
        this.myOptions = this.options
        const currentValue = this.value && this.options ? this.options.filter(({id}) => this.value.findIndex(val => val.id === id) !== -1) : []
        this.myValue = this.$getUniqueList(currentValue.concat(this.value), 'id')
      } else {
        this.myValue = !!this.value?.id || this.value ? this.options[0] : []
      }
    },
    onChange (as, ds) {
      let returnValue = this.myValue
      if (!this.multiple) returnValue = !!returnValue[0] || !!returnValue
      this.$emit('update:value', returnValue)
      if (this.change) this.change(this.name, returnValue)
    }
  }
}
</script>
<style lang="scss">
</style>
