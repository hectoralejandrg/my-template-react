<template>
  <div>
    
    <b-form-textarea
      v-model="myValue"
      @input="onChange"
      :placeholder="placeholder" 
      class="char-textarea"
      :class="[msg? msg.type : '', myValue && myValue.length > maxLength ? 'text-danger' : '']"
      :maxlength="maxLength"
      :rows="rows"
      :state="(typeof msg === 'undefined') ? undefined : false"
      :disabled="disabled"
    ></b-form-textarea>
    <small v-if="!!maxLength"
      class="textarea-counter-value float-right"
      :class="myValue && myValue.length > maxLength ? 'bg-danger' : ''"
    >
      <span class="char-count">{{ myValue ? myValue.length : 0 }}</span> / {{ maxLength }}
    </small>
    <b-form-invalid-feedback v-if="msg && msg.text">
      {{msg.text}}
    </b-form-invalid-feedback>
  </div>
</template>
<script>
export default {
  props: ['maxLength', 'value', 'placeholder', 'msg', 'disabled', 'change', 'name', 'rows'],
  name: 'field-textarea',
  data () {
    return {
      counterDanger: true,
      myValue: undefined
    }
  },
  watch: {
    value () {
      this.myValue = this.value
    }
  },
  mounted () {
    this.myValue = this.value
  },
  methods: {
    onChange (e) {
      this.$emit('update:value', this.myValue)
      if (this.change) this.change(this.name, this.myValue)
    }
  }
}
</script>
<style lang="scss">
</style>
