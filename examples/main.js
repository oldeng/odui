/**
 * Created by aresn on 16/6/20.
 */
import Vue from 'vue';
import App from './app.vue';
import router from './router';
import OD from '../src/index';
// import locale from '../src/locale/lang/en-US';
// import locale from '../src/locale/lang/zh-CN';

import "../src/styles/index.less";

// Vue.use(VueRouter);
// Vue.use(iView, { locale });
Vue.use(OD);

// 开启debug模式
Vue.config.debug = true;

// // 路由配置
// const router = new VueRouter({
//     routes: [
//     ]
// });

new Vue({
    el: '#app',
    router: router,
    data: function () {
        return {
            items: [
                {
                    name: '我的项目',
                    route: 'div1',
                    icon: 'ivu-icon ivu-icon-filing'
                },
                {
                    name: '我的发布',
                    route: 'div2',
                    icon: 'ivu-icon ivu-icon-upload'
                },
                {
                    name: '我的数据',
                    route: 'div3',
                    icon: 'ivu-icon ivu-icon-stats-bars'
                }
            ],
            left: {},
          content: {}
        }
    },
    created: function () {
        // this.left = this.$refs.left;
    },
    mounted: function () {
        this.left = this.$refs.left;
        this.content = this.$refs.content;
        debugger;
        this.$router.push('div1');
    },
    methods: {
        changeTab: function (tab) {
            console.log('tab', tab);
            console.log('tab.route', tab.route);
          this.$router.push(tab.route);
        },
        expandHandler: function (state) {

            let left = this.$refs.left;
            let content = this.$refs.content.$el;
            let width = left.$el.style.width;
            let contentLeft = content.style.left;

            width == '60px' ? width = "150px": width;
            contentLeft == '60px' ? content.style.left = '150px' : content.style.left = '60px';
        }
    }
});
