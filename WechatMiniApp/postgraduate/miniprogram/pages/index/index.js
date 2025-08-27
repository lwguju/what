Page({
    data: {
      currentQ: 0,
      totalQ: 3,
      answers: [] ,
      landingUrl:'',
      showBackground:false,
    },
  onLoad(){
      this.getImg();
  },
    chooose(e){ 
      const currentQ = this.data.currentQ;
      const selectA = e.currentTarget.dataset.ans;
  
      const newAnswers = [...this.data.answers]; 
      newAnswers[currentQ] = selectA;
      this.setData({ answers: newAnswers });
  
      console.log("已选答案", this.data.answers);
  
      if (currentQ < 2) {
        this.setData({ currentQ: currentQ + 1 });
      }
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
                    this.setData({landingUrl:res.data.data.result[1].file}),
                    console.log(`${this.data.landingUrl}`)
              }else{

              }
          },fail:()=>{
            console.log("请求失败")
          }
        })
    },

    goto(){
        this.setData({showBackground:true});
    },
    gotoLanding(){
        wx.navigateTo({
          url: '/pages/landing/landing',
        })
    },
    gotoAd(){
        wx.navigateTo({
          url: '/pages/ad/ad',
        })
    },
  })