<template>
  <div>
    <b-form-group>
      <b-form-radio-group
        v-model="myValue"
        :options="options"
        value-field="id"
        :disabled="disabled"
        @change="onChange"
        :stacked="align !== 'h'"
      >
      </b-form-radio-group>
    </b-form-group>
  </div>
</template>
<script>
export default {
  props: ['options', 'value', 'align', 'msg', 'disabled', 'change', 'name'],
  name: 'field-radio',
  data () {
    return {
      myValue: null
    }
  },
  mounted () {
    this.setChecked()
  },
  watch: {
    value () {
      this.setChecked()
    }
  },
  methods: {
    setChecked () {
      this.myValue = this.value && this.value.id ? this.options.filter(({id}) => this.value.id === id)[0].id : this.myValue
    },
    onChange (val) {
      console.log(this.myValue)
      const valueUpdated = this.myValue ? this.options.filter(({id}) => this.myValue === id)[0] : {}
      this.$emit('update:value', valueUpdated)
      if (this.change) this.change(this.name, valueUpdated)
    }
  }
}
</script>
<style lang="scss">
div[fieldType="FieldRadio"] > fieldset {
  max-height: 38px;
}
// .custom-radio .custom-control-input:checked ~ .custom-control-label::after {
//     background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='-4 -4 7 7'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
// }
</style>
