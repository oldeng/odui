import VueRouter from 'vue-router';
import Vue from 'vue';
import div1 from './components/div1';
import div2 from './components/div2';
import div3 from './components/div3';

Vue.use(VueRouter);
const routes = [
  {
    name: 'div1',
    path: '/div1',
    component: div1
  },
  {
    name: 'div2',
    path: '/div2',
    component: div2
  },
  {
    name: 'div3',
    path: '/div3',
    component: div3
  }
];
const router = new VueRouter({
  routes
});

export default  router;
