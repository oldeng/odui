<template>
  <div>
    <div style="width: 100px; height: 100px; border: 1px solid red;">div1</div>
    <div style="width: 100px; height: 100px; border: solid goldenrod 1px ;">
      <ImgUploader :imgUrl="imgUrl" :uploadUrl="uploadUrl"></ImgUploader>
    </div>
  </div>
</template>

<script>
    export default {
        name: "div1",
      data: function () {
          return {
            imgUrl: undefined,//http://localhost:8888/static/img/user.png
            uploadUrl: 'http://localhost:3000/upload'
          }
      },
      mounted: function () {
          console.log('hello');
      }
    }
</script>

<style scoped>

</style>
