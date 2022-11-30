export default {
    get (key) {
        const getAllParams = url => {
            var params = {}
            var parser = document.createElement('a')
            parser.href = url

            var query = parser.search.substring(1)
            var vars = query.split('&')

            for (let i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=')
                params[pair[0]] = decodeURIComponent(pair[1])
            }

            return params
        }

        const pageParams = getAllParams(window.location.href)

        if (pageParams.noAuth && key === 'auth.token' && process.env.VUE_APP_AUTOMATIC_TOKEN) {
            return process.env.VUE_APP_AUTOMATIC_TOKEN
        }

        return localStorage.getItem(key)
    }
}