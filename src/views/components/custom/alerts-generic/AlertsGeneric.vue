<template>
  <div :key="keyAlertRender">
    <b-alert v-for="(type) in filterTypesAttributes" v-if="checkLengthAlert(dataForFirestore[type.id])" :show="showAlert"  :key="type.id" 
      class="col-sm-12 mb-2"  :variant="type.text" dismissible v-height-fade fade>
      <div class="alert-body">
        <li v-if="validCountry(item)" v-for="(item, index) in dataForFirestore[type.id]" :key="index">{{item.text}}
        <feather-icon v-if="showButtons" class="marginEditIcon" icon="Edit2Icon" @click="openAlert(item , type)"/>
        <feather-icon v-if="showButtons" class="marginEditIcon" icon="TrashIcon" @click="confirmDeleteAlert(item , type)"/></li>    
      </div>
    </b-alert>
    <div v-if="showButtons" class="vertical-center">
      <b-button id="addAlert" @click="openModal" variant="outline-warning" class="push-left"><feather-icon icon="PlusIcon"/>{{$t('Añadir alerta')}}</b-button>
      <p class="card-text ml-1">{{$t('msg-información-alerta')}}</p>
    </div>
    <modal-alerts ref="modalAlerts" :typeAttributes="typeAttributes"  :countries="countries" :alert.sync="currentAlert" @send="saveAlert"></modal-alerts>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModalAlerts from './ModalAlerts.vue'
