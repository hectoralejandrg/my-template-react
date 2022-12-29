<template>
  <div>
    <b-form-tags
      :class="['tags--height', showAdd? 'show-add' : '']"
      v-model="myValue"
      input-id="tags-remove-on-delete"
      :input-attrs="{ 'aria-describedby': 'tags-remove-on-delete-help' }"
      :tagPills="type === 'pills'"
      :placeholder="placeholder"
      remove-on-delete
      no-add-on-enter
      add-on-change
      @input="onInput"
      v-bind="tagsOption"
      :disabled="disabled"
      :separator="[' ', ',', ';'].concat(tagsOption.separator || [])"
      :tagVariant="color || 'primary'"
    />
  </div>
</template>
<script>
export default {
  name: 'field-tags',
  props: ['value', 'disabled', 'change', 'name', 'tagsOption', 'color', 'type', 'placeholder', 'showAdd', 'onEnter'],
  data () {
    return {
      myValue: [],
      lastValid: [],
      lastInvalid: [],
      lastDuplicated: []
    }
  },
  mounted () {
    this.myValue = this.value
  },
  watch: {
    value: {
      handler() {
        this.myValue = this.value
      }, deep: true
    }
  },
  methods: {
    // onTagState (valid, invalid, duplicate) {
    //   console.log(valid, invalid, duplicate)
    //   this.lastValid = valid
    //   this.lastInvalid = invalid
    //   this.lastDuplicated = duplicate
    // },
    // onChange (as, ds) {
    //   console.log(as, ds)
    // },
    // onKeydown (as, ds) {
    //   console.log(as, ds)
    // },
    onInput (as, ds) {
      this.$emit('update:value', this.myValue)
      if (this.change) this.change(this.name, this.myValue)
    }
  }
}
</script>
<style lang="scss">
.tags--height {
  min-height: 38px;
}

.b-form-tags:not(.show-add) .b-form-tags-list .b-from-tags-field button {
  display: none;
}
</style>
