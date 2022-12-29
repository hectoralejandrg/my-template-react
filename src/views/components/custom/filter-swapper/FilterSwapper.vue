<template lang="">
  <div>
    <div class="hide-on-medium-and-small">
      <div :class="`collapse-1-${id}`">
          <slot name="slot1"/>
      </div>
      <div :class="`collapse-2-${id} hidden`">
        <div class="row" :class="controlHeightButtons.class" :style="controlHeightButtons.style">
          <div class="col-sm-12">
            <div v-for="(btn, index) of buttons" :key="index" class="float-left" :class="btn.containerClass">
              <b-button :variant="`outline-${btn.color}`" @click="() => executeAction(btn)" v-if="!btn.options" :disabled="!!btn.disabled">
                <feather-icon v-if="btn.icon" :icon="btn.icon"/> {{$t(btn.text)}}
              </b-button>
              <b-dropdown v-else class="ml-5" v-b-tooltip.hover :title="$t('Más opciones')"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="light"> 
                <template #button-content><feather-icon icon="cogs"/></template>
                <b-dropdown-item v-for="(opt, index) of btn.options" :key="index"
                 @click="() => executeAction(opt)"><feather-icon v-if="opt.icon" :icon="opt.icon"/>{{ $t(opt.text) || '' }} </b-dropdown-item>
              </b-dropdown>
              <feather-icon v-if="btn.alert" icon="AlertCircleIcon" class="ml-05 text-danger" v-b-tooltip.hover :title="$t(btn.alert)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'filter-swapper',
  props: ['trigger', 'id', 'buttons', 'controlHeightButtons'],
  data () {
    return {
      showingActions: false
    }
  },
  methods : {
    executeAction (btn) {
      if (btn.action) btn.action()
    }
  },
  watch: {
    trigger () {
      if (!this.trigger) {
        this.$animateCSS(`.collapse-1-${this.id}`, 'fadeOut', 'faster').then(resp => {
          this.$animateCSS(`.collapse-2-${this.id}`, 'fadeIn', 'faster')
        })
      } else {
        this.$animateCSS(`.collapse-2-${this.id}`, 'fadeOut', 'faster').then(resp => {
          this.$animateCSS(`.collapse-1-${this.id}`, 'fadeIn', 'faster')
        })
      }
    }
  }
}
</script>
<style lang="scss">
.keypad-mobile{
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  > .keypad-menu,
  > div > .keypad-buttons > .keypad-no-opt{
    float: right;
    span{
      margin: .25rem;
      padding: .25rem;
      border-radius: 5px;
      top: 20px;
      float: left;
      position: relative;
    }
    button{
      margin-top: 0.5rem;
      &:hover + span{

      }
    }
  }
}
</style>