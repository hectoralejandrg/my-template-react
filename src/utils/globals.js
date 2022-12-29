const validateRut = (rut) => {
  let dv = rut.slice(-1).toUpperCase()
  if (rut.toString().trim() !== '' && rut.toString().indexOf('-') > 0) {
    const characters = []
    const serie = [2, 3, 4, 5, 6, 7]
    const dig = rut.toString().substr(rut.toString().length - 1, 1)
    rut = rut.toString().substr(0, rut.toString().length - 2)
    for (let i = 0; i < rut.length; i++) {
      characters[i] = parseInt(rut.charAt(rut.length - (i + 1)))
    }
    let summation = 0, k = 0, rest = 0
    for (let j = 0; j < characters.length; j++) {
      if (k === 6) k = 0
      summation += parseInt(characters[j]) * parseInt(serie[k])
      k++
    }
    rest = summation % 11
    dv = 11 - rest
    if (dv === 10) {
      dv = 'K'
    } else if (dv === 11) {
      dv = 0
    }
    return dv.toString().trim().toUpperCase() === dig.toString().trim().toUpperCase()
  } else {
    return false
  }
}

const byString = (object, string) => {
  const properties = string.split('.')
  return properties.reduce((prev, curr) => prev && prev[curr], object)
}

const validateRuc = data => {
  const dni = data.replace('-', '').trim().toUpperCase()
  if (!dni || dni.length < 9) return false
  const multiples = [3, 2, 7, 6, 5, 4, 3, 2]
  const dcontrols = {
    numbers: [6, 7, 8, 9, 0, 1, 1, 2, 3, 4, 5],
    letters: ['K', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  }
  const numdni = dni.substring(0, dni.length - 1).split('')
  const dcontrol = dni.substring(dni.length - 1)
  const dsum = numdni.reduce((acc, digit, index) => {
    acc += digit * multiples[index]
    return acc
  }, 0)
  const key = 11 - (dsum % 11)
  const index = (key === 11) ? 0 : key
  if (/^\d+$/.test(dni)) {
    return true
    //return dcontrols.numbers[index] === parseInt(dcontrol, 10)
  }
  //return dcontrols.letters[index] === dcontrol
  return false
}


function getParentsPlace (id, list) {
  let parents = {}
  const index = list.findIndex(el => el.id === id)
  if (index !== -1) {
    parents = {
      [`parent_level${list[index].level_num}`]: list[index].id,
      [`level${list[index].level_num}`]: list[index].name,
      ...list[index].level_num !== 1 ? getParentsPlace(list[index].parent_id, list) : {}
    }
  }
  return parents
}

function generatePlacesLevels (list, maxRequiredLevel, displayLevels, parentId = null) {
  const selectorsLevel = {}
  displayLevels = [... new Set(displayLevels.concat(maxRequiredLevel))].sort((a, b) => a < b ? -1 : 1)
  list = list.sort((a, b) => a.level_num < b.level_num ? -1 : 1)
  let full_places = list.map(el => ({...el, [`level${el.level_num + 1}`]: [], text: el.name}))
    .map(place => {
      if (place.level_num !== 1) {
        place = {
          ...place,
          ...getParentsPlace(place.parent_id, list)
        }
      }
      return place
    })
  displayLevels.reverse().map((displayLevel, indexDisplayLevel) => {
    selectorsLevel[`level${displayLevel}`] = []
    full_places = full_places.map(place => {
      if (place.level_num === displayLevel && displayLevels[indexDisplayLevel - 1]) {

        displayLevels.filter(dl => dl > displayLevel).map(subDisplayLevel => {
          place[`level${subDisplayLevel}`] = full_places.filter(el => el[`parent_level${displayLevel}`] === place.id && el.level_num === subDisplayLevel)
        })

        selectorsLevel[`level${displayLevel}`].push(place)
      } else if (place.level_num === displayLevel && !displayLevel[indexDisplayLevel - 1]) {
        selectorsLevel[`level${displayLevel}`].push(place)
      }
      return place
    })
  })
  const ordered = Object.keys(selectorsLevel).sort().reduce(
    (obj, key) => {
      obj[key] = selectorsLevel[key]
      return obj
    },
    {}
  )
  return ordered
}

function generateArrayPlacesFromTree (list, currentLevel, parentId = null) {
  const full_places = []
  list.map(el => {
    const id = el[`level${currentLevel + 1}`]  && el[`level${currentLevel + 1}`].length
      && true ?  el.id || el.place_id || `${currentLevel}#${el.name}` : el.id || el.place_id || el.platform_id || `${currentLevel}#${el.name}`
    full_places.push({
      id,
      name: el.name,
      text: el.name,
      platform_id: el.platform_id,
      code: el.code,
      level_num: currentLevel,
      parent_id: parentId
    })
    if (el[`level${currentLevel + 1}`] && el[`level${currentLevel + 1}`].length) {
      const childrenPlaces = generateArrayPlacesFromTree(el[`level${currentLevel + 1}`], currentLevel + 1, id)
      full_places.push(...childrenPlaces)
    }
  })
  return full_places
}

const formatRut = (value) => {
  value = value.replace(/[^0-9]+/, '')
  const body = value.slice(0, -1)
  const dv = value.slice(-1).toUpperCase()
  value = `${body}-${dv}`
  return value
}
export { formatRut, validateRut, generatePlacesLevels, generateArrayPlacesFromTree, validateRuc, byString }
