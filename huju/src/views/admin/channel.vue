<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    
    import { ElMessage } from 'element-plus';
    import type { FormInstance } from 'element-plus'
    import { reactive } from 'vue';
    import {computed} from 'vue';

import { Calendar, Search } from '@element-plus/icons-vue'
    const token = localStorage.getItem('token')

    const addDialogVisible = ref(false);
    const openAddDialog = () => {
        addDialogVisible.value = true;
    };
    const tableData = ref([]);

        async function fenchTableData(){
        try{
            const response=await axios.get(
                'http://182.92.158.95:8020/api/channel/list',
                {headers:{ 
                    token:localStorage.getItem('token')
                }}
            )
            const res = response.data;
            console.log(res);
            if(res.code==='000000'){
                tableData.value = res.data.result;
            }else{
                console.error('获取数据失败:', res.message);
            }   
            
        }catch(error){
            console.error('Error fetching data:', error);
            ElMessage.error('获取数据失败，请重试');
        }
    }
        onMounted(fenchTableData);

    async function handleAddSubmit() {
        try{
            const response =await axios.post(
                'http://182.92.158.95:8020/api/form/add',
                    {
                        "end_pic": addForm.footerList[0].url,
                        "middle_pic": addForm.middleList[0].url,
                        "muban": addForm.muban,
                        "name": addForm.name,
                        "start_pic": addForm.coverList[0].url,
                    } ,
                    {
                        headers:{
                        token: localStorage.getItem('token')
                    }
                    }
            );  
            const res = response.data;
            console.log(res);
            if(res.code==='000000'){
                ElMessage.success('成功上传');
                addDialogVisible.value=false;
                fetchTableData();
            }
            else{
                ElMessage.error('上传失败，请重试');
            }          
        }catch(error){
            console.error('Error uploading data:', error);
            ElMessage.error('上传失败，请重试');
        }
    }
    const addForm = reactive({
        name: '',
        muban: '1',
        coverList: [],
        middleList: [],
        footerList: [],
    });



    const options = [
  {
    value: 'all',
    label: '全部状态',
  },
  {
    value: '1',
    label: '已启用',
  },
  {
    value: '2',
    label: '已停用',
  }
]

const selectedStatus=ref('all');  
const fileTabledate=computed(()=>{
    if(selectedStatus.value==='all')
        return tableData.value;
    return tableData.value.filter(item=>item.enable.toString()===selectedStatus.value)
})



const input = ref('')
</script>

<template>
  <div class="common-layout">
    <el-container width="100vw" height="100vh">
      <el-aside width="200px" height="100vh" class="sidebar" >
        <el-menu default-active="5" class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="$router.push('/admin/landing')">落地页</el-menu-item>
          <el-menu-item index="2" @click="$router.push('/admin/info')">资料列表</el-menu-item>
            <el-menu-item index="3" @click="$router.push('/admin/banner')">广告管理</el-menu-item>
            <el-menu-item index="4" @click="$router.push('/admin/list')">线索数据</el-menu-item>
            <el-menu-item index="5" @click="$router.push('/admin/channel')">渠道管理</el-menu-item>
        </el-menu>
           
      </el-aside>

      <el-container>
        <el-header style="background-color: white;">
            <!-- 面包屑组件：Element Plus 提供 -->
            <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: 'landing' }">落地页</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-main>

            <div class="top">
                <!-- 新增落地页 -->
                    <div style="margin:20px 0;">
                        <el-button type="primary" @click="openAddDialog">添加落地页</el-button>
                    </div>
                <!-- 新增落地页 -->
                 <!-- 筛选状态 -->
                    <el-select
                        v-model="selectedStatus"
                        :options="options"
                        placeholder="全部状态"
                        style="width: 240px"
                        @change="filterTable"
                    />  
                 <!-- 筛选状态 -->

                 <!-- 搜索 -->
        


                 <!-- 搜索 -->

