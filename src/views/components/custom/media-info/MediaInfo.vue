<template>
  <b-media no-body>
    <b-media-aside class="mr-2">
      <b-avatar size="48" :variant="variant">
        <feather-icon size="24" :icon="icon" />
      </b-avatar>
    </b-media-aside>
    <b-media-body class="my-auto">
      <b-card-text class="font-small-3 mb-0" v-html="title">
      </b-card-text>
      <h5 class="font-weight-bold mb-0" v-html="content">
      </h5>
    </b-media-body>
  </b-media>
</template>
<script>
export default {
  name: 'media-info',
  props: {
    title: { type: String, default: 'Información' },
    content: { type: String, default: 'Sin información' },
    variant: { type: String, default: 'primary' },
    icon: { type: String, default: 'CreditCardIcon' }
  }
}
</script>
<style lang="scss">
  
</style>