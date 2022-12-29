<template>
  <div class="table-render-skeleton" >
    <div :id="id">
      <b-table responsive="sm" :key="innerKey" :items="myRows" 
      @sort-changed="sortChanged"
      :fields="showCheckboxes ? [{label: '', key: 'showCheckbox', sortable: false, class: 'w-checkbox-table'}].concat(mySchema) : mySchema" 
      :busy="loading"
      :sort-by.sync="mySortBy"
      :sort-desc.sync="mySortDesc"
      :sort-direction="mySortDirection" show-empty
      :selectable="markRow"
      :striped="striped"
      @row-selected="onRowSelected"
      :sticky-header="stickyHeader"
      :ref="`ref${id}`"
      :class="[tableClass, { 'table-markCol': markCol }]">
      
        <template #empty="">
          <span class="text-center w-full push-left">{{ 'No se encontraron registros para mostrar' }}</span>
        </template>
        <template #table-colgroup="scope">
          <col
            v-for="field in scope.fields"
            :key="field.key"
            :style="{ ...field.style }"
          >
        </template>
        <template #cell()="data" @click="markRow === data.item.id ? setRowMarked(data.item.id) : null"
          :class="[...(field.class || [])]" >
          <span v-if="data.field.useSlot" :id="`${data.field.key}_${data.item.id}`" :currentValue="data.value" :canGroupBy="data.item.group_key"><slot :name="data.field.key" :rowdata="data.item">
          </slot></span>
          <span :id="`${data.field.key}_${data.item.id}`" :currentValue="data.value" :canGroupBy="data.item.group_key" v-else-if="data.value || data.value === 0" v-html="data.value"></span>
          <span :id="`${data.field.key}_${data.item.id}`" :currentValue="data.value" :canGroupBy="data.item.group_key" v-else-if="!noFillVoid" class="no-info">{{$t(' - ')}}</span>
        </template>
        <template v-if="showCheckboxes" #cell(showCheckbox)="data"
          :class="field.class">
          <b-form-checkbox
            :id="`${data.item.id}`"
            :name="`${data.item.id}`"
            :value="data.item.id"
            v-model="mySelectedRows"
          >
          </b-form-checkbox>
        </template>
        <template #head()="data">
          <span @click="markCol ? setColMarked(data.field.key) : null" :class="{'cursor-pointer' : markCol }">
            <span v-if="!data.field.onlyIcon">{{ !data.field.noTranslate ? $t(data.field.label) : data.field.label }}</span>
            <feather-icon v-if="data.field.icon && !data.field.onlyIcon" :icon="data.field.icon" v-b-tooltip.top :title="!data.field.noTranslate ? $t(data.field.text) : data.field.text"/>
            <feather-icon v-if="data.field.icon && data.field.onlyIcon" :icon="data.field.icon" v-b-tooltip.top :title="!data.field.noTranslate ? $t(data.field.label || data.field.text) : (data.field.label || data.field.text) "/>
          </span>
        </template>
        <template v-if="showCheckboxes" #head(showCheckbox)=""
          :class="field.class">
          
          <b-form-checkbox
            v-model="selectedAll"
            :indeterminate="indeterminate"
            @change="() => selectAll(selectedAll)"
          >
          </b-form-checkbox>
        </template>
        
        <template #thead-top="" v-if="topSchema">
          <b-tr v-for="(subSchema, index1) in topSchema" :key="`topSchema_${index1}`">
            <b-th v-for="(cell, index2) in subSchema" :key="`topSchema_${index1}_${index2}`" :colspan="cell.colspan || 1" :variant="cell.variant || ''">
              <span :class="cell.class">{{$t(cell.label)}}</span>
            </b-th>
          </b-tr>
        </template>
        <template #cell(actions)="data">
          <table-render-actions :actions="actions" :data="data"></table-render-actions>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import { BTable, BTr, BTh } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
