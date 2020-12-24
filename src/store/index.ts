import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        sessionId: '',
        userName: ''
    },
    mutations: {
        modifySessionId(state, playload) {
            state.sessionId = playload;
        },
        modifyUserName(state, playload){
            state.userName = playload;
        }
    },
    actions: {
    },
    modules: {
    }
})
