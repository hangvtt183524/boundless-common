import {mapGetters} from "vuex";

let ManageableNodesMixin = {
    computed: {
        ...mapGetters('layout', ['userOrganizationNodes']),
    },
    methods: {
        getNodesByType (types) {
            const nodes = []
            for (let node of this.userOrganizationNodes) {
                if (types.includes(node.type)) {
                    nodes.push({
                        value: node.id,
                        text: node.name,
                        type: node.type,
                        level: node.level
                    })
                }
            }
            return nodes
        },
    }
}

export default ManageableNodesMixin