/**
 * Un hermoso renderizador de tablas
 */
export default {
  name: 'table-render',
  components: {
    BTable, BTr, BTh
  },
  //nota: si usamos firebase procesaremos cada fila con .data()
  props: ['rows', 'schema', 'topSchema', 'id', 'showCheckboxes',
    'actions', 'loading', 'selectedRows', 'noFillVoid', 'sortBy', 'sortDesc', 'sortDirection', 'markRow', 'markCol', 'tableClass', 'striped', 'stickyHeader',
    'groupBy'],
  data () {
    return {
      indeterminate: false,
      selectedAll: false,
      mySelectedRows: undefined,
      mySortBy: undefined,
      mySortDesc: undefined,
      mySortDirection: undefined,
      innerSelectedRows: [],
      mySchema: [],
      myRows: [],
      innerKey: 0
    }
  },
  computed: {
    ...mapGetters({
      modularPermissions: 'getModularPermissions'
    })
  },
  watch: {
    modularPermissions () {
      this.mySchema = this.$filterUsingPermission(this.schema, this.modularPermissions)
    },
    loading () {
      if (this.loading) {
        // this.$vs.loading({container: `#${this.id}`})
      } else {
        // this.$vs.loading.close(`#${this.id} > .con-vs-loading`)
      }
    },
    schema () {
      this.mySchema = this.$filterUsingPermission(this.schema, this.modularPermissions)
    },
    sortBy () {
      this.mySortBy = this.sortBy
    },
    sortDesc () {
      this.mySortDesc = this.sortDesc
    },
    sortDirection () {
      this.mySortDirection = this.sortDirection
    },
    mySortBy () {
      this.$emit('update:sortBy', this.mySortBy)
      this.generateMyRows('mySortBy')
    },
    mySortDesc () {
      this.$emit('update:sortDesc', this.mySortDesc)
      this.generateMyRows('mySortDesc')
    },
    mySortDirection () {
      this.$emit('update:sortDirection', this.mySortDirection)
      this.generateMyRows('mySortDirection')
    },
    selectedRows () {
      this.mySelectedRows = this.selectedRows
    },
    mySelectedRows () {
      this.indeterminate = !this.mySelectedRows || !this.rows || (this.mySelectedRows.length !== this.rows.length && this.mySelectedRows.length > 0)
      this.selectedAll = !this.indeterminate && this.mySelectedRows && this.rows && this.mySelectedRows.length === this.rows.length && this.rows.length > 0
      this.$emit('update:selectedRows', this.mySelectedRows)
    },
    rows () {
      this.myRows = [...(this.rows || [])]
    },
    myRows () {
      this.generateMyRows('watch')

    }
  },
  mounted () {
    this.mySortBy = this.sortBy
    this.mySortDesc = this.sortDesc
    this.mySortDirection = this.sortDirection
    this.myRows = [...(this.rows || [])]
    this.mySelectedRows = this.selectedRows
    this.mySchema = this.$filterUsingPermission(this.schema || [], this.modularPermissions)
    this.generateMyRows('mounted')
  },
  methods: {
    sortChanged (a, b) {
      // console.log(a, b)
    },
    generateMyRows (origin) {
      if (this.groupBy) {
        const myRows = []
        // let prev = null
        // let rowspan = 1
        const currentRows = [...this.rows]
        
        if (document.querySelector('.special-hidden')) {
          document.querySelectorAll('.special-hidden').forEach(element => {
            element.classList.remove('special-hidden')
            element.classList.remove('hidden')
          })
          document.querySelectorAll('.has-rowspan').forEach(element => {
            element.classList.remove('has-rowspan')
            element.setAttribute('rowspan', '1')
          })
        }
        let prevValue = ''
        let prevId = ''
        let prevGroup = ''
        let rowspan = 1
        setTimeout(() => {
          document.querySelectorAll('table > tbody > tr > td > span').forEach(el => {
            console.log()
            if (el.id.split('_')[0] === this.groupBy) {
              if (el.attributes.currentValue?.nodeValue === prevValue && el.attributes.canGroupBy?.nodeValue === prevGroup && prevGroup !== '') {
                rowspan++
                document.querySelector(`#${prevId}`).closest('td').setAttribute('rowspan', rowspan)
                document.querySelector(`#${prevId}`).closest('td').classList.remove('has-rowspan')
                document.querySelector(`#${prevId}`).closest('td').classList.add('has-rowspan')
                // if (rowspan > 2) this.rows[index][this.groupBy] = undefined
                document.querySelector(`#${el.id}`).closest('td').classList.add('hidden', 'special-hidden')
              } else {
                prevValue = el.attributes.currentValue?.nodeValue || ''
                prevGroup = el.attributes.canGroupBy?.nodeValue || ''
                prevId = el.id
                rowspan = 1
              }
            }
          })
        }, 0)
      }
    },
    currentItems () {
      return this.rows.map(row => {
        const myRow = {}
        Object.keys(row).map(key => {
          if (this.mySchema.map(el => el.ownId).includes(key) && key !== 'actions') {
            myRow[key] = row[key]
          }
        })
        return myRow
      })
    },
    selectAll (value, ogn) {
      this.selectedAll = value
      this.mySelectedRows = value === true ? this.rows.map(({id}) => id) : []
    },
    onRowSelected (items) {
      this.innerSelectedRows = items.map(el => el.id)
    },
    setColMarked (key) {
      const index = this.mySchema.findIndex(el => el.key === key)
      if (Array.isArray(this.mySchema[index].class) && this.mySchema[index].class.includes('cell-marked')) {
        this.mySchema[index].class = this.mySchema[index].class.filter(el => el !== 'cell-marked')
      } else {
        this.mySchema[index].class = ['cell-marked', 'cursor-pointer'].concat(this.mySchema[index].class)
      }
      // this.innerKey++
      this.mySchema = [...this.mySchema]
      // if (this.innerSelectedRows.length > 0) {
      //   this.innerSelectedRows.map(id => {
      //     this.$refs[`ref${this.id}`].selectRow(id)
      //   })
      // }
    }
  }
}
</script>

