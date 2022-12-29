<template>
  <div :class="contentWidth === 'boxed' ? 'container p-0' : null">

    <app-breadcrumb v-if="$route.meta.breadcrumb" :disableHome="true"/>
    <router-view />
  </div>
</template>

<script>
import AppBreadcrumb from '@core/layouts/components/AppBreadcrumb.vue'
import useAppConfig from '@core/app-config/useAppConfig'

export default {
  components: {
    AppBreadcrumb
  },
  setup() {
    const { contentWidth } = useAppConfig()
    return { contentWidth }
  }
}
</script>
