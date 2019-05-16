<template>
    <div :class="[prefixCls + '-component-tabs']">
        <ul role="tablist" :class="[prefixCls + '-component-tabs-ul']">
            <li
                v-for="(tab, i) in tabs"
                :key="i"
                :class="{ 'is-active': tab.isActive, 'is-disabled': tab.isDisabled }"
                class="tabs-component-tab"
                role="presentation"
                v-show="tab.isVisible"
            >
                <a v-html="tab.header"
                   :aria-controls="tab.hash"
                   :aria-selected="tab.isActive"
                   @click="selectTab(tab.hash, $event)"
                   :href="tab.hash"
                   class="tabs-component-tab-a"
                   role="tab"
                ></a>
            </li>
        </ul>
        <div :class="[prefixCls+'-component-panels']">
            <slot/>
        </div>
    </div>
</template>
<script>
    import expiringStorage from './expiringStorage';
    const prefixCls = 'od-tabs';
    export default {
        name: 'Tabs',
        props: {
            cacheLifetime: {
                default: 5,
            },
            options: {
                type: Object,
                required: false,
                default: () => ({
                    useUrlFragment: true,
                }),
            },
        },

        data: () => ({
            prefixCls: prefixCls,
            tabs: [],
            activeTabHash: '',
        }),

        computed: {
            storageKey() {
                return `vue-tabs-component.cache.${window.location.host}${window.location.pathname}`;
            },
            classes () {
                return [
                    `${prefixCls}`
                    // {
                    //     [`${prefixCls}-card`]: this.type === 'card',
                    //     [`${prefixCls}-mini`]: this.size === 'small' && this.type === 'line',
                    //     [`${prefixCls}-no-animation`]: !this.animated
                    // }
                ];
            }
        },

        created() {
            debugger;
            this.tabs = this.$children;
            console.log('this.tabs', this.tabs);
        },

        mounted() {
            window.addEventListener('hashchange', () => this.selectTab(window.location.hash));
            console.log('this.tabs', this.tabs);
            if (this.findTab(window.location.hash)) {
                this.selectTab(window.location.hash);
                return;
            }

            const previousSelectedTabHash = expiringStorage.get(this.storageKey);

            if (this.findTab(previousSelectedTabHash)) {
                this.selectTab(previousSelectedTabHash);
                return;
            }

            if (this.tabs.length) {
                this.selectTab(this.tabs[0].hash);
            }
        },

        methods: {
            findTab(hash) {
                return this.tabs.find(tab => tab.hash === hash);
            },

            selectTab(selectedTabHash, event) {
                // See if we should store the hash in the url fragment.
                if (event && !this.options.useUrlFragment) {
                    event.preventDefault();
                }

                const selectedTab = this.findTab(selectedTabHash);

                if (! selectedTab) {
                    return;
                }

                if (selectedTab.isDisabled) {
                    return;
                }

                this.tabs.forEach(tab => {
                    tab.isActive = (tab.hash === selectedTab.hash);
                });

                this.$emit('changed', { tab: selectedTab });

                this.activeTabHash = selectedTab.hash;

                expiringStorage.set(this.storageKey, selectedTab.hash, this.cacheLifetime);
            },

            setTabVisible(hash, visible) {
                const tab = this.findTab(hash);

                if (! tab) {
                    return;
                }

                tab.isVisible = visible;

                if (tab.isActive) {
                    // If tab is active, set a different one as active.
                    tab.isActive = visible;

                    this.tabs.every((tab, index, array) => {
                        if (tab.isVisible) {
                            tab.isActive = true;

                            return false;
                        }

                        return true;
                    });
                }
            },
        },
    };
</script>
