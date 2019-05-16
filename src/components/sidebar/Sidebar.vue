<template>
    <div class="sidebar" :style="sidebarStyle" ref="sidebar">
        <div class="sidebar-nav-top" ref="sidebarNav">
            <span  @click="switchTitle($event)"><i class="">{{arrow}}</i></span>
        </div>
        <div class="sidebar-content" ref="sidebarContent">
            <div class="sidebar-icons-container" ref="titileIcons">
                <ul>
                    <li v-for="(item, index) in items" @click="changeTab(item)"><i :class="item.icon"></i></li>
                </ul>
            </div>
            <div class="sidebar-title-container" ref="titleList">
                <ul>
                    <li v-for="(item, index) in items" @click="changeTab(item)">{{item.name}}</li>
                </ul>
            </div>
        </div>
    </div>  
</template>
<script>
    export default {
        name: 'Sidebar',    
        data: function () {
            return {
                parentNode: null,
                parentWidth: -1,
                isExpand: true,
                persentLeft: '40%',
                persentRight: '60%',
                arrow: '<<<',
                width: 100
            }
        },
        props: ['items', 'parent'],
        computed: {
            sidebarStyle: function () {
                return {
                    width: this.width+'%'
                }
            }
        },
        mounted: function () {
        },
        beforeUpdate: function () {
        },
        methods: {

            switchTitle: function (evt) {
                this.parentNode = this.parent.node.$el;
                let parentWidth = parseInt(window.getComputedStyle(this.parentNode).width);
                this.parentWidth = this.parentWidth == -1 ? parseInt(parentWidth) : this.parentWidth;
                var sidebar = this.$refs.sidebar;

                var titleList = this.$refs.titleList;
                var titileIcons = this.$refs.titileIcons;
                titleList.style.display == 'none' ? titleList.style.display = 'flex' : titleList.style.display = 'none';
                titileIcons.style.width == '100%' ? titileIcons.style.width = '40%' : titileIcons.style.width = '100%';
                let setWidth = getComputedStyle(this.parentNode).width == this.parentWidth  + 'px' ? (this.parentWidth * 0.4) + 'px' : this.parentWidth + 'px';

                this.parentNode.style.width = setWidth;
              
                this.isExpand = !this.isExpand;
                this.$emit('expand', { expand: this.isExpand });
                  //更換縮放icon
                this.changeArrow();
            },
            changeTab: function (tab) {
                this.$emit('change-tab', tab);
            },
            changeArrow: function () {
                debugger;
                if (this.isExpand) {
                    this.arrow = '<<<';
                } else {
                    this.arrow = '>>>';
                }
            }
        }
    
    
    }
</script>

