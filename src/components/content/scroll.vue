<template>
  <div ref="wrapper" class="scroll-wrap">
    <div ref="list" :style="[contentStyle]" class="scroll-wrap-content">
      <slot></slot>
    </div>
    <div class="scroll-bar" :class="{on: verticalCur}" v-show="verticalShow" ref="barV">
      <div class="scroll-bar-main" ref="barVMain" @mousedown.stop="_downY($event)"></div>
    </div>
    <div class="scroll-bar-h" :class="{on: horizontalCur}" v-show="horizontalShow" ref="barH">
      <div class="scroll-bar-h-main" ref="barHMain" @mousedown.stop="_down($event)"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "dv-scroll",
  data() {
    return {
      offX: 0,
      barHWidth: 0,
      barVWiHeight: 0,
      verticalShow: this.vertical,
      horizontalShow: this.horizontal,
      barMinX: 0,
      barMaxX: 0,
      barMinY: 0,
      barMaxY: 0,
      timer: null,
      verticalCur: false,
      horizontalCur: false,
      inited: false
    };
  },
  props: {
    horizontal: {
      type: Boolean,
      default: true
    },
    vertical: {
      type: Boolean,
      default: true
    },
    //初始化模式center：自动居中 normal，
    pattern: {
      type: String,
      default: "normal" //center right
    },
    // 终端 false为PC 待扩展
    terminal: {
      type: Boolean,
      default: false
    },
    // 速度
    speed: {
      type: Number,
      default: 300
    },
    wrapW: {
      type: Number,
      default: undefined
    },
    eqid: {
      type: String
    },
    verticalBarShow: {
      type: Boolean,
      default: true
    },
    clTop: {
      type: Number,
      default: 0
    },
    rate: {
      type: [Number]
    }
  },
  computed: {
    contentStyle: function() {
      return {
        width: '100%',
        height: '100%'
      };
    }
  },
  watch: {
    vWidth() {
      this.setLeftTop();
    },
    vHeight() {
      this.setLeftTop();
    }
  },
  methods: {
    // 初始化
    _initScroll() {
      this.wrapper = this.$refs.wrapper;
      this.list = this.$refs.list;
      this.barV = this.$refs.barV;
      this.barVMain = this.$refs.barVMain;
      this.barH = this.$refs.barH;
      this.barHMain = this.$refs.barHMain;
      this.main = this.list.children[0];
      this._refresh();
    },
    //设置画布可视区宽高
    // 设置参数
    _set() {
      this.mouse = {}; // mouse对象
      this.wrapper.style.position = "relative";
      this.main.style.position = 'absolute';
      if (this.pattern === 'center') {
        this.main.style.left = -(this.mainW - this.listW) / 2 +'px';
        this.main.style.top = - (this.mainH - this.listH) / 2 + 'px';
      }
    },
    // 计算刷新
    _refresh() {
      //容器宽高
      this.wrapperW = this.wrapper.offsetWidth;
      this.wrapperH = this.wrapper.offsetHeight;
      //内容宽高
      this.listH = this.list.offsetHeight;
      this.listW = this.list.offsetWidth;
      //用户自定义容器大小
      this.mainW = this.main.offsetWidth;
      this.mainH = this.main.offsetHeight;
      //横向滚动条宽高
      this.barHW = this.barH.offsetWidth;
      this.barHH = this.barH.offsetHeight;
      this.barHMainW = this.barHMain.offsetWidth;
      //纵向滚动条宽高
      this.barVW = this.barV.offsetWidth;
      this.barVH = this.barV.offsetHeight;
      this.barVMainH = this.barVMain.offsetHeight;

      if (!this.inited) {
        this._set();
        this.inited = true;
      }
      /**
       * 横向
       */
      if (this.horizontal) {
        this.horizontalShow = true;
        this.barHMain.style.width = this.barHW * (this.listW / this.mainW) + 'px';
        
        //center模式
        if (this.pattern === 'center') {
          this.barHMain.style.left = (this.barHW - this.barHMainW) / 2 + 'px';
        }
      }
      /**
       * 纵向
       */
      if (this.vertical) {
        this.barVMain.style.height = this.barVH * ( this.listH / this.mainH) + 'px';
        console.log('rfres',this.barVH * ( this.listH / this.mainH));
        if (this.pattern === 'center') {
          this.barVMain.style.top = (this.barVH - this.barVMain.offsetHeight) / 2 + 'px';
        }
      }
    },
    _down(event) {
      this.mouse.startX = event.clientX;
      this.mouse.switch = true;
      this.mouse.x = event.target.offsetLeft;
      this.barHMain.className += " cur";
    },
    mouseMoveHandler(event) {},
    mouseUpHandler(event) {
      this.wrapper.removeEventListener("mousemove", this.mouseMoveHandler);
      this.wrapper.removeEventListener("mouseup", this.mouseUpHandler);
    },
    _downY(even) {
      this.mouse.startY = even.clientY;
      this.mouse.switchY = true;
    },
    _enter(event) {
      if (this.verticalShow) {
        this.verticalCur = true;
      }
      if (this.horizontalShow) {
        this.horizontalCur = true;
      }
      this.mouse.startX = event.clientX;
      this.mouse.startY = event.clientY;
    },
    _leave() {
      this.horizontalCur = false;
      this.verticalCur = false;
    },
    _click(even) {
      if (this.mouse.switch) {
        return;
      }
      this.mouse.x = 0;
      this.mouse.startX = this.barMinX;
      this._scrollX_To(even.clientX - this.barHMain.offsetWidth * 0.5);
    },
    _clickY(even) {
      if (this.mouse.switchY) {
        return;
      }
      this.mouse.startY = this.barMinY;
      this.mouse.y = 0;
      this._scrollY_To(even.clientY - this.barVMain.offsetHeight * 0.5);
    },
    _scrollX_To(vx, type) {
      let offset = vx - this.mouse.startX;
      this.mouse.startX = vx;
      let percent = offset / (this.barHW - this.barHMainW);
      if (offset > 0) {
        //滚动条向右移动
        if (this.barHMain.offsetLeft > this.barHW - this.barHMainW) {
          this.barHMain.style.left = this.barHW - this.barHMainW + 'px';
        } else {
          this.barHMain.style.left = this.barHMain.offsetLeft + offset + 'px';
          if (this.main.offsetLeft < this.barHW - this.mainW) {
            this.main.style.left = this.barHW - this.mainW + 'px';
          } else {
            this.main.style.left = this.main.offsetLeft + percent * (this.barHW - this.mainW) + 'px';
          }
        }
      } else {
        //向左移动
        if (this.barHMain.offsetLeft < 0) {
          this.barHMain.left = 0;
        } else {
          this.barHMain.style.left = this.barHMain.offsetLeft + offset + 'px';
          if (this.main.offsetLeft < this.barHW - this.mainW) {
            this.main.style.left = this.barHW - this.mainW + 'px';
          } else {
            this.main.style.left = this.main.offsetLeft + percent * (this.barHW - this.mainW) + 'px';
          }
        }
      }
    },
    _scrollY_To(y, type) {
      let offset = this.mouse.startY - y;
      this.mouse.startY = y;
      if (Math.abs(offset) < 1) {
        return;
      }
      let percent = offset / (this.barV.offsetHeight - this.barVMain.offsetHeight);
      
      if (offset > 0) {
        //向下移动
        if(this.barVMain.offsetTop < 0) {
                this.barVMain.style.top = 0;
        } else {
          if (this.main.offsetTop > 0) {
            this.main.style.top = 0;
          } else {
            this.main.style.top = this.main.offsetTop + percent * (this.main.offsetHeight + 40 - this.list.offsetHeight)+ 'px';
            this.barVMain.style.top = this.barVMain.offsetTop - offset + 'px';
          }
        }
      } else {
        //向上移动
        if (this.barVMain.offsetTop > this.barVH - this.barVMainH) {
          this.barVMain.style.top = this.barVH - this.barVMainH + 'px'; 
        } else {
          if (this.main.offsetTop < this.barVH - this.mainH) {
            this.main.style.top = this.barVH - this.mainH + 'px';
          } else {
            this.main.style.top = this.main.offsetTop + percent * (this.main.offsetHeight + 40 - this.list.offsetHeight)+ 'px';
            this.barVMain.style.top = this.barVMain.offsetTop - offset + 'px';
          }
        }
      }
    },
    _mouseup() {
      if (this.mouse) {
        this.mouse.switch = false;
        this.mouse.switchY = false;
        this.verticalCur = false;
        this.horizontalCur = false;
      }
    },
    _wheel(event) {
      let offset = event.wheelDelta;
      this._scrollY_To(this.barVMain.offsetTop - offset / 20 );
    },
    _mousemove(event) {
      if (this.mouse && this.mouse.switch) {
        this._scrollX_To(event.clientX);
      }
      if (this.mouse && this.mouse.switchY) {
        this._scrollY_To(event.clientY);
      }
      return false;
    },
    resetY() {
      this.list.style.top = "0";
      this.barVMain.style.top = "0";
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("mousemove", this._mousemove);
      window.addEventListener("mouseup", this._mouseup);
      this.$refs["wrapper"].addEventListener("mouseenter", event => {
        this._refresh();
      });
      this.vertical && this.$refs.wrapper.addEventListener("wheel", this._wheel);
      window.onresize = () => {
        this.horizontal &&this._scrollX_To(this.mouse.nowX);
        this.vertical && this._scrollY_To(this.mouse.nowY);
      };
      // let mutationObserver = new MutationObserver(mutations => {
      //   mutations.forEach(mutation => {});
      // });
      // mutationObserver.observe(this.$refs["list"], {
      //   attributes: true,
      //   characterData: true,
      //   childList: true,
      //   subtree: true,
      //   attributeOldValue: true,
      //   characterDataOldValue: true
      // });
    });
  },
  updated() {
    if (!this.inited) {
      this._initScroll();
      this.mainW = this.main.offsetWidth;
      this.mainH = this.main.offsetHeight;
    }
  },
  destroyed() {
    window.removeEventListener("mouseup", this._mouseup);
    window.removeEventListener("mousemove", this._mousemove);
    window.onresize = null;
  }
};
</script>

