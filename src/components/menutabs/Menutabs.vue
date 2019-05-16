<template>
    <div :class="[prefixCls+'-container']" @mouseover="mouseoverHandler($event)" @mouseout="mouseoutHandler($event)">
        <div :class="[prefixCls+'-title']">
            <ul>
                <li v-for="(item, index) in navList" :index="index" @click="changeTabs($event, index)" @mouseover="changeTabs($event, index)">
                    <div>
                        <i v-if="item.icon" class="iconfont icon-shezhi"></i>
                        <span>{{item.label}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div  :class="[prefixCls + '-content']" :style="contentStyle" @mouseout="outContent">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    const prefixCls = 'od-menutabs';
    export default {
        name: 'menutabs',
        data: function () {
            return {
                prefixCls: prefixCls,
                navList: [],
                activeKeyc:'',
                panels: [],
                currentIndex: 0,
                isContentShow: false
            }
        },
        props: ['tabs'],
        computed: {
              contentStyle: function () {
                let activeKey = this.activeKey;
                return {
                    display: (this.isContentShow == false ) ? 'none' : 'block'
                    // border: '10px solid green'
                }
            },
        },
        methods:  {
            mouseoverHandler: function ($event) {
                let index = $event.target.getAttribute('index');
                console.log(index);
                // let item = this.navList. ((item, idx) => idx === parseInt(index));
                this.isContentShow = true;
            },
            mouseoutHandler: function ($event) {
                this.isContentShow = false;
            },
            getTabs: function () {
                return this.$children.filter(item => item.$options.name === 'mpanel');
            },
            changeTabs: function (tab, index) {
                let children = this.$children;
                for (let i = 0; i < children.length; i++) {
                    if (i == index) {
                        children[i].$el.style.display = 'flex';
                    } else {
                        children[i].$el.style.display = 'none';
                    }
                }
            },
            updateNav: function () {
                this.navList = [];
                this.getTabs().forEach((panel, index) => {
                    debugger;
                    this.navList.push({
                        labelType: typeof panel.label,
                        label: panel.label,
                        icon: panel.icon || '',
                        name: panel.currentName || index,
                        disabled: panel.disabled,
                        closable: panel.closable
                    });
                    if (!panel.currentName) panel.currentName = index;
                    if (index === 0) {
                        if (!this.activeKey) this.activeKey = panel.currentName || index;
                    }
                });
            },
            defaultAction: function () {
                let children = this.$children;
                for (let i = 0; i < children.length; i++) {
                    if (i == this.currentIndex) {
                        children[i].$el.style.display = 'flex';
                    } else {
                        children[i].$el.style.display = 'none';
                    }
                }
            },
            inContent: function () {
                this.isContentShow = true;
            },
            outContent: function () {
                this.isContentShow = false;
            }
        },
        mounted: function () {
            this.updateNav();
            this.defaultAction();
        }
    }
</script>

