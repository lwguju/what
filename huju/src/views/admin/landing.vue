<script setup >
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    
    import { ElMessage ,ElMessageBox} from 'element-plus';

    import { reactive } from 'vue';
    import {computed} from 'vue';



    const token = localStorage.getItem('token');
    console.log(`${token}`);

    const addDialogVisible = ref(false);
    const openAddDialog = () => {
        addDialogVisible.value = true;
    };
    const tableData = ref([]);
    const tablePage = reactive({
        pageNo:1,
        pageSize: 10,  
        totalCount: 0 
    })

        async function fetchTableData(){
        try{
            const response=await axios.get(
                'http://182.92.158.95:8020/api/form/list',
                {headers:{ 
                    token:localStorage.getItem('token')
                },
                params:{
                    page:tablePage.pageNo,
                    rows:tablePage.pageSize
                }
            }
            )
            const res = response.data;
            console.log(res);
            if(res.code==='000000'){
                tableData.value = res.data.result;
                tablePage.pageNo=res.data.pageNo;
                tablePage.pageSize=res.data.pageSize;
                tablePage.totalCount=res.data.totalCount;
                
            }else{
                console.error('获取数据失败:', res.message);
            }   
            
        }catch(error){
            console.error('Error fetching data:', error);
            ElMessage.error('获取数据失败，请重试');
        }
    }
        onMounted(fetchTableData)

    async function handleAddSubmit() {
        try{
            const response =await axios.post(
                'http://182.92.158.95:8020/api/form/add',
                    {
                        "end_pic": addForm.footerList[0]?.url,
                        "middle_pic": addForm.middleList[0]?.url,
                        "muban": addForm.muban,
                        "name": addForm.name,
                        "start_pic": addForm.coverList[0]?.url,
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
// 在原有计算属性fileTabledate基础上修改
const fileTabledate = computed(() => {
  // 先进行状态筛选
  let filteredByStatus = tableData.value;
  if (selectedStatus.value !== 'all') {
    filteredByStatus = tableData.value.filter(
      item => item.enable.toString() === selectedStatus.value
    );
  }


  if (input.value.trim()) {
    const searchTerm = input.value.trim().toLowerCase();
    return filteredByStatus.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
  }
  
  return filteredByStatus;
});


const handleSearch = () => {
  console.log('搜索关键词:', input.value);
};




const input = ref('')


const handleCurrent= async(e)=>{
    try{
        await ElMessageBox.confirm(
            `确定要${e.enable===1?'停用':'启用'}这个落地页吗`,
            `确认操作`,
            {
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }
        );
        const response=await axios.post(
             'http://182.92.158.95:8020/api/form/enable',
             
                {
                    "act":"enable",
                    "id":e.id,
                    "val":e.enable===1?2:1

                },
                {
                headers:{
                    token:localStorage.getItem('token')     
                           }
            }
             
         
        );
        const res=response.data;
        console.log(res);
        if(res.code==='000000'){
            ElMessage.success('操作成功'),
            fetchTableData();
        }else{
            ElMessage.error('操作失败');
        }
    }catch(error){
        if(error==="cancel"){
            ElMessage.info('已取消')
        }else{
            ElMessage.error('网络错误')
        }
    }

};





 // 编辑

    const editDialog = ref(false);
    const openDialog = (row) => {

  addForm.name = row.name; 
  addForm.muban = row.muban || '1'; 

    addForm.coverList =  [{ url: row.start_pic }]; 
    addForm.middleList =  [{ url: row.middle_pic }] ; 
    addForm.footerList =  [{ url: row.footer_pic }] ; 
    editDialog.value = true;
    };
    const editName=ref();
    const editNameid=ref();

        async function changeSubmit() {
        try{
            const response =await axios.post(
                'http://182.92.158.95:8020/api/form/edit',
                    {
                        "id": editNameid.value, 
                        "name": addForm.name, 
                        "muban": Number(addForm.muban), 
                        "start_pic": addForm.coverList[0]?.url, 
                        "middle_pic": addForm.middleList[0]?.url || '', 
                        "end_pic": addForm.footerList[0]?.url 
                        
                    },
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
                editDialog.value=false;
                fenchTableData();
            }
            else{
                ElMessage.error('上传失败，请重试');
            }          
        }catch(error){
            console.error('Error uploading data:', error);
            ElMessage.error('上传失败，请重试');
        }
    }
    // 编辑





import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？', 
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' 
      }
    );
    localStorage.removeItem('token');
    router.push('/login'); 
    ElMessage.success('退出登录成功');
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消退出');
    } else {
      ElMessage.error('退出失败，请重试');
    }
  }
};
</script>

<template>
  <div class="common-layout">
    <el-container width="100vw" height="100vh">
      <el-aside width="200px" height="100vh" class="sidebar" >
        <el-menu default-active="1" class="el-menu-vertical-demo">
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
         <el-button 
                index="6" 
                @click="handleLogout" 
                style="margin-left: auto;" 
            >
                登出
            </el-button>
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
                    />  
                 <!-- 筛选状态 -->

                 <!-- 搜索 -->
            <div class="flex gap-4">
                <el-input
                    v-model="input"
                    style="width: 240px"
                    placeholder="请输入账号或姓名检索"
                >
                    <template #prefix>
                    <el-icon class="el-input__icon"><Search /></el-icon>
                    </template>
                </el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            </div>
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
                                            console.log(`${response.data.url}`);
                                            file.url=response.data.url;
                                            addForm.middleList = [file]; 
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
                                            console.log(`${response.data.url}`);
                                            file.url=response.data.url;
                                           addForm.footerList = [file]; 
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
                   

            <!-- 新增弹窗222222222 -->
                    <el-dialog v-model="editDialog" title="新增落地页">
                        
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
                                            console.log(`${response.data.url}`);
                                            file.url=response.data.url;
                                            addForm.middleList = [file]; 
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
                                            console.log(`${response.data.url}`);
                                            file.url=response.data.url;
                                           addForm.footerList = [file]; 
                                        }"
                                    >
                                        <div v-if="addForm.footerList.length === 0" class="el-upload__icon">+</div>
                                    </el-upload>
                                    </el-form-item>
                          </el-form>
                          
                          <!-- 底部按钮 -->
                             <template #footer>
                                <el-button @click="editDialog = false">取消</el-button>
                                <el-button type="primary" @click="changeSubmit">提交</el-button>
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
                        <el-button type="text" size="small" @click="openDialog(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="text" size="small" @click="handleCurrent(scope.row)">
                     
                                {{scope.row.enable===2?'启用':'停用'}}
                          
                        </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                
                <!-- 翻页 -->


            <div class="demo-pagination-block" style="margin-top: 20px; text-align: right;" >
                <el-pagination
                    v-model:page-size="tablePage.pageSize"
                    :page-sizes="[1, 10, 50, 100,200]"
                    v-model:current-page="tablePage.pageNo"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tablePage.totalCount"
                    @size-change="(val)=>{
                        tablePage.pageSize=val;
                        fetchTableData();
                    }"
                    @current-change="(val)=>{
                        tablePage.pageNo=val
                        fetchTableData();
                    }"
                />
            </div>
                <!-- 翻页 -->

                
                


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
