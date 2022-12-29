<template>
  <div id="paginator" class="card-body">
    <div class="col-sm-12">
      <div class="row">
        <div class="col-sm-12 show-paginator">
          <b-pagination
          v-model="pagination.page"
          :disabled="disabled"
          :total-rows="!noDigits? pagination.total : 99999"
          :per-page="pagination.limit"
          :limit="10"
          align="center"
          :class="[`pagination-${color || 'primary'}`, {'no-digits' : noDigits}]"
          :first-number="noDigits"
          :last-number="noDigits"
          :prev-text="noDigits ? $t('Anterior') : ''"
          :next-text="noDigits ? $t('Siguiente') : ''"
          :first-text="!noDigits ? $t('Primero') : ''"
          :last-text="!noDigits ? $t('Último') : ''"
        >
          <template #prev-text v-if="!noDigits">
            <feather-icon icon="ChevronLeftIcon"/>
          </template>
          <template #next-text v-if="!noDigits">
            <feather-icon icon="ChevronRightIcon"/>
          </template>
          </b-pagination>
        </div>
        <div v-if="!!showSize" class="col-sm-12 horizontal-center">
          <div class="show-size horizontal-center">
            <span>Mostrando </span>
            <field-select :disabled="disabled" class="paginator-size mx-2" :mainColor="color || 'primary'" :options="paginationSizes" :value.sync="mySize" :clearable="false" />
            <span v-if="!noDigits"> de {{pagination.total}} registros</span>
            <span v-else> registros</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pagination',
  props: ['pagination', 'color', 'noDigits', 'showSize', 'showGoto', 'disabled'],
  data () {
    return {
      paginationSizes: [{id: 3, text: 3}, {id: 10, text: 10}, {id: 20, text: 20}, {id: 50, text: 50}, {id: 100, text: 100}],
      mySize: {},
      goto: ''
    }
  },
  watch: {
    'pagination.page' () {
      this.goto = ''
    },
    'pagination.limit' () {
      this.mySize = {...this.paginationSizes.filter(({id}) => id === parseInt(this.pagination.limit))[0]}
    },
    mySize () {
      this.pagination.limit = this.mySize.id
    }
  },
  mounted () {
    if (this.paginationSizes.findIndex(({id}) => id === parseInt(this.pagination.limit)) === -1) this.paginationSizes.push({id: parseInt(this.pagination.limit), text: parseInt(this.pagination.limit)})
    this.mySize = {...this.paginationSizes.filter(({id}) => id === parseInt(this.pagination.limit))[0]}
  },
  methods: {
    setNewLimit (name, value) {
      this.pagination.limit = value.id
    }
  }
}
</script>
<style lang="scss">
// #paginator{
//   display: flex;
//   flex-direction: row;
// }
.show-size {
  float: left;
  display: flex;
  flex-direction: row;
  width: 300px;
  > * {
    float: left;
  }
  > span {
    margin: auto
  }
}

.show-goto {
  float: left;
  width: 100px;
}

.show-goto, .show-size{
  min-height: 1px;
}

.paginator-size {
  min-width: 70px;
  max-width: 70px;
  > .v-select > .vs__dropdown-toggle{
    border: none;
    border-radius: 0px;
  }
}
.no-digits{
  button.page-link[role="menuitemradio"],
  // li.page-item:first-child:not(.prev-item),
  // li.page-item:last-child:not(.next-item),
  li.page-item[role="separator"] {
      display: none;
  }
}
.page-item .page-link, .page-item.disabled .page-link {
  border: none;
  margin: 0;
  font-size: 1rem;
  min-width: 2.286rem;
  padding: .5rem .85rem;
  background-color: #f3f2f7;
  color: #6e6b7b;
}
.page-item.active {
  background-color: #f3f2f7;
  border-radius: 0;
}
.page-item.disabled > .page-link {
  color: #c2c2c2;
}

.page-item.active .page-link{
  border-radius: 5rem;
  color: #fff!important;
  font-weight: 600;
    
}
.page-item:first-child:not(.prev-item) .page-link {
  border-top-left-radius: 1.428rem;
  border-bottom-left-radius: 1.428rem;
}
.page-item:last-child:not(.next-item) .page-link {
  border-top-right-radius: 1.428rem;
  border-bottom-right-radius: 1.428rem;
}
.page-link:focus {
  box-shadow: none !important;
}

$colors: ('primary','dark','danger','warning','success','special','theme','info','light');;

@each $color in $colors {
  .pagination-#{$color} .page-item.active .page-link{
    background-color: rgba(var(--#{$color}),1);
  }
  .pagination-#{$color} .page-item .page-link:hover {
    color: rgba(var(--#{$color}),1);
  }
}
</style>