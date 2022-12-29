<template>
  <div>
    <v-date-picker class="v-date-picker w-full flex" v-model="myValue" @input="onChange" :masks="masks" v-bind="propsVCalendar || null"
      :class="msg && msg.type? msg.type : ''" :is-range="range? true : false" :attributes="attributes" :disabled="disabled">
      <template v-slot="{ showPopover }">
        <b-form-input v-if="!range" class="w-full" v-model="visibleValue"
          placeholder="dd-mm-yyyy"
          @keyup.enter="onConfirm"
          @blur="onConfirm"
          @focus="activateCalendar(showPopover)"/>
        <div v-if="range" class="container-range-input">
          <b-form-input class="start text-center" :class="clearable? 'wp-40' : 'wp-45'" v-model="visibleValueRange.start"
            @keyup.enter="onConfirmRange('start')" placeholder="dd-mm-yyyy"
            @blur="onConfirmRange('start')"
            @focus="(event) => activateCalendar(showPopover, true, event)"/>
          <feather-icon class="wp-10 mt-auto mb-auto" icon="ArrowRightIcon" size="2x"/>
          <b-form-input class="wp-45 end text-center" v-model="visibleValueRange.end"
            @keyup.enter="onConfirmRange('end')" placeholder="dd-mm-yyyy"
            @blur="onConfirmRange('end')"
            @focus="(event) => activateCalendar(showPopover, true, event)"/>
        </div>
      </template>
    </v-date-picker>
    <b-form-invalid-feedback v-if="msg && msg.text">
      {{msg.text}}
    </b-form-invalid-feedback>
    <span v-if="clearable" :style="{opacity: myValue? 1 : 0}" class="clean-input mt-auto mb-auto" @click="clearDates">
    </span>
  </div>

</template>
<script>
export default {
  name: 'field-datepicker',
  props: ['value', 'placeholder', 'range', 'msg', 'attributes', 'clearable', 'disabled', 'change', 'name', 'propsVCalendar'],
  data () {
    return {
      masks: {
        input: 'DD-MM-YYYY'
      },
      myValue: undefined,
      visibleValue: null,
      visibleValueRange: {start: null, end: null},
      currentContainer: null
    }
  },
  watch: {
    value () {
      this.myValue = this.value
    }
  },
  mounted () {
    this.myValue = this.value
    this.masks.input = this.format ? this.format : 'DD-MM-YYYY'
    this.setVisibleValues(this.myValue)
  },
  updated () {
    this.setVisibleValues(this.myValue)
  },
  methods: {
    activateCalendar (showPopover, isMulti, event) {
      showPopover({ placement: 'bottom' })
      if (isMulti) {
        this.currentContainer = event.currentTarget.parentElement
        this.currentContainer.classList += ' is-open'
      }
    },
    onChange () {
      this.setVisibleValues(this.myValue)
      this.$emit('update:value', this.myValue)
      if (this.change) this.change(this.name, this.myValue)
    },
    addZeros (value, max) {
      let val = `${value}`
      for (let i = val.length; i < max; i++) {
        val = `0${val}`
      }
      return val
    },
    getVisibleValue (value) {
      value = new Date(value)
      const month = this.addZeros(value.getMonth() + 1, 2)
      const day = this.addZeros(value.getDate(), 2)
      const year = this.addZeros(value.getFullYear(), 4)
      return `${day}-${month}-${year}`
    },
    onConfirmRange (type) {
      this.currentContainer.classList = 'container-range-input'
      if (this.visibleValueRange[type]) {
        const dateArray = this.visibleValueRange[type].split('-')
        const date = new Date(dateArray[2], parseInt(dateArray[1]) - 1, dateArray[0])
        this.visibleValueRange[type] = this.getVisibleValue(date)
        this.myValue = type === 'start' ? {...this.myValue, start: date} : {...this.myValue, end: date}
        if (this.visibleValueRange.start > this.visibleValueRange.end) {
          [this.visibleValueRange.start, this.visibleValueRange.end] = [this.visibleValueRange.end, this.visibleValueRange.start]
        }
        this.$emit('update:value', this.myValue)
      }
    },
    onConfirm () {
      if (this.visibleValue) {
        const dateArray = this.visibleValue.split('-')
        const date = new Date(dateArray[2], parseInt(dateArray[1]) - 1, dateArray[0])
        this.myValue = date
        this.visibleValue = this.getVisibleValue(date)
        this.$emit('update:value', this.myValue)
      }
    },
    setVisibleValues (val) {
      if (val) {
        if (!this.range) {
          this.visibleValue = this.getVisibleValue(val)
        } else {
          this.visibleValueRange.start = val.start ? this.getVisibleValue(val.start) : ''
          this.visibleValueRange.end = val.end ? this.getVisibleValue(val.end)  : ''
        }
      } else {
        this.clearDates()
      }
    },
    clearDates () {
      this.myValue = null
      this.visibleValue = null
      this.visibleValueRange = {start: null, end: null}
      this.$emit('update:value', this.myValue)
    }
  }
}
</script>
<style lang="scss">
div[fieldtype="FieldDatepicker"] > .invalid-feedback{
  display: block !important;
}
.container-range-input{
  float: left;
  display: flex;
  flex-direction: row;
  border-radius: 0.25rem;
  width: 100%;
  max-height: 37px;
  > input {
    &.form-control{
      max-height: 35px;
      box-shadow: none !important;
    }
    border: none !important;
    text-align: center;
  }
}
body.dark-layout .container-range-input{
  border: #404656 1px solid;
}
body:not(.dark-layout) .container-range-input{
  border: #ced4da 1px solid;
}
.container-range-input{
  background: transparent;
  transition: all 0.4s ease;
}
.v-date-picker > .container-range-input.is-open,
.v-date-picker > div > div > input:focus{
  border-color: #{var(--light)} !important;
  box-shadow: 0 3px 10px 0 #{var(--light-1)} !important;
}
$colors: ('primary','dark','danger','warning','success','special','theme','info','light');

@each $color in $colors {
  .v-date-picker.#{$color} > .container-range-input,
  .v-date-picker.#{$color} > div > div > input{
    border-color: var(--#{$color});
    box-shadow: 0 3px 10px 0 var(--#{$color}-1);
  }
}
</style>
