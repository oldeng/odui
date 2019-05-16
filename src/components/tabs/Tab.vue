<template>
    <div v-show="isActive"
             :aria-hidden="! isActive"
             class="od-tabs-component-panel-content"
             :id="hash"
             role="tabpanel"
    >
        <slot />
    </div>
</template>

<script>
    export default {
        name: 'Tab',
        props: {
            id: { default: null },
            name: { required: true },
            prefix: { default: '' },
            suffix: { default: '' },
            isDisabled:{ default: false },
        },

        data: () => ({
            isActive: false,
            isVisible: true,
        }),

        computed: {
            header() {
                return this.prefix + this.name + this.suffix;
            },

            hash() {
                if (this.isDisabled) {
                    return '#';
                }

                return this.id ?
                    '#' + this.id :
                    '#' + this.name.toLowerCase().replace(/ /g, '-');
            },
        },
    };
</script>
