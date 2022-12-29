<template>
  <div>
    Logeado
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
    
  </div>
</template>
<script>
export default {
  name: 'external-login',
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
    window.addEventListener('message', async event => {
      if (event.data.madagascarCommand === 'login') {
        this.$root.$data.auth
          .signInWithCustomToken(event.data.token)
          .then((data) => {
            this.loggedUser = data.user
            return data.user.getIdToken()
          })
          .then((token) => {
            this.$store.dispatch('fetchUserData', {id: this.loggedUser.uid, token, from: 'external', remember: true, onSuccess: () => this.goto()})
            
            
          })  
      }
    })
    if (window.addEventListener) {
      let index = 0
      const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13]
      window.addEventListener('keydown', (e) => {
        if (e.keyCode === konami[index])
        {
          index++ //valid key at the valid point

          if (index === konami.length)
          {
            // alert('Correct')
            this.isOk = true
          } else {
            // alert('Keep going')
          }
        } else {
          // incorrect code restart
          index = 0
          // alert('Wrong') 
        }
      })
    }
  },
  methods: {
    goto () {
      window.parent.postMessage({madagascarCommand: 'logged', uid: this.loggedUser.uid}, '*')
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