</div>
                <!-- 新增弹窗 -->
                    <el-dialog v-model="addDialogVisible" title="新增落地页">
                        
                            <el-radio-group v-model="addForm.muban">
                                <el-radio :value="1">模版1</el-radio>
                                <el-radio :value="2">模版2</el-radio>
                            </el-radio-group>
                    

                          <el-form :model="addForm" label-width="120px">
                            <!-- 名称 -->
                                <el-form-item label="落地页名称" prop="name">
                                    <el-input v-model="addForm.name" placeholder="请输入落地页名称"></el-input>
                                </el-form-item>

                            <!-- 首图 -->
                                <el-form-item label="落地页首图">
                                    <el-upload 
                                        action="http://182.92.158.95:8020/api/uploads" 
                                        list-type="picture-card"
                                          :headers="{ token }"
                                        :file-list="addForm.coverList"
                                        :on-success="(response,file)=>{
                                            console.log(`${response.data.url}`);

                                            file.url=response.data.url;
                                           addForm.coverList = [file]; 
                                            
                                        }"
                                    >   
                                        <div v-if="addForm.coverList.length === 0" class="el-upload__icon">+</div>
                                    </el-upload>
                                    </el-form-item>
                                    <!-- 中图 -->
                                      <el-form-item label="落地页中图">
                                    <el-upload 
                                        action="http://182.92.158.95:8020/api/uploads" 
                                        list-type="picture-card"
                                          :headers="{ token}"
                                        :file-list="addForm.middleList"
                                        :on-success="(response,file)=>{
                                            file.url=response.data.url;
                                            addForm.coverList = [file]; 
                                        }"
                                    >
                                        <div v-if="addForm.middleList.length === 0" class="el-upload__icon">+</div>
                                    </el-upload>
                                    </el-form-item>
                            <!-- 结尾图 -->
                              <el-form-item label="落地页尾图">
                                    <el-upload 
                                        action="http://182.92.158.95:8020/api/uploads" 
                                        list-type="picture-card"
                                          :headers="{ token }"
                                        :file-list="addForm.footerList"
                                        :on-success="(response,file)=>{
                                            file.url=response.data.url;
                                           addForm.coverList = [file]; 
                                        }"
                                    >
                                        <div v-if="addForm.footerList.length === 0" class="el-upload__icon">+</div>
                                    </el-upload>
                                    </el-form-item>
                          </el-form>
                          
                          <!-- 底部按钮 -->
                             <template #footer>
                                <el-button @click="addDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="handleAddSubmit">提交</el-button>
                            </template>
                    </el-dialog>
                   




                <!-- 表格 -->
                 <el-table :data="fileTabledate" border style=" width: 100%; height: 100%">
                    <el-table-column prop="id" label="落地页id" width="180">
                        <template #default="scope">
                        {{ scope.row.id }}
                        </template>

                    </el-table-column>
                    <el-table-column prop="name" label="落地页名称" width="180">
                        <template #default="scope">
                        {{ scope.row.name }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="添加时间" width="180">
                        <template #default="scope">
                        {{ new Date(scope.row.create_time*1000).toLocaleString () }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="enable" label="状态" width="180">
                        <template #default="scope">
                        {{ scope.row.enable===1?'已启用':'已停用' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="220">
                        <template #default="scope">
                         <el-button type="text" size="small" @click="handleCopy(scope.row)">
                            复制链接
                        </el-button>
                        <el-button type="text" size="small" @click="handleCopy(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="text" size="small" @click="handleCopy(scope.row)">
                            停用
                        </el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </el-main>
      </el-container>

    </el-container>


  </div>
</template>

<style scoped>
.operation-bar {
  margin-bottom: 20px;
}
.sidebar {
  background-color: black;
}
.el-menu,.el-menu-item {
  color: white;
  background-color: black;
}
.common-layout {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
  height: 100vh;
  background-color: #f0f2f5;
}

.el-container {
  height: 100%; 
}
.el-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
}
.el-main{
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

}

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
.el-main{
    align-items: flex-start;
    background-color: white;
    margin: 20px 0 0 20px;
}

.top{
    width: 100%;
    display: flex;
    align-items: center;


}
.top>*:not(:first-child){
    margin-left: auto;
    gap: 10px;
}

</style>
