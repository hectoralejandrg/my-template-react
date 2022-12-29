<template>
  <section id="dashboard">
    <b-row class="match-height">
      <b-col v-if="isAdmin"
        xl="6"
        md="6"
      >
        <b-button @click="getJSON">Aqui</b-button>
        <field-input :value.sync="collection" name="collection"/>
        <field-input :value.sync="doc" name="doc"/>
        <form-render :form.sync="form" :fields="fields" @send="send" :buttonSend="buttonSend"/>
        <pre>{{json}}</pre>
      </b-col>
      <b-col
        xl="6"
        md="6"
      >
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { BRow, BCol } from 'bootstrap-vue'

import { getUserData } from '@/auth/utils'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BRow,
    BCol
  },
  data() {
    return {
      data: {},
      collection: '',
      doc: '',
      json: '',
      buttonSend: {icon: 'SearchIcon', color: 'warning', title: 'Filtrar'},
      isAdmin: false,
      form: { name: !true },
      fields: [{fieldType: 'FieldCheckbox', name: 'name', options:[{id:true, text: 'true'}]}]
    }
  },
  computed: {
    ...mapGetters({
      mySession: 'getSession'
    })
  },
  watch: {
    mySession () {
      if (this.mySession.id) this.isAdmin = ['admin', 'superadmin'].includes(this.$session.get('cas_user').role)
    }
  },
  mounted () {
    if (this.mySession.id) this.isAdmin = ['admin', 'superadmin'].includes(this.$session.get('cas_user').role)
  },
  created() {
    // data
  },
  methods: {
    send (form) {
      console.log(form)
    },
    getJSON () {
      console.log(this.collection, this.doc)
      this.$root.$data.db.collection(this.collection).doc(this.doc).onSnapshot(resp => {
        this.json = JSON.stringify(resp.data(), undefined, 4)
      })
    },
    clickAbility () {
      // console.log(useJwt.generateAbility(this.$session.get('cas_user').permissions))
      // this.$store.dispatch('fetchPermissions', {permissions: this.$session.get('cas_user').permissions})
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '@core/scss/vue/libs/chart-apex.scss';
</style>
