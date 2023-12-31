<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="请输入用户邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-form-item prop="verifyCode" style="display: flex; align-items: center;">
        <div style="display: flex; align-items: center; justify-content: space-between">
          <el-input
            v-model="loginForm.verifyCode"
            placeholder="请输入验证码"
            name="verifyCode"
            type="text"
            tabindex="3"
            auto-complete="on"
          />
          <el-button
            type="primary"
            style="margin-left: 150px"
            @click="sendVerifyCode"
          >发送验证码</el-button>
        </div></el-form-item>
      <br>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px margin-right: 10px"
        @click.native.prevent="handleLogin"
      >登 录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: 'admin@example.com',
        password: 'admin123',
        verifyCode: ''
      },
      loginRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          console.log('Login')
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((res) => {
              // TODO: 查找哪里使用了 sessionStorage 里的 token 信息
              // // sessionStorage 用于本地持久化存储
              // sessionStorage('token', res.data.token)
              // sessionStorage('userInfo', res.data.userInfo)
              // 调用 mutation 存储 token，用于拦截器使用
              this.$store.commit('SET_TOKEN', res.data.token)
              this.loading = false
              this.$message({
                message: 'Successfully login!',
                type: 'success'
              })
            })
            .catch((err) => {
              this.loading = false
              this.$message({
                message: err,
                type: 'error'
              })
            })
        } else {
          this.$message({
            message: '表单格式不正确!',
            type: 'error'
          })
          return false
        }
      })
    },
    sendVerifyCode() {
      this.$store
        .dispatch('user/sendVerifyCode', this.email)
        .then((res) => {
          if (res.status === 'success') {
            this.$message({
              message: '验证码已发送，请查收您的邮箱',
              type: 'success'
            })
          } else {
            this.$message({
              message: '出错，验证码未发送',
              type: 'error'
            })
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #3b5898;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

</style>

