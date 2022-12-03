<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'Main',
  mounted() {
    this.analyticsSetting()
    // remove loader when load finish
    let loaderElement = document.getElementById('loader')
    if (loaderElement) {
      loaderElement.style.display = 'none'
    }
  },
  methods: {
    analyticsSetting() {
      var analytics=window.analytics=window.analytics||[];
      if(!analytics.initialize) {
        analytics.invoked=!0;
        analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];
        analytics.factory=  function(e) {
          return function() {
            var t=  Array.prototype.slice.call(arguments);
            t.unshift(e);analytics.push(t);return analytics
          }
        };
        for(var e=0;e<analytics.methods.length;e++) {
          var key=analytics.methods[e];analytics[key]=analytics.factory(key)
        }
      }
    }
  }
}
</script>

<style>
.table-container {
  width: 100%;
}
</style>