<style lang="scss">
@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css);
[dir] .table th, [dir] .table td {
    padding: 0.72rem 1.3rem 0.72rem 0.8rem !important;
}
.table.b-table {
  color: #6e6b7b !important;
  > thead > tr {
    background-color: #f3f2f7;
    > * {
      
      vertical-align: middle;
      > * {
          text-transform: capitalize !important;
          font-size: 1rem;
      }
    }
  }
  > * > tr {
    > * {
      vertical-align: middle;
    }
    > *:last-child {
      padding-right: 1.6rem !important;
    }
    > *:first-child {
      padding-left: 1.6rem !important;
    }
  }
}
td.wrappable-text > span {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
   -webkit-box-orient: vertical;
  //  padding: 0.75rem 0.75rem 0 0.75rem !important;
}
// table.b-table[aria-busy='true']{
//   height: 50vh;
// }
// .b-table-busy-slot > td{
//   height: 50vh;
// }
.is-switch {
  color:gray;
}
.is-switch-true:hover,
.is-switch-true {
  color: #11c611 !important;
}
.btn:focus.is-switch, .btn.focus.is-switch,
.btn:focus.is-switch-true, .btn:focus.is-switch-true{
  box-shadow: none;
}
.w-checkbox-table{
  width: 68px;
}
.no-info{
  vertical-align: middle;
  padding-left: 50%;
  color: #c2c2c2 !important;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
.cell-marked, .b-table-row-selected > td{
  background: #4A7BBE30 !important
}
.cell-marked-2{
  background: #4A7BBE30 !important
}
.table-markCol > table th {
  cursor: pointer;
  > span {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
