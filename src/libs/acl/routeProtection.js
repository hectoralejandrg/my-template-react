import ability from './ability'

export const canNavigate = to => {
  return to.matched.some(route => {
    return ability.can(route.meta.action || 'read', route.meta.resource)
  })
}

export const _ = undefined
