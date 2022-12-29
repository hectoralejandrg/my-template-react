<template>
  <div>
    <vue-editor v-model="myValue"></vue-editor>
  </div>
</template>
<script>

export default {
  props: ['maxLength', 'value', 'placeholder', 'msg', 'rows', 'disabled'],
  name: 'field-rte',
  data () {
    return {
      editor: null,
      counterDanger: true,
      myValue: undefined
    }
  },
  watch: {
    value () { 
      this.myValue = this.value
    },
    myValue () {
      this.$emit('update:value', this.myValue)
    }
  },
  mounted () {
    this.myValue = this.value
  }
}
</script>
<style lang="scss">

$colors: ('primary','dark','danger','warning','success','special','theme','info','light');;

@each $background, $text in $colors {
  .vs-component.vs-con-textarea.#{$background}{
    border: 1px solid var(--#{$background}) !important;
  }
}
</style>
