<template>
  <div>
      <b-table
        :key="keyTable"
        striped
        responsive
        class="mb-0"
        :fields="schema"
        :items="permissionsData"
      >
        <template #cell(id)="data">
          {{ data.value }}
        </template>
        <template #cell(permissionType)="data">
        {{data.value}}
            <b-breadcrumb>
              <b-breadcrumb-item v-if="data.value.split('.')[0] === 'menu'">
                <feather-icon
                  icon="HomeIcon"
                  size="16"
                  class="align-text-top"
                />
              </b-breadcrumb-item>
              <b-breadcrumb-item
                v-for="item in getListBreadcrumb(data.value)"
                :key="item.text"
                :active="item.active"
                :to="item.to"
              >
              <feather-icon  v-if="!!item.icon" :icon="item.icon"/>
              <span v-if="!!item.text">{{ $t(calculateTextItem(item.text, data.value)) }}</span>
              </b-breadcrumb-item>
            </b-breadcrumb>
        </template>
        <template #cell(entities)="data">
          <slot name="entities" :rowdata="{'value': data.value, 'type': data.item.permissionType.split('.')[0], 'item': {...data.item, index: data.index}}"></slot>
        </template>
        <template #cell()="data">
          <b-form-checkbox
          v-if="(typeof permissionsData[data.index][data.field.key]) !== 'undefined'"
          :id="`${data.item.permissionType}_${data.index}_${data.field.key}`"
          :name="`${data.item.permissionType}_${data.index}_${data.field.key}`"
          :value="true"
          v-model="permissionsData[data.index][data.field.key]"
          @change="$emit('update:enableReset', true)" />
        </template>
        <template #cell(actions)="data">
          <table-render-actions :actions="actions" :data="data"></table-render-actions>
        </template>
      </b-table>
  </div>
</template>
<script>
import {
  BBreadcrumb, BBreadcrumbItem
} from 'bootstrap-vue'

export default {
  props: ['schema', 'permissionsData', 'actions', 'enableReset', 'type', 'concatKeys', 'selectors'],
  components: {
    BBreadcrumb,
    BBreadcrumbItem
  },
  data () {
    return {
      keyTable: 0,
      keyFormRender: 0
    }
  },
  methods: {
    calculateTextItem (currentText, original) {
      return currentText === '*' ? `${this.type}-*` : `${original.split('.')[0]}-${currentText}`
    },
    getListBreadcrumb (menus) {
      let prev = ''
      return menus.split('.').map((menu, index) => {
        if (menu.indexOf('*') !== -1) {
          return { text: '*', active: true }
        }
        let curr = `${index !== 0 && this.concatKeys ? `${prev}-` : ''}${menu}`
        curr = curr.replace('menu-', '')
        prev = menu
        return { text: curr, active: true }
      })
    }
  }
}
</script>
<style lang="scss">
  .button-save-permissions {
    top: -3.5rem !important;
    right: 0rem !important;
    position: absolute !important;
    z-index: 9;
  }
</style>