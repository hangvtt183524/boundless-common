let ToggleDrawer = {
  methods: {
    toggleDrawer () {
      this.$store.commit('UPDATE_DRAWER', !this.drawer)
    }
  }
}

export default ToggleDrawer
