<template>
  <div>
    <b-modal id="modalIFrame"  size="lg" centered modal-class="modal-warning dialog-1200 custom-dialog"
      no-close-on-esc no-close-on-backdrop
      ok-variant="warning"
      ok-only
      :title="title">
      <iframe :src="url"></iframe>
    </b-modal>
    
  </div>
</template>
<script>
export default {
  name: 'modal-iframe',
  props: { url: { type: String }, title: { type: String, default: 'Detalle'} }
}
</script>
<style lang="scss">
  #modalIFrame iframe {
    width: 100%;
    height: calc(100vh - 13rem);
  }
</style>