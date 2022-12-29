
import * as globals from './globals'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
const { t } = useI18nUtils()

const myDebounces = []

export default function (Vue) {
  Vue.prototype.textareaResize = (text, ref, minHeight) => { 
    const area = ref.$el.childNodes[1]
    area.style.height = 'initial'
    area.style.height = `${area.scrollHeight + 1}px`
  }
  Vue.prototype.$animateCSS = (element, animation, speed = 'slow', delay = 0, prefix = 'animate__') => 
  // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`
      const node = document.querySelector(element)
      if (animation.indexOf('In')) node.classList.remove('hidden') 
      const delayClass = delay > 0 ? `${prefix}${delay}s` : ''

      node.classList.add(`${prefix}animated`, animationName, `${prefix}${speed}`)

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd (event) {
        event.stopPropagation()
        resolve({code: 'ok', node})
        node.classList.remove(`${prefix}animated`, animationName, `${prefix}${speed}`)
        if (animation.indexOf('Out') !== -1) node.classList.add('hidden')
      }

      node.addEventListener('animationend', handleAnimationEnd, {once: true})
    })
  
  Vue.prototype.$showOnBottom = (elementToShow, elementListened) => {
    const header = document.querySelector('.vs-navbar').clientHeight
    const breadcrumb = document.querySelector('.title-page').clientHeight
    const node = document.querySelector(elementListened)
    let shown = false
    new Vue.prototype.$ResizeSensor(node, () => {
      const visibleHeight = window.innerHeight - breadcrumb - header - 100
      const newShown = node.clientHeight > visibleHeight
      if (shown !== newShown) Vue.prototype.$animateCSS(elementToShow, `fade${newShown ? 'In' : 'Out'}`, 'faster')
      shown = newShown
    })
  }

  Vue.prototype.$debounce = (id, callback, wait = 300) => {
    clearTimeout(myDebounces[id])
    myDebounces[id] = setTimeout(() => {
      callback()
    }, wait)
  }

  Vue.prototype.$generatePlacesLevels = (list, maxRequiredLevel, displayLevels, customizedId) => {
    return globals.generatePlacesLevels(list, maxRequiredLevel, displayLevels, customizedId)
  }

  Vue.prototype.$generateArrayPlacesFromTree = (list, currentLevel = 1) => {
    return globals.generateArrayPlacesFromTree(list, currentLevel)
  }

  Vue.prototype.$getUniqueList = (list, element) => {
    const uniqueIds = []
    return list && !!list?.length ? list.filter(el => {
      const currentUnique = element && el && el[element] ? el[element] : el
      if (currentUnique) {
        const isDuplicate = uniqueIds.includes(currentUnique)
        if (!isDuplicate) {
          uniqueIds.push(currentUnique)
          return true
        }
      }
    }) : []
  }

  Vue.prototype.$byString = (object, string) => {
    return globals.byString(object, string)
  }

  Vue.prototype.$filterUsingPermission = (myArray, modularPermissions) => {
    return myArray.filter(el => {
      if (el.needPermission && !!Object.keys(modularPermissions)?.length) {
        return globals.byString(modularPermissions, el.needPermission)
      } else {
        return true
      }
    })
  }

  Vue.prototype.$isJson = (str) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  Vue.prototype.$i18nImport = (country) => {
    const locales = require.context('@/libs/i18n/locales', true, /[A-Za-z0-9-_.,\s]+\.json$/i)
    const messages = {}
    locales.keys().forEach(key => {
      const matched = key.match(/([A-Za-z0-9-_.]+)\./i)
      if (matched && matched.length > 1) {
        if (key.indexOf(country.toLowerCase()) !== -1) {
          const locale = matched[1]
          messages[locale] = locales(key)
        }
      }
    })
    return messages
  }

  Vue.prototype.$generateTooltipPerson = (person, variant = 'light', fields = ['dni', 'phone', 'email']) => {
    let title = '<div>'
    title += person?.dni && fields.includes('dni') ? `<div><strong><span>${t('DNI')}</span>:</strong> ${person?.dni || ''}</div>` : ''
    title += person?.phone && fields.includes('phone') ? `<div><strong><span>${t('Teléfono')}</span>:</strong> ${person?.phone || ''}</div>` : ''
    title += person?.email && fields.includes('email') ? `<div><strong><span>${t('E-mail')}</span>:</strong> ${person?.email || ''}</div>` : ''
    title += '</div>'
    return { 
      title,
      variant: 'light'
    }
  }

  Vue.prototype.$formatRut = (value) => {
    return globals.formatRut(value)
  }

  Vue.prototype.$validateRut = (rut) => {
    return globals.validateRut(rut)
  }
}