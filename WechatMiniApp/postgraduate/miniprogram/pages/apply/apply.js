// pages/apply/apply.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
          img:'',
          imgFoot:'',
          userName: '',  
          userPhone: '' ,
          x:[],
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
          this.getImg();
    },
    getImg(){
        wx.request({
          url: 'http://182.92.158.95:8020/api/form/detail',
          method:'GET',
          data:{id:4,},
          header:{
              'token':'2bd039d8d5a41405b005a7bee9ca7ec7',
          },
          success:(res)=>{
              console.log(res.data);
              if(res.data.code=="000000"){
                  this.setData({img:res.data.data.start_pic});
                  const rawimgFoot=res.data.data.end_pic;
                  const imgFoot=rawimgFoot.split(',');
                  this.setData({imgFoot:imgFoot});
                  console.log(this.data.imgFoot);
              }
          },fail:()=>{
  
          }
        })
    },
    chooose(e){ 
        if(e.target.dataset.a==='a')
        this.setData({ "x[1]": e.target.dataset.type});
            else
        this.setData({ "x[0]": e.target.dataset.type});
        
      console.log("已选答案", this.data.x);
    },
  
  
  
    onNameInput(e) {
      this.setData({ userName: e.detail.value });
    },
  
    onPhoneInput(e) {
      this.setData({ userPhone: e.detail.value });
    },
    onAuthTap(){console.log(this.data.userName);
          this.setData({userName:''});
          this.setData({userPhone:''});
          
    },
    scrollToResult() {
      wx.pageScrollTo({
        selector: '.x', 
        duration: 300, 
        success: () => {
          console.log('滚动到结果区域成功');
        }
      });
    }
  
    
  })