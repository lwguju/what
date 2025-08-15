<script setup>
import { reactive,ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';

const form = reactive({
    username: '',
    password: ''
});

const rules={
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
}

const formRef = ref(null);

// 验证

const router = useRouter();
// 路由跳转
const handlelogin = async () => {
    formRef.value.validate(async (valid)=>{
        if (valid) {
            try {
                const response = await axios.post(
                   'http://182.92.158.95:8020/api/login',
                    {
                        username: form.username,
                        password: form.password
                    }
                )

                const res= response.data;
                if (res.code === '000000') {
                    ElMessage.success('登录成功');
                    localStorage.setItem('token', res.data.token);
                    router.push('/admin/landing');
                } else {
                    ElMessage.error(res.message || '登录失败，请重试');
                }
            } catch (error) {
                console.error('登录失败:', error);
                ElMessage.error('登录失败，请重试');
            }
    } else{
                ElMessage.error('表单验证失败，请检查输入');
                return false;
            }   
    })
}
</script>

<template>
<div class="login-container">
    <div class="login-card">
        <h4>账号密码登陆</h4>
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules">
                *账号
                <el-form-item prop="username">
                    <el-input v-model="form.username" style="width: 240px" placeholder="请输入账号" />
                </el-form-item>
                *密码
                <el-form-item prop="password">
                    <el-input v-model="form.password" style="width: 240px" placeholder="请输入密码" type="password" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" style="width: 240px" @click="handlelogin">登录</el-button>
                </el-form-item>
            </el-form>
    </div>
</div>

</template>

<style scoped>
    .login-container{
        position: fixed;
        left: 0;
        top: 0;
        width:  100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: black;
    }
    .login-card{
        width: 300px;
        height: 300px;
        padding: 30px 50px 30px 50px ;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background-color: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
</style>