export default {
  name: 'alerts-generic',
  components: { ModalAlerts },
  props: ['country', 'idAlert'],
  data () {
    return {
      dataForFirestore: {},
      keyAlertRender: 0,
      showAlert: false,
      currentAlert: {},
      showButtons: false,
      typeAttributes: [
        {id: 'primary', text: 'primary', color: 'primary'},
        {id: 'secondary', text: 'secondary', color: 'secondary'},
        {id: 'success', text: 'success', color: 'success'},
        {id: 'danger', text: 'danger', color: 'danger'},
        {id: 'warning', text: 'warning', color: 'warning'},
        {id: 'info', text: 'info', color: 'info'},
        {id: 'light', text: 'light', color: 'light'},
        {id: 'dark', text: 'dark', color: 'dark'}
      ],
      filterTypesAttributes: null

    }
  },
  watch: {
    // Vigilamos que countries este lleno antes de mostrar el boton Agregar Alerta
    countries() { 
      this.showButtonForAdmin()
    },
    country () {
      this.keyAlertRender++
    }
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries'
    })
  },
  mounted() {
    this.getCollectionAlertsByDocumentTimeReal()
  },
  methods: {
    // Obtenemos información en tiempo real del documento existente en la coleccion 'Alerts'
    getCollectionAlertsByDocumentTimeReal () {
      const docRef = this.$root.$data.db.collection('alerts').doc(this.idAlert)
      docRef.onSnapshot((doc) => {
        if (doc.exists) {
          // Si el documento existe su información sera almacenada en la variable dataForFirestore
          this.dataForFirestore = {...doc.data(), id: doc.id}
        } else {
          // Si el documento no existe lo creamos vacio
          this.$root.$data.db.collection('alerts').doc(this.idAlert).set({})
            .then(() => {
              console.log('Nuevo documento creado!')
            })
            .catch((error) => {
              console.error('Error al guardar documento: ', error)
              this.$alert(this.$t('msg-problema-guardar', {code: error}))
            })
        }
        // Llamamos esta función para que filtre luego de traer la información
        this.listFilteredAttributeTypes()
        // Condicionamos el boton Agregar Alertas para que aparezca si ya se han cargado los paises
        if (this.countries && !!this.countries.length) {
          this.showButtonForAdmin()
        }
 
      }, (error) => {
        console.log('Error al cargar el documento:', error)
        this.$alert(this.$t('msg-problema-cargar', {code: error}))
      })
    },
    // Visualización del boton Agregar Alertas solo para usuarios con el rol 'admin'
    showButtonForAdmin() {
      if (['admin', 'superadmin'].includes(this.$session.get('cas_user').role)) {
        this.showButtons = true
      } 
    },
    // Filtramos el array de objetos con los tipos de alertas segun la data traída de Firestore
    listFilteredAttributeTypes () {
      this.filterTypesAttributes = this.typeAttributes.filter(type =>  Object.keys(this.dataForFirestore).includes(type.id))
      this.showAlert = !!this.filterTypesAttributes?.length
    },
    // Abrimos el modal y le seeteamos el country por el país selecionado en el selector
    openModal () {
      this.currentAlert = {country: !!this.country?.code ? this.country.code : undefined }
      this.$bvModal.show('modalAlerts')
    },
    // Abrimos el modal para edición y le seeteamos todos los valores ya obtenidos de Firestore
    openAlert (item, type) {   
      this.currentAlert = {...item, type}
      this.$bvModal.show('modalAlerts')
    },
    // Condicionamos el guardado de información segun la acción realizada sea Agregar o Editar
    saveAlert (data, id) {
      this.$refs.modalAlerts.loading = true
      if (!!data.id) this.updateUser(data)
      else this.addAlertCollection(data)
    },
    // Añadimos información al documento ya existente en Firestore sin sobreescibir los datos ya almacenados 
    addAlertCollection (data) {
      const type = data.form.type.text 
      // Creamos el objeto que deseamos agregar segun la información almacenada en el modal, para esto utilizamos arrayUnion()
      const newAlert = {
        [`${type}`]: this.$root.$data.newA(...[{
          country: data.form.country.map(el => el.code),
          text: data.form.alerts
        }])
      }
      const newArray = this.$root.$data.db.collection('alerts').doc(this.idAlert)
      // Como utilizamos el arrayUnion para agregar debemos utilizar el update segun la documentación 
      newArray.update(newAlert)
        .then(() => {
          this.$bvModal.hide('modalAlerts')
          this.currentAlert = {}
          this.keyAlertRender++
          const country = data.form.country.map(el => el.text)
          this.$success(this.$t('msg-exito-agregar-alerta', {tipo: type, pais: country.includes('Todos') ? 'todos los paises. Seleccione un país para visualizarla' : `${country.join(', ')}. Seleccione el país correspondiente para visualizarla`}))
          this.getCollectionAlertsByDocumentTimeReal()
        })
        .catch((error) => {
          console.error('Error al escribir documento: ', error)
          this.$alert(this.$t('msg-problema-guardar', {code: error}))
          this.$refs.modalAlerts.loading = false
        })
    },
    // Actualización individual en el documento ya existente en Firestore
    updateUser (data) {
      const type = data.form.type.text 
      // Creamos el objeto que deseamos eliminar segun la información antigua almacenada en el modal, para esto utilizamos arrayRemove()
      const removeAlert = {
        [`${data.typeEdit.text}`]: this.$root.$data.removeA(...[{
          country: data.countryEdit,
          text: data.id
        }])
      }
      // Creamos el objeto que deseamos agregar segun la información nueva almacenada en el modal, para esto utilizamos arrayUnion()
      const updateAlert = {
        [`${type}`]: this.$root.$data.newA(...[{
          country: data.form.country.map(el => el.code),
          text: data.form.alerts
        }])
      }
      // Batch para el manejo varias operaciones de escritura como un lote único
      const batch = this.$root.$data.db.batch()
      // Llamamos al documento
      const refDoc = this.$root.$data.db.collection('alerts').doc(this.idAlert)
      // Corremos la primera operación que seria remover el objeto antiguo 
      batch.update(refDoc, removeAlert)
      // Corremos la segunda operación que seria agregar el objeto nuevo
      batch.update(refDoc, updateAlert)
      // Confirmar el lote
      batch.commit()
        .then((resp) => {
          this.$bvModal.hide('modalAlerts')
          this.currentAlert = {}
          this.keyAlertRender++
          let country = null
          country = data.form.country.map(el => el.text)
          this.$success(this.$t('msg-exito-editar-alerta', {tipo: type, pais: country.includes('Todos') ? 'todos los paises.' : `${country.join(', ')}.`}))
          this.getCollectionAlertsByDocumentTimeReal()
        })
        .catch(error => {
          console.error('Error al actualizar documento: ', error)
          this.$alert(this.$t('msg-problema-guardar', {code: error}))
          this.$refs.modalAlerts.loading = false
        })
    },
    // Validamos que el país seleccionado solo muestre las alertas que cumplan con el filtrado 
    validCountry(item) {
      if (this.country === null) {
        return !item.country
      } else {
        const onlyCountry = item.country.filter(country => country.toLowerCase().includes(this.country.code.toLowerCase()))
        const allCountry = item.country.filter(country => country.toLowerCase().includes('all'))
        return  !!onlyCountry?.length || !!allCountry?.length
      } 
    },
    // Validamos que las alertas existan en su tipo para no mostrar campos vacios sin información
    checkLengthAlert(alerts) {
      return alerts && alerts.filter(el => this.validCountry(el)).length > 0
    },
    // Confirmación para eliminar alerta
    confirmDeleteAlert (item, type) {
      this.$yesno(this.$t('msg-pregunta-eliminar-elemento'), () => this.deleteAlert({...item, type})) 
    },
    // Eliminación individual en el documento existente en Firestore 
    deleteAlert (data) {
      // Creamos el objeto que deseamos eliminar segun la información almacenada en el modal, para esto utilizamos arrayRemove()
      const removeAlert = {
        [`${data.type.text}`]: this.$root.$data.removeA(...[{
          country: data.country,
          text: data.text
        }])
      }
      // Como utilizamos el arrayRemove() para agregar debemos utilizar el update segun la documentación 
      this.$root.$data.db.collection('alerts').doc(this.idAlert).update(removeAlert)
        .then(response => {
          this.getCollectionAlertsByDocumentTimeReal()
        })
        .catch(err => {
          console.error(err)
          this.$alert(this.$t('msg-problema-eliminar-elemento'))
        })
    }
  }
}
</script>

<style>
#addAlert{
  min-width: 155px;
}
.admin-alerts-button {
  top: 13rem !important;
  position: absolute !important;
  z-index: 9;
  right: 1.5rem !important;
}
.marginEditIcon {
  margin-left: 1rem;
}
.marginEditIcon:hover {
  cursor: pointer;
}
@media (max-width: 768px) {
  .admin-alerts-button {
    display: flex;
    justify-content: end;
    margin: 1rem 0;
    position: inherit !important;
  }
}
</style>