<template>
  <b-modal
    id="modal-upload-coberturas"
    :title="$t('Cargar bloqueo de coberturas')"
    :ok-title="$t('Cargar bloqueo de coberturas')"
    ok-variant="warning"
    modal-class="dialog-900"
    ok-only
    no-close-on-esc
    no-close-on-backdrop
    centered
    @ok="ok"
    @close="close"
    accept=".xlxs"
  >
    <!--<b-progress
      ref="refProgressFileUploadValue"
      value="65"
      max="100"
      class="progress-bar-warning"
      variant="warning"
    />-->

    <div>
      <b-form-file ref="refInputEl" v-model="file" class="mb-2" />
      <b-button variant="danger" @click="file = null">
        Eliminar Archivo
      </b-button>
    </div>
  </b-modal>
</template>

<script>


import { ref } from '@vue/composition-api'
import { useInputProgressFile } from '@core/comp-functions/forms/form-progress'

export default {
  name: 'modal-upload-coberturas',
  // props: ['countries', 'organizations', 'addresses'],

  data() {
    return {
      file: null
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {

  },
  methods: {
    ok() { console.log(this.file) }, close() { console.log(this.$refs.refProgressFileUploadValue) }
  }, setup() {
    const refInputEl = ref(null)
    const refProgressFileUploadValue = ref(null)
    const { inputProgressFile } = useInputProgressFile(refInputEl, refProgressFileUploadValue)
    return {
      inputProgressFile, refProgressFileUploadValue, refInputEl
    }
  }
}
</script>
