<template>
  <div :class="[prefixCls]">
    <div :class="[prefixCls + '-btn-box']">
      <input type="button" value="截图" @click="clickHandler"/>
    </div>
    <div :class="[prefixCls + '-content']">
      <div ref="shotImgContainer" :class="[prefixCls + '-imgBox']">
      </div>
    </div>
  </div>
</template>
<script>
  import html2canvas from 'html2canvas';

  const types = {
    PNG: "PNG",
    JPG: "JPG",
    BMP: "BMP"
  };
  const prefixCls = 'od-screenshot';
  export default {
    name: "screenshot",
    data: function () {
      return {
        // html2canvas: html2canvas
        prefixCls: prefixCls,
        content: undefined
      };
    },
    props: ["lable",'node'],
    methods: {

      clickHandler: function ($event) {
        let self = this;
        html2canvas(this.node.ele.$el).then(function (canvas) {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          let imgBox = self.$refs.shotImgContainer;
          let child = imgBox.children;
          if (child.length != 0) {
            imgBox.removeChild(child[0]);
            imgBox.appendChild(canvas);
          } else {
            imgBox.appendChild(canvas);
          }
        });
      }
    }
  }
</script>
