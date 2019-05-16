
import hello from './components/hello';
import TabPanel from './components/tabs';
import Scroller from './components/scroller';
import Sidebar from './components/sidebar';
import Layout from './components/layout';
import Header from './components/header';
import Sider from './components/Sider';
import Content from './components/content';
import Footer from './components/footer';
import Menutabs from './components/menutabs';
import Screenshot from './components/screenshot';
import ImgUploader from './components/imguploader';

const components = {
  hello,
  ...TabPanel,
  ImgUploader,
  Scroller,
  Sidebar,
  Layout,
  Menutabs,
  Mpanel: Menutabs.Panel,
  Screenshot
};

const OD_UI = {
  ...components,
  oHeader: Header,
  oSider: Sider,
  oContent: Content,
  oFooter: Footer
};


const install = function(Vue, opts = {}) {0
  if (install.installed) return;
  debugger;
  Object.keys(OD_UI).forEach(key => {
    Vue.component(key, OD_UI[key]);
  });
  // components.map(component => {
  //   Vue.component(component.name, component);
  // });
  // Vue.prototype.$message = Message;
  // Vue.prototype.$ELEMENT = ELEMENT;
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

const API = {
  version: '1.0.0',
  //填写组件名
  install,
  ...components
};

export default API   // eslint-disable-line no-undef
