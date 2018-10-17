export const state = () => ({
  notifications: [],
})

const ADD_NOTIFICATION = `ADD_NOTIFICATION`

export const mutations = {
  [ADD_NOTIFICATION](state, payload) {
    state.notifications.push({
      ...payload,
    })
  },
}

export const actions = {
  nuxtServerInit({ commit }, nuxtCtx) {
    const { req } = nuxtCtx
    const { serverData } = req
    if (!serverData) return
    if (serverData.notification) {
      commit(ADD_NOTIFICATION, serverData.notification)
    }
  },
}
