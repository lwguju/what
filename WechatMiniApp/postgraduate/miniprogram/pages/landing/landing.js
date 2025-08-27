Page({
    data:{
        landingUrl:'',
    },

    onLoad(){
        this.getImg();
    },
    getImg(){
        wx.request({
          url: 'http://182.92.158.95:8020/api/banner/list',
          method:'GET',
          header:{
              'token':'2bd039d8d5a41405b005a7bee9ca7ec7',
          },
          success:(res)=>{
              console.log(res.data);
              if(res.data.code=="000000"){
                    this.setData({landingUrl:res.data.data.result[0].file}),
                    console.log(`${this.data.landingUrl}`)
              }else{

              }
          },fail:()=>{
            console.log("请求失败")
          }
        })
    },
    gotoApply(){
        wx.navigateTo({
          url: '/pages/apply/apply',
        })
    }


 })