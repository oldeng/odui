<template>
  <div class="od-imguploader">
    <div class="od-imguploader-picker">
      <i class="iconfont icon-tianjia2" @click="clickHandler"></i>
      <input type="file" class="od-imguploader-file"/>
    </div>
    <div v-if="isExistImg" class="od-imguploader-uploader">
      <img :src="imgUrl" alt="">
    </div>
  </div>
</template>

<script>

  const prefixCls = 'od-imguploader';
  export default {
    name: "ImgUploader",
    data: function () {
      return {
        prefixCls: prefixCls,
        // imgUrl: this.imgUrl,
        // uploadUrl: this.uploadUrl,
        file: null,
        isExistImg: false
      }
    },
    props: {
      imgUrl: String,
      uploadUrl: String
    },
    mounted: function () {
      let isExistImg = this.checkImgUrl();
      this.isExistImg = isExistImg;
    },
    methods: {
      checkImgUrl: function () {
        if (typeof this.imgUrl === 'undefined' ||  this.imgUrl == '') {
          return false;
        } else {
          return true;
        }
      },
      clickHandler: function ($event) {
        let file = $event.target.nextElementSibling;
        this.file = null;
        this.file = file;
        //绑定选择图片事件
        file.addEventListener('change', this.fileChangeHandler, false);
        file.click();
      },
      fileChangeHandler: function () {
        this.uploadImg(this.file.files[0], this.uploadUrl, this.successHandler, this.progressHandler);
      },
      successHandler: function () {
        //图片上传成功回调
        console.log('upload success');
        //读取上传后的图片地址
      },
      progressHandler: function (event) {
         if (event.lengthComputable) {
           var complete = Number.parseInt(event.loaded / event.total * 100);
         }
      },
      uploadImg: function (file, uploadUrl, successHandler, progressHandler) {
        var formData = new FormData();
        var xhr = new XMLHttpRequest();
        formData.append('file', file);
        xhr.onload = successHandler;
        xhr.upload.onprogress = progressHandler;
        xhr.open('post', uploadUrl, true);
        xhr.send(formData);
      }
    }
  }
</script>
