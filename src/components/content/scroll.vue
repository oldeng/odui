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
    vWidth: {
      type: Number
      // default: 300
    },
    vHeight: {
      type: [Number, String]
      // default: '100%'
    },
    rate: {
      type: [Number]
    }
  },
  computed: {
    contentStyle: function() {
      //计算缩放
      this.scale();
      return {
        width: this.vWidth + "px",
        height: this.vHeight + "px"
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

      this._set();
      this._refresh();
    },
    //设置画布可视区宽高
    _setViewSize() {
      let parentContent = this.$parent.$el;
      this.width = parentContent.offsetWidth;
      this.height = parentContent.offsetHeight;
    },
    // 设置参数
    _set() {
      this.mouse = {}; // mouse对象
      this.wrapper.style.position = "relative";
    },
    // 计算刷新
    _refresh() {
      //容器宽高
      this.wrapperW = this.wrapper.offsetWidth;
      this.wrapperH = this.wrapper.offsetHeight;
      //内容宽高
      this.listH = this.list.children[0].offsetHeight;
      this.listW = this.list.children[0].offsetWidth;
      //横向滚动条宽高
      this.barHW = this.barH.offsetWidth;
      this.barHH = this.barH.offsetHeight;
      this.barHMainWidth = this.barHMain.offsetWidth;
      //纵向滚动条宽高
      this.barVW = this.barV.offsetWidth;
      this.barVH = this.barV.offsetHeight;
      /**
       * 横向
       */
      if (this.horizontal) {
        this.horizontalShow = true;
        this.barHMain.style.width = `${(this.wrapperW / this.listW) *
          this.barHW}px`;
        this.barHMainWidth = (this.wrapperW / this.listW) * this.barHW;

        this.$nextTick(() => {
          if (this.pattern === "center") {
            this.barHMain.style.left =
              (this.wrapperW - this.barHMainWidth) / 2 + "px";
            this.mouse.nowX = (this.wrapperW - this.barHMainWidth) / 2;
          }
          this.barMinX = this.barH.getBoundingClientRect().left;
          this.barMaxX = Math.floor(this.barH.offsetWidth);
        });
      }
      /**
       * 纵向
       */
      if (this.vertical) {
        this.verticalShow = true;
        // this.resetY();
        this.$nextTick(() => {
          if (this.wrapperH <= this.listH) {
            this.barVMain.style.height =
              (this.wrapperH / this.listH) * this.wrapperH + "px";
            if (this.pattern === "center") {
              this.barVMain.style.top =
                (this.barVH - this.barVMain.offsetHeight) / 2 + "px";
            }
          } else {
            this.barVMain.style.height = this.barV.style.height =
              this.wrapperH + "px";
          }
          this.barMinY = this.barV.getBoundingClientRect().top;
          this.barMaxY = Math.floor(this.barV.offsetHeight);
        });
      }
      //重置画布可视区大小
      this.$nextTick(() => {
        this._setViewSize();
      });
    },
    _down(event) {
      this.mouse.startX = event.clientX;
      this.mouse.switch = true;
      this.mouse.x = event.target.offsetLeft;
      console.log("x轴滚动条", "startX", event.clientX);
      console.log("x轴滚动条", "offsetLeft", event.target.offsetLeft);
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
    _enter() {
      if (this.verticalShow) {
        this.verticalCur = true;
      }
      if (this.horizontalShow) {
        this.horizontalCur = true;
      }
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
      this.horizontalCur = true;
      let offset = vx - this.mouse.startX;
      this.mouse.startX = vx;
      let scrollWidth = this.$refs["barVMain"].offsetWidth;
      if (offset > 0) {
        //向右移动  barMaxX:最大右移动至
        this.mouse.offset = offset;
        if (this.barHMain.offsetLeft > this.barHW - this.barHMainWidth) {
          this.barHMain.style.left = this.barHW - this.barHMainWidth + "px";
        } else {
          this.barHMain.style.left = this.barHMain.offsetLeft + offset + "px";
        }
      } else {
        //向左移动
        if (this.barHMain.offsetLeft < 0) {
          this.barHMain.style.left = 0 + "px";
        } else {
          this.barHMain.style.left = this.barHMain.offsetLeft + offset + "px";
        }
      }
      this.list.children[0].style.left =
        this.list.children[0].offsetLeft +
        (-offset / (this.wrapperW - this.barHMainWidth)) * this.listW +
        "px";
      console.log("比例", -offset / this.wrapperW);
      console.log("做边距");
    },
    _scrollY_To(y, type) {
      this.verticalCur = true;
      let offset = this.mouse.startY - y;
      this.mouse.startY = y;
      let percent = offset / (this.barVH - this.barVMain.offsetHeight);
      if (offset < 0) {//向下移动
        if (this.barVMain.offsetTop > this.barVH - this.barVMain.offsetHeight) {
          this.barVMain.style.top = this.barVH - this.barVMain.offsetHeight + "px";
          return;
        } 
      } else {//上移动
        if (this.barVMain.offsetTop < 0) {
          this.barVMain.style.top = 0;
          return;
        } 
      }
      this.list.children[0].style.top = this.list.children[0].offsetTop + percent * (this.listH - this.listH * this.rate) + "px";
      this.barVMain.style.top = this.barVMain.offsetTop - offset + "px";
    },
    _animated(el, direction) {
      clearTimeout(this.timer);
      this.refList.style.transition = direction + " " + this.speed + "ms";
      el.style.transition = direction + " " + this.speed + "ms";
      this.timer = setTimeout(() => {
        el.style.transition = direction + " " + "0ms";
        this.refList.style.transition = direction + " " + "0ms";
      }, this.speed);
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
      //TODO
    },
    _mousemove(event) {
      if (this.mouse && this.mouse.switch) {
        window.getSelection
          ? window.getSelection().removeAllRanges()
          : document.selection.empty(); // 禁止拖动时选中文本
        this._scrollX_To(event.clientX);
      }
      if (this.mouse && this.mouse.switchY) {
        window.getSelection
          ? window.getSelection().removeAllRanges()
          : document.selection.empty(); // 禁止拖动时选中文本
        this._scrollY_To(event.clientY);
      }
      return false;
    },
    resetY() {
      this.list.style.top = "0";
      this.barVMain.style.top = "0";
    },
    scale() {
      this.$nextTick(() => {
        let widthRate = 1;
        let heightRate = 1;
        if (
          this.$refs["wrapper"].offsetWidth < this.$refs["list"].offsetWidth
        ) {
          widthRate =
            this.$refs["wrapper"].offsetWidth / this.$refs["list"].offsetWidth;
          heightRate =
            this.$refs["wrapper"].offsetHeight /
            this.$refs["list"].offsetHeight;
        }
        setTimeout(() => {
          this.$emit(
            "callbacks",
            widthRate < heightRate ? widthRate : heightRate
          );
        }, 1000);
      });
    },
    setLeftTop() {
      this.$nextTick(() => {
        this.$refs["list"].style.left =
          (this.$refs["wrapper"].offsetWidth - this.$refs["list"].offsetWidth) /
            2 +
          "px";
        this.$refs["list"].style.top =
          (this.$refs["wrapper"].offsetHeight -
            this.$refs["list"].offsetHeight) /
            2 +
          "px";
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("mousemove", this._mousemove);
      window.addEventListener("mouseup", this._mouseup);
      this.$refs["wrapper"].addEventListener("mouseenter", event => {
        console.log("鼠标进入更新滚动条");
        if (this.pattern !== "center") {
          this._refresh();
        }
      });
      this.vertical
        ? this.$refs.wrapper.addEventListener("wheel", this._wheel)
        : "";
      window.onresize = () => {
        this._refresh();
        this.horizontal ? this._scrollX_To(this.mouse.nowX, "set") : "";
        this.vertical ? this._scrollY_To(this.mouse.nowY, "set") : "";
      };
      let mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {});
      });

      mutationObserver.observe(this.$refs["list"], {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
      });
    });
  },
  updated() {
    if (!this.inited) {
      this._initScroll();
      this._setViewSize();
      this.inited = true;
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
    border: 1px solid forestgreen;
    padding: 10px;
    position: absolute;
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
