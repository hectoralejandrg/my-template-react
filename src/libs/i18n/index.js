import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_.,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_..]+)\./i)
    if (matched && matched.length > 1) {
      if (matched[1].indexOf('.') !== -1) {
        const keyMatch = matched[1].split('.').map(k => `./${k}.json`)
        messages[matched[1].split('.')[0]] = {
          ...locales(key),
          ...locales(keyMatch[1])
        }
      } else {
        const locale = matched[1]
        messages[locale] = locales(key)
      }
    }
  })
  return messages
}
export const i18n = new VueI18n({
  locale: 'cl',
  fallbackLocale: 'cl',
  messages: {}
})

function loadLocaleMessagesRoute(routeName) {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_.,\s]+$/i)
  const messages = {}
  let baseLang = ''
  let secLang = ''
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_.]+)\./i)
    if (matched && matched.length > 1 && matched.findIndex(m => m.indexOf(i18n.locale) !== -1 || m.indexOf(routeName) !== -1) !== -1) {
      if (matched[1].indexOf('.') !== -1) {
        const keyMatch = matched[1].split('.').map(k => `./${k}.json`)
        baseLang = `${keyMatch[1].replace('./', '').replace('.json', '')}`
        secLang = matched[1].split('.')[0]
        messages[secLang] = {
          ...locales(key),
          ...locales(keyMatch[1])
        }
      } else {
        const auxBaseLang = matched.input.substring(0, matched.input.indexOf(matched[0]) - 1).replace('./', '')
        if (auxBaseLang !== '.' && auxBaseLang !== '') {
          baseLang = auxBaseLang
          const locale = matched[1]
          messages[baseLang] = locales(key)
        }
      }
      if (secLang !== '' && baseLang !== '.' && baseLang !== '') {
        messages[secLang] = {
          ...messages[baseLang],
          ...messages[secLang]
        }
      }

    }
  })
  return messages
}

const loadedLanguages = ['cl'] // our default language that is preloaded

function setI18nLanguage (lang) {
  i18n.locale = lang
  // axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync(routeName) {
  // If the same language
  const messages = loadLocaleMessagesRoute(routeName)
  const localeMessages = {
    ...messages[i18n.locale],
    ...i18n.messages[i18n.locale]
  }
  i18n.setLocaleMessage(i18n.locale, localeMessages)
  // if (i18n.locale === lang) {
  //   return Promise.resolve(setI18nLanguage(lang))
  // }

  // // If the language was already loaded
  // if (loadedLanguages.includes(lang)) {
  //   return Promise.resolve(setI18nLanguage(lang))
  // }

  
  // // If the language hasn't been loaded yet
  // return import(`./locales/${i18n.locale}/${lang}.js`).then(
  //   messages => {
  //     console.log(messages)
  //     i18n.setLocaleMessage(lang, messages.default)
  //     loadedLanguages.push(lang)
  //     return setI18nLanguage(lang)
  //   }
  // )
}