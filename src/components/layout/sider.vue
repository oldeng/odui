<template>
    <div :class="wrapClasses"><slot></slot></div>
</template>
<script>
    const prefixCls = 'od-layout';
    export default {
        name: 'Sider',
        computed: {
            wrapClasses () {
                return `${prefixCls}-sider`;
            }
        }
    };
</script>