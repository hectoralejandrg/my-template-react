<template>
  <div>
    <span v-for="(action, index) in myActions" :key="index">
      <span class="px-05 cursor-pointer hover-text-special" :class="`hvr text-${action.color}`"  @click="() => action.action(data.item.id)"
      v-if="!action.dependency || (action.dependency && data.item[action.dependency])"
      >
        <span v-if="!action.typeIcon || action.typeIcon === 'feather'">
        <feather-icon :icon="generateIconClasses(action, data).icon" :class="[generateIconClasses(action, data).classes, action.iconClass]"
          v-b-tooltip.hover
          :title="$t(action.dualState ? (action.switchOwnId && data.item[action.switchOwnId] ? action.dualState.on || '' : action.dualState.off || '') : (action.text || ''))"/>
          </span>
        <span v-if="action.typeIcon === 'fa' || action.typeIcon === 'far' || action.typeIcon === 'fas'">
        <font-awesome-icon :icon="[action.typeIcon, action.icon]"/>
        </span>
      </span>
    </span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'table-render-actions',
  props: ['actions', 'data'],
  data () {
    return {
      myActions: []
    }
  },
  computed: {
    ...mapGetters({
      modularPermissions: 'getModularPermissions'
    })
  },
  watch: {
    modularPermissions () {
      this.myActions = this.$filterUsingPermission(this.actions, this.modularPermissions)
    },
    actions () {
      this.myActions = this.$filterUsingPermission(this.actions, this.modularPermissions)
    }
  },
  mounted () {
    this.myActions = this.$filterUsingPermission(this.actions || [], this.modularPermissions)
  },
  methods: {
    generateIconClasses (action, data) {
      const obj = {
        classes: '',
        icon: ''
      }
      if (action.switchOwnId) {
        if (!(data.item[action.switchOwnId] === true || data.item[action.switchOwnId] === false)) {
          obj.classes += 'spinner'
          obj.icon = 'LoaderIcon'
          return obj
        }
        if (data.item[action.switchOwnId]) {
          obj.classes += 'is-switch-true '
          if (action.dualState && action.dualState.iconOn) {
            obj.icon = action.dualState.iconOn
          }
        }
        if (!(action.switchOwnId && data.item[action.switchOwnId])) {
          obj.classes += 'is-switch '
          if (action.dualState && action.dualState.iconOff) {
            obj.icon = action.dualState.iconOff
          }
        }
      } else {
        obj.icon += action.icon
      }
      return obj         
    }
  }
}
</script>
<style lang="">
  
</style>