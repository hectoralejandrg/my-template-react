<template>
  <b-nav-item-dropdown
    id="dropdown-grouped"
    variant="link"
    class="dropdown-language"
    right
  >
    <template #button-content>
      <b-img
        :src="currentLocale.img"
        height="14px"
        width="22px"
        :alt="currentLocale.locale"
      />
      <span class="ml-50 text-body">{{ currentLocale.name }}</span>
    </template>
    <b-dropdown-item
      v-for="localeObj in locales"
      :key="localeObj.locale"
      @click="() => changeLocale(localeObj.locale)"
      :class="$i18n.locale === localeObj.locale ? 'active' : ''"
    >
      <b-img
        :src="localeObj.img"
        height="14px"
        width="22px"
        :alt="localeObj.locale"
      />
      <span class="ml-50">{{ localeObj.name }}</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { BNavItemDropdown, BDropdownItem, BImg } from 'bootstrap-vue'
import { loadLanguageAsync } from '@/libs/i18n'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BImg
  },
  // ! Need to move this computed property to comp function once we get to Vue 3
  computed: {
    currentLocale() {
      return this.locales.find(l => l.locale === this.$i18n.locale)
    }
  },
  methods: {
    changeLocale (locale) {
      this.$session.get('cas_user').country = JSON.parse(localStorage.getItem('globalData') || '{}').countries.filter(el => el.code.toLowerCase === locale.toLowerCase())[0]
      this.$i18n.locale = locale
      loadLanguageAsync(this.$route.name)
    }
  },
  setup() {
    const locales = [
      {
        locale: 'ar',
        img: require('@/assets/images/flags/ar.png'),
        name: 'Argentina'
      },
      {
        locale: 'cl',
        img: require('@/assets/images/flags/cl.png'),
        name: 'Chile'
      },
      {
        locale: 'co',
        img: require('@/assets/images/flags/co.png'),
        name: 'Colombia'
      },
      {
        locale: 'mx',
        img: require('@/assets/images/flags/mx.png'),
        name: 'Mexico'
      },
      {
        locale: 'pe',
        img: require('@/assets/images/flags/pe.png'),
        name: 'Perú'
      }
    ]

    return {
      locales
    }
  }
}
</script>

<style>
.dropdown-menu li.active{
  background-color: var(--light-3);
}
</style>
