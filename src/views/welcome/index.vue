<template>
  <div class="welcome-wrap">
    <div class="welcome-img">
      <img src="../../assets/logo.png" alt="" />
    </div>
    <div class="title-wrap">
      <h1 data-spotlight="Vue3+vite+ts+pinia">Vue3+vite+ts+pinia</h1>
    </div>
  </div>
</template>

<script setup>
import {} from 'vue'
</script>

<style lang="less" scoped>
.welcome-wrap {
  width: 1000px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 100px;
  .welcome-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: auto;
    box-shadow: 6px 5px 10px #333333;
    margin-bottom: 20px;
    img {
      height: 120px;
      width: 100%;
      border-radius: 50%;
    }
  }
}
.title-wrap {
  display: flex;
  justify-content: center;
}
h1 {
  color: #97a8be;
  font-family: Helvetica;
  margin: 0;
  padding: 0;
  font-size: 6rem;
  letter-spacing: -0.3rem;
  position: relative;
}

h1::after {
  content: attr(data-spotlight);
  color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-clip-path: ellipse(100px 100px at 0% 50%);
  clip-path: ellipse(100px 100px at 0% 50%);
  animation: spotlight 5s infinite;
  background-image: url(https://images.unsplash.com/photo-1579547621869-0ddb5f237392?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80);
  background-size: 150%;
  background-position: center center;
  -webkit-background-clip: text;
  background-clip: text;
}

@keyframes spotlight {
  0% {
    -webkit-clip-path: ellipse(100px 100px at 0% 50%);
    clip-path: ellipse(100px 100px at 0% 50%);
  }

  50% {
    -webkit-clip-path: ellipse(100px 100px at 100% 50%);
    clip-path: ellipse(100px 100px at 100% 50%);
  }

  100% {
    -webkit-clip-path: ellipse(100px 100px at 0% 50%);
    clip-path: ellipse(100px 100px at 0% 50%);
  }
}
</style>
