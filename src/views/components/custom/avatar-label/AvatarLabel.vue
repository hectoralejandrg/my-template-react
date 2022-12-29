<template>
  <div class="avatar-label mb-1">
    <b-avatar class="push-left mr-1"
      size="md"
      :src="img"
    />
    <span >
      <div><h5 class="mb-01">{{title}}</h5></div>
      <div><label>{{subtitle}}</label></div>
    </span>
  </div>
</template>
<script>
export default {
  name: 'avatar-label',
  props: ['img', 'title', 'subtitle']
}
</script>
<style lang="scss">
  
</style>