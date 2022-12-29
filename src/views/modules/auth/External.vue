<template>
  <div>
    External
    <div v-if="isOk">
      
    
      <field-textarea :value.sync="json" name="json"/>
      <field-input :value.sync="collection" name="collection"/>
      <field-input :value.sync="doc" name="doc"/>
      <b-button @click="saveJSON">Aqui</b-button>
      
      <field-input :value.sync="collection" name="collection"/>
      <field-input :value.sync="doc" name="doc"/>
      <b-button @click="getJSON">Aqui</b-button>
      <pre>{{json}}</pre>
    </div>
    <b-button @click="logout">-</b-button>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
// import services from './services'
// import { environment } from '@/environments/environment'
export default {
  name: 'external',
  data () {
    return {
      loggedUser: {},
      collection: '',
      doc: '',
      json: '',
      isOk: false
    }
  },
  mounted () {
    // this.getUniqueServices()
    const params = {
      ...this.$route.params
    }

    delete params.token
    delete params.module
    this.$root.$data.auth
      .signInWithCustomToken(this.$route.params.token)
      .then((data) => {
        this.$root.$data.auth.setPersistence(this.$root.$data.fb.auth.Auth.Persistence.LOCAL)
        this.loggedUser = data.user
        return data.user.getIdToken()
      })
      .then((token) => {
        this.$store.dispatch('fetchUserData', {id: this.loggedUser.uid, token, from: 'external', remember: true})
        // this.goto(this.$route.params, 'mounted')
      })
  },
  methods: {
    // getUniqueServices () {
    //   const myArray = []
    //   services.map(el => {
    //     if (!myArray.find(el2 => el2.service === `${environment[el.base]}${el.url}`) && !['sfApiUrl', 'enviameApiUrl', 'platformUrl'].includes(el.base)) {
    //       myArray.push({ method: el.method, service: `${environment[el.base]}${el.url}`, order: `${environment[el.base]}${el.url}${el.method}`})
    //     }
    //   })
    //   myArray.sort((a, b) => a.order < b.order ? 1 : -1)
    //   console.log(JSON.stringify(myArray.map(el => ({ method: el.method, service: el.service}))))
    // },
    logout() {
      this.$root.$data.auth.signOut()
        .then(resp => {
          Cookies.remove('session_id')
          console.log(resp)
        })
    },
    goto (params, origin) {
      console.log(origin, {...params})
      if (params.module) this.$router.push({name: params.module, params: { company: params.param1 } })
    },
    saveJSON () {
      this.$root.$data.db.collection(this.collection).doc(this.doc).set(JSON.parse(this.json))
        .then(resp => {
          this.$success('Guardado')
        })
        .catch(err => {
          this.$alert('No guardado')
        })
    },
    getJSON () {
      console.log(this.collection, this.doc)
      this.$root.$data.db.collection(this.collection).doc(this.doc).onSnapshot(resp => {
        this.json = JSON.stringify(resp.data(), undefined, 4)
      })
    }
  }
}
</script>
<style lang="">
  
</style>