<style lang="less" scoped>
.scroll-wrap {
  box-sizing: border-box;
  padding-bottom: 0px;
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid red;

  &-content {
    display: inline-block;
  }

  .scroll-wrap-content {
    left: 0;
    top: 0;
    border: 1px solid forestgreen;
    // padding: 10px;
    position: absolute;
    overflow: hidden;
  }
}
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 7px;
  width: 6px;
  border-radius: 5px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.05);
  opacity: 1;
  transition: opacity 250ms;
  z-index: 100;
}
.scroll-bar.on {
  opacity: 1;
}
.scroll-bar:hover {
  cursor: pointer;
}
.scroll-bar .scroll-bar-main {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  border-radius: 5px;
  background-color: rgba(67, 75, 85);
}
.scroll-bar-h {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 6px;
  border-radius: 5px;
  overflow: hidden;
  background-color: rgba(67, 75, 85, 0.6);
  cursor: pointer;
  z-index: 100;
  opacity: 1;
  transition: opacity 250ms;
}
.scroll-bar-h.on {
  opacity: 1;
  background-color: rgba(67, 75, 85, 0.6);
}
.scroll-bar-h .scroll-bar-h-main {
  position: absolute;
  left: 0;
  height: 100%;
  border-radius: 5px;
  background-color: rgba(67, 75, 85);
  cursor: pointer;
  z-index: 100;
}
.scroll-bar-h .scroll-bar-h-main.cur {
  // background-color: rgba(67,75,8, 0.6);
  transition: background-color 0.3s;
  -webkit-transition: background-color 0.3s;
  -moz-transition: background-color 0.3s;
}
</style>
