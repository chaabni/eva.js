import Vue from 'RESOLVE_VUE' // eslint-disable-line import/no-extraneous-dependencies
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import assign from 'object-assign'

Vue.use(VueRouter)
Vue.use(Vuex)

class EVA {
  constructor(options = {}) {
    if (!(this instanceof EVA)) {
      return new EVA(options)
    }
    this.routes = []
    this.options = options
  }
  use(...args) {
    Vue.use(...args)
  }
  model(m) {
    const name = m && m.name
    // initial store instance
    if (!this.storeInstance) {
      if (name) {
        // to initialize an empty store
        // will be used to register namespaced models
        this.storeInstance = new Vuex.Store()
      } else {
        // to initialize a store with a top-level model
        // early return since we don't need to register namespaced model
        this.storeInstance = new Vuex.Store(m)
        return
      }
    }
    // once the store intance is initialized
    // add namespaced model here
    this.storeInstance.registerModule(name, m)
  }
  route(path, component, children) {
    return {
      path,
      component,
      children
    }
  }
  router(handleRoute) {
    this.routes = handleRoute(this.route)
  }
  start(app, mountTo) {
    this.routerInstance = new VueRouter({
      routes: this.routes,
      mode: this.options.mode
    })
    this.vm = new Vue(assign({
      store: this.storeInstance,
      router: this.routerInstance
    }, app))
    this.vm.$mount(mountTo)
  }
}

EVA.mapState = Vuex.mapState
EVA.mapActions = Vuex.mapActions
EVA.mapGetters = Vuex.mapGetters

export default EVA
