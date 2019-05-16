<template>
    <div class="od-menutab-container"><slot></slot></div>
</template>
<script>
    export default {
        name: 'mpanel',
        data: function () {
            return {}
        },
        props: {
            name: {
                type: String
            },
            label: {
                type: [String, Function],
                default: ''
            },
            icon: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            },
            closable: {
                type: Boolean,
                default: null
            }
        },
        methods: {

        }
    }